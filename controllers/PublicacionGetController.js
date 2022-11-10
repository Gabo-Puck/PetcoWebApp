var Registro = require("../models/Registro");
var Usuario = require("../models/Usuario");
var Municipio = require("../models/Municipio");
var objection = require("objection");
const Mascota = require("../models/Mascota");
const Publicacion = require("../models/Publicacion");
const Metas = require("../models/Metas");
const Comentario = require("../models/Comentario");

//Configuracion de paypal
const paypal = require("paypal-rest-sdk");
const Donaciones = require("../models/Donaciones");
const Like = require("../models/Like");
const Publicacion_Guardada = require("../models/Publicacion_Guardada");
const Reporte_Publicacion = require("../models/Reporte_Publicacion");
const { sendNotificacion } = require("./NotificacionesController");
const { forEach } = require("lodash");
const { createPromisesImagenesMascotas } = require("./InicioController");
const { createPromiseGetPfp } = require("./PerfilController");

paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id:
    "AYL9M1NxDLdbFrVbI6gzwbjtOzC_PRhxP6vn65xWqmaqZA8uKDv6mmKvkKqEBIqUe2cNWBXCezt-CG85",
  client_secret:
    "EP0JlIun8tIoxFQjUjho4CfyPdF-6A042JxLl4EjyjZQIH3g50DuopJcLynP4z4mTDjuxACCye40Hi-p",
});
function validateUsuarioResponder(res, mascotas) {
  // res.solicitudesValNumero = true;
  res.arrayMascotasSolicitud = [];
  let countSolicitudesConsideracion = 0;
  console.log(res.UsuarioSolicitudes[0].Solicitudes);
  if (Array.isArray(res.UsuarioSolicitudes[0].Solicitudes)) {
    res.UsuarioSolicitudes[0].Solicitudes.forEach((UsuarioSolicitud) => {
      // console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAA");
      if (UsuarioSolicitud.Estado == 0 || UsuarioSolicitud.Estado == 1) {
        countSolicitudesConsideracion++;
      }
      mascotas.forEach((m) => {
        console.log(UsuarioSolicitud.ID_Mascota, m.ID);
        if (
          UsuarioSolicitud.ID_Mascota == m.ID &&
          UsuarioSolicitud.Estado >= 0
        ) {
          res.arrayMascotasSolicitud.push(m.ID);
        }
      });
    });
  }
  console.log(
    "🚀 ~ file: PublicacionGetController.js ~ line 44 ~ mascotas.forEach ~ res.arrayMascotasSolicitud",
    res.arrayMascotasSolicitud
  );
  if (countSolicitudesConsideracion < 3) {
    res.solicitudesValNumero = false;
  } else {
    res.solicitudesValNumero = true;
  }
}

