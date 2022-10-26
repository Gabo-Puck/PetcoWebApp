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

paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id:
    "AYL9M1NxDLdbFrVbI6gzwbjtOzC_PRhxP6vn65xWqmaqZA8uKDv6mmKvkKqEBIqUe2cNWBXCezt-CG85",
  client_secret:
    "EP0JlIun8tIoxFQjUjho4CfyPdF-6A042JxLl4EjyjZQIH3g50DuopJcLynP4z4mTDjuxACCye40Hi-p",
});
function validateUsuarioResponder(res, mascotas) {
  res.solicitudesValNumero = false;
  res.arrayMascotasSolicitud = [];
  console.log(res.UsuarioSolicitudes[0].Solicitudes);
  if (Array.isArray(res.UsuarioSolicitudes[0].Solicitudes)) {
    res.UsuarioSolicitudes[0].Solicitudes.forEach((UsuarioSolicitud) => {
      console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAA");
      mascotas.forEach((m) => {
        console.log(UsuarioSolicitud.ID_Mascota, m.ID);
        if (UsuarioSolicitud.ID_Mascota == m.ID) {
          res.arrayMascotasSolicitud.push(m.ID);
        }
      });
    });
  }
  if (res.UsuarioSolicitudes[0].Solicitudes.length < 3) {
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
  (req, res) => {
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
              .withGraphJoined("MP.PublicacionUsuario.[UsuarioRegistro]")
              .withGraphJoined("MascotasCastrado")
              .withGraphJoined("MascotasTamano")
              .withGraphJoined("MascotasEspecie")
              .withGraphJoined("MascotasVacunas")
              .withGraphJoined("MascotasSalud")
              .withGraphJoined("MascotasEstado")
              .withGraphJoined("MascotasImagenes")
              .withGraphJoined("MascotasMetas.MetasDonaciones")
              .where("mascota.ID_Publicacion", "=", req.params.idPublicacion)
              .then((MascotaP) => {
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
      let descripcion = `Haz recibido un reporte por: ${req.params.motivo}`;
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

  // Publicacion.query()
  //   .where('publicacion.ID', "=", req.params.publicacion)
  //   .then((PublicacionObtenida) => {

  //     //Actualizar Peso
  //     Publicacion.query()
  //     .where('publicacion.ID', "=", req.params.publicacion)
  //     .patch({
  //       Reportes_Peso: parseInt(PublicacionObtenida[0].Reportes_Peso) + parseInt(req.params.peso),
  //     })
  //     .then((PublicacionActualizada) => {

  //       if(PublicacionActualizada[0].Reportes_Peso)
  //       {}

  //     })

  //   })

  res.json("Se realizo el fetch");
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
      res.render("donacionMascota.ejs", {
        MascotaRender: MascotaP,
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
        res.send("Success");
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
          let origen = "aquí va la url de donde se ven las metas";
          sendNotificacion(descripcion, origen, idOrganizacion, req.app.io);
          isCompletadoMeta(meta);
        });
    });
};

function isCompletadoMeta(idMeta) {
  Metas.query()
    .withGraphJoined("[MetasDonaciones,Mascota]")
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
            let origen = "aqui va la url de las metas";
            let usuario = Meta.MetasDonaciones[0].ID_Organizacion;
            sendNotificacion(descripcion, origen, usuario);
          });
      }
    });
}
exports.paycancel = (req, res) => {
  res.send("Cancelled");
};