function getSolicitudes(req, res, next) {
  Usuario.query()
    .withGraphJoined("Solicitudes")
    .where("usuario.ID", "=", req.session.IdSession)
    .then((UsuarioSolicitudes) => {
      console.log(UsuarioSolicitudes);
      res.UsuarioSolicitudes = UsuarioSolicitudes;
      next();
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
}
exports.query = [
  getSolicitudes,
  (req, res, next) => {
    Like.query()
      .where("like.ID_Publicacion", "=", req.params.idPublicacion)

      .then((LikesP) => {
        Comentario.query()
          .withGraphJoined("ComentariosPublicacion")
          .withGraphJoined("ComentariosUsuario.UsuarioRegistro")
          .where("comentario.ID_Publicacion", "=", req.params.idPublicacion)
          .orderBy("Fecha_Envio", "desc")
          .then((result) => {
            Mascota.query()
              .withGraphJoined(
                "MP.PublicacionUsuario.[UsuarioRegistro.muni.estado]"
              )
              .withGraphJoined("MascotasCastrado")
              .withGraphJoined("MascotasTamano")
              .withGraphJoined("MascotasEspecie")
              .withGraphJoined("MascotasVacunas")
              .withGraphJoined("MascotasSalud")
              .withGraphJoined("MascotasEstado")
              .withGraphJoined("MascotasImagenes")
              .withGraphJoined("MascotasProceso.[Paso.[Proto]]")
              .withGraphJoined("MascotasMetas.MetasDonaciones")
              .where("mascota.ID_Publicacion", "=", req.params.idPublicacion)
              .then((MascotaP) => {
                if (MascotaP.length == 0) {
                  res.redirect("/login");
                  return;
                }
                let isDueno = false;
                if (
                  req.session.IdSession == MascotaP[0].MP.PublicacionUsuario.ID
                ) {
                  isDueno = true;
                }
                // console.log(MascotaP);
                validateUsuarioResponder(res, MascotaP);
                console.log("BBBBBBBBBBBBBBBBBB");
                console.log(res.solicitudesValNumero);
                console.log(res.arrayMascotasSolicitud);
                let promises = [];
                for (let index = 0; index < MascotaP.length; index++) {
                  const mascota = MascotaP[index];
                  for (
                    let indexImagen = 0;
                    indexImagen < mascota.MascotasImagenes.length;
                    indexImagen++
                  ) {
                    const imagenRuta = mascota.MascotasImagenes[indexImagen];
                    promises.push(
                      createPromisesImagenesMascotas(
                        mascota,
                        imagenRuta.Ruta,
                        req.app.storageFirebase,
                        indexImagen
                      )
                    );
                  }
                }
                result.forEach((comentarioPublicacion) => {
                  promises.push(
                    createPromiseUsuarioComentario(
                      comentarioPublicacion,
                      req.app.storageFirebase
                    )
                  );
                });
                promises.push(
                  createPromiseGetPfp(
                    MascotaP[0].MP.PublicacionUsuario.Foto_Perfil,
                    req.app.storageFirebase
                  ).then((url) => {
                    MascotaP[0].MP.PublicacionUsuario.Foto_Perfil = url;
                  })
                );
                Promise.all(promises)
                  .then(() => {
                    let publicacionID = MascotaP[0].MP.ID;
                    Registro.query()
                      .withGraphJoined("RegistroUsuario")
                      .where("RegistroUsuario.ID", "=", req.session.IdSession)
                      .then((resultados) => {
                        res.render("publicacion.ejs", {
                          MascotaRender: MascotaP,
                          usuario: resultados,
                          comentarios: result,
                          likesp: LikesP,
                          isDueno: isDueno,
                          publicacionID: publicacionID,
                          Tipo: req.session.Tipo,
                          SolicitudesValNumero: res.solicitudesValNumero,
                          arrayMascotasSolicitud: res.arrayMascotasSolicitud,
                        });
                      });
                  })
                  .catch((err) => {
                    console.log(err);
                    next(err);
                  });
              });
          });
      });
  },
];

exports.likes = (req, res, next) => {
  if (req.params.accion == 0) {
    Like.query()
      .where("like.ID_Publicacion", "=", req.params.idP)
      .andWhere("like.ID_Usuario", "=", req.params.idU)
      .then((resp) => {
        console.log(resp);
        console.log(req.params);
        res.json(resp);
      });
  }

  if (req.params.accion == 1) {
    Like.query()
      .insert({
        ID_Publicacion: req.params.idP,
        ID_Usuario: req.params.idU,
      })
      .then((resp) => {
        return new Promise((resolve, reject) => {
          Publicacion.query()
            .where("publicacion.ID", "=", req.params.idP)
            .select(
              "publicacion.*",
              Publicacion.relatedQuery("PublicacionLike")
                .count()
                .as("numberOfLikes")
            )
            .then((countLikes) => resolve(countLikes));
        });
      })
      .then((countLikes) => {
        let limite = Math.pow(10, 5); //Establecemos el limite de likes en 100,000 para generar notificaciones
        let likes = countLikes[0].numberOfLikes;
        // console.log(likes);

        // console.log(countLikes);
        if (likes <= limite) {
          //Si es menor a 100,000 likes geeneramos la notificacion
          let origen = `/petco/publicacion/adopciones/${req.params.idP}`;
          sendNotificacion(
            "¡Tu publicación ha recibido un me gusta!",
            origen,
            req.params.idDueno,
            req.app.io
          ).then(() => {
            res.json("ok");
          });
        } else {
          res.json("ok");
        }
      })
      .catch((err) => {
        console.log(err);
        next(err);
      });
  }

  if (req.params.accion == 2) {
    Like.query()
      .delete()
      .where("like.ID_Publicacion", "=", req.params.idP)
      .andWhere("like.ID_Usuario", "=", req.params.idU)
      .then();
    res.json("Se Borro");
  }
};

exports.psaveds = (req, res) => {
  //Buscar coincidencias
  if (req.params.accion == 0) {
    Publicacion_Guardada.query()
      .where("publicacion_guardada.ID_Publicacion", "=", req.params.idP)
      .andWhere("publicacion_guardada.ID_Usuario", "=", req.params.idU)
      .then((resp) => {
        console.log(resp);
        console.log(req.params);
        res.json(resp);
      });
  }

  if (req.params.accion == 1) {
    Publicacion_Guardada.query()
      .insert({
        ID_Publicacion: req.params.idP,
        ID_Usuario: req.params.idU,
      })
      .then((resp) => {});

    res.json("Se agrego");
  }

  if (req.params.accion == 2) {
    Publicacion_Guardada.query()
      .delete()
      .where("publicacion_guardada.ID_Publicacion", "=", req.params.idP)
      .andWhere("publicacion_guardada.ID_Usuario", "=", req.params.idU)
      .then();
    res.json("Se Borro");
  }
};

exports.reportarUsuario = (req, res) => {
  console.log(req.params);
  Reporte_Publicacion.query()
    .insert({
      razon: req.params.motivo,
      ID_Usuario_Reporta: req.session.IdSession,
      ID_Usuario_Reportado: req.params.usuarioreportado,
      ID_Publicacion: null,
    })
    .then((resp) => {});

  Usuario.query()
    .findOne({ ID: req.params.usuarioreportado })
    .then((UsuarioFind) => {
      if (UsuarioFind.Reputacion >= -100 || UsuarioFind.Reputacion <= 100)
        UsuarioFind.$query()
          .patch({
            Reputacion:
              parseInt(UsuarioFind.Reputacion) - parseInt(req.params.peso),
          })
          .then(() => {
            let descripcion = `Tu perfil ha recibido un reporte por ${req.params.motivo}`;
            let origen = `/petco/perfil/usuario/${req.params.usuarioreportado}`;
            let idUsuario = req.params.usuarioreportado;
            sendNotificacion(descripcion, origen, idUsuario, req.app.io);
          });
    });

  res.json("Se realizo el fetch");
};

exports.reportar = (req, res) => {
  console.log(req.params);
  Reporte_Publicacion.query()
    .insert({
      razon: req.params.motivo,
      ID_Usuario_Reporta: req.params.usuarioreporta,
      ID_Usuario_Reportado: req.params.usuarioreportado,
      ID_Publicacion: req.params.publicacion,
    })
    .then((resp) => {
      let descripcion = `Haz recibido un reporte en una publicación por: ${req.params.motivo}`;
      let origen = `/petco/publicacion/adopciones/${req.params.publicacion}`;
      let usuarioReportado = req.params.usuarioreportado;
      sendNotificacion(descripcion, origen, usuarioReportado, req.app.io);
    });

  Publicacion.query()
    .findOne({ ID: req.params.publicacion })
    .then((PublicacionFind) => {
      PublicacionFind.$query()
        .patch({
          Reportes_Peso:
            parseInt(PublicacionFind.Reportes_Peso) + parseInt(req.params.peso),
        })
        .then(() => {
          if (PublicacionFind.Reportes_Peso >= 50) {
            PublicacionFind.$query()
              .patch({ Activo: 0 })
              .then(() => {
                let descripcion = `Tu publicación se ha ocultado por la cantidad de reportes recibidos`;
                let origen = `/petco/publicacion/adopciones/${req.params.publicacion}`;
                let usuarioReportado = req.params.usuarioreportado;
                sendNotificacion(
                  descripcion,
                  origen,
                  usuarioReportado,
                  req.app.io
                );
              });
          }
        });
    });
};
//Controlar publicaciones
var aporte;
var meta;
var mensaje;
var idOrganizacion;
var correopago = "";
exports.donacionMetas = (req, res) => {
  //sacar correo pago

  Mascota.query()
    .withGraphJoined("MascotasPublicacion")
    .withGraphJoined("MascotasImagenes")
    .withGraphJoined("MascotasMetas.MetasDonaciones")
    .where("mascota.ID", "=", req.params.idMascota)
    .then((MascotaP) => {
      //id organizacion
      idOrganizacion = MascotaP[0].MascotasPublicacion.ID_Usuario;

      //console.log(MascotaP);
      meta = MascotaP[0].MascotasMetas.ID;
      let promises = [];
      for (
        let index = 0;
        index < MascotaP[0].MascotasImagenes.length;
        index++
      ) {
        const imagen = MascotaP[0].MascotasImagenes[index];
        promises.push(
          createPromisesImagenesMascotas(
            MascotaP[0],
            imagen.Ruta,
            req.app.storageFirebase,
            index
          )
        );
      }
      Promise.all(promises).then(() => {
        res.render("donacionMascota.ejs", {
          MascotaRender: MascotaP,
          Tipo: req.session.Tipo,
        });
      });
    });
};

exports.pay = (req, res) => {
  console.log(req.body);
  aporte = req.body.aporte;
  mensaje = req.body.mensaje;

  Registro.query()
    .withGraphJoined("RegistroUsuario")
    .where("RegistroUsuario.FK_Registro", "=", idOrganizacion)
    .then((query) => {
      //id organizacion
      correopago = query[0].Correo;
      console.log(query[0].Correo);

      const create_payment_json = {
        intent: "sale",

        payer: {
          payment_method: "paypal",
        },

        redirect_urls: {
          return_url: `${process.env.SERVER_DOMAIN}/petco/publicacion/success`,
          cancel_url: `${process.env.SERVER_DOMAIN}/petco/publicacion/cancel`,
        },
        transactions: [
          {
            item_list: {
              items: [
                {
                  name: "Aportacion a meta",
                  sku: "001",
                  price: aporte,
                  currency: "MXN",
                  quantity: 1,
                },
              ],
            },
            amount: {
              currency: "MXN",
              total: aporte,
            },
            payee: { email: query[0].Correo },
          },
        ],
      };

      paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
          throw error;
        } else {
          for (let i = 0; i < payment.links.length; i++) {
            if (payment.links[i].rel === "approval_url") {
              res.redirect(payment.links[i].href);
            }
          }
        }
      });
    });
};

exports.paysuccess = (req, res) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;

  const execute_payment_json = {
    payer_id: payerId,
    transactions: [
      {
        amount: {
          currency: "MXN",
          total: aporte,
        },
      },
    ],
  };

  paypal.payment.execute(
    paymentId,
    execute_payment_json,
    function (error, payment) {
      if (error) {
        console.log(error.response);
        throw error;
      } else {
        console.log(JSON.stringify(payment));
        res.redirect("/petco");
      }
    }
  );

  var today = new Date();
  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date + " " + time;
  console.log(dateTime);

  Donaciones.query()
    .insert({
      ID_Organizacion: idOrganizacion,
      ID_Usuario: req.session.IdSession,
      ID_Meta: meta,
      Cantidad: aporte,
      Fecha: dateTime,
      Mensaje: mensaje,
    })
    .then((registroCreado) => {
      console.log(registroCreado);
      Usuario.query()
        .withGraphFetched("UsuarioRegistro")
        .findOne({ "usuario.ID": req.session.IdSession })
        .then((usuarioFind) => {
          let descripcion = `¡${usuarioFind.UsuarioRegistro.Nombre} ha aportado a una meta!`;
          let origen = "/petco/perfil/Dusuario/" + idOrganizacion;
          sendNotificacion(descripcion, origen, idOrganizacion, req.app.io);
          isCompletadoMeta(meta, req.app.io);
        });
    });
};
// Publicacion.query().orderBy("peso").then((pub) => {
//   let res = new Array();
//   pub.forEach((p) => {
//     p.$query().withGraphJoined("Mascotas").where("ID_Salud", "=", 1).then((results) => {
//       res.push(results);

//     });
//   })
// })
function isCompletadoMeta(idMeta, io) {
  Metas.query()
    .withGraphJoined("[MetasDonaciones,Mascota.[MascotasPublicacion]]")
    .findById(idMeta)
    .then((Meta) => {
      // console.log(Meta);
      let acumulado = 0;
      let cantidad = Meta.Cantidad;
      Meta.MetasDonaciones.forEach((donaciones) => {
        acumulado += donaciones.Cantidad;
      });
      // acumulado += 700;
      // console.log("Acumulado:", acumulado);
      if (acumulado >= cantidad) {
        Meta.$query()
          .patch({ Completado: 1 })
          .then(() => {
            let descripcion = `¡Felicidades! la meta de la mascota: "${Meta.Mascota.Nombre} se ha completado"`;
            let origen =
              "/petco/publicacion/adopciones/" +
              Meta.Mascota.MascotasPublicacion.ID;
            let usuario = Meta.MetasDonaciones[0].ID_Organizacion;
            sendNotificacion(descripcion, origen, usuario, io);
          });
      }
    });
}

function createPromiseUsuarioComentario(comentario, storage) {
  return new Promise((resolve, reject) => {
    resolve(
      createPromiseGetPfp(comentario.ComentariosUsuario.Foto_Perfil, storage)
    );
  }).then((url) => {
    comentario.ComentariosUsuario.Foto_Perfil = url;
  });
}
exports.paycancel = (req, res) => {
  res.send("Cancelled");
};
