var Registro = require("../models/Registro");
var Usuario = require("../models/Usuario");
var Municipio = require("../models/Municipio");
var objection = require("objection");
const Publicacion = require("../models/Publicacion");
var probe = require("probe-image-size");

//Configuracion de paypal
const paypal = require("paypal-rest-sdk");
const Donaciones = require("../models/Donaciones");
const Like = require("../models/Like");
const Publicacion_Guardada = require("../models/Publicacion_Guardada");
const Reporte_Publicacion = require("../models/Reporte_Publicacion");
const Usuario_Bloqueado = require("../models/Usuario_Bloqueado");
const { sendNotificacion } = require("./NotificacionesController");
const { fetchInput, uploadFiles } = require("../utils/multipartRequestHandle");
const { getDownloadURL, ref, deleteObject } = require("firebase/storage");

paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id:
    "AYL9M1NxDLdbFrVbI6gzwbjtOzC_PRhxP6vn65xWqmaqZA8uKDv6mmKvkKqEBIqUe2cNWBXCezt-CG85",
  client_secret:
    "EP0JlIun8tIoxFQjUjho4CfyPdF-6A042JxLl4EjyjZQIH3g50DuopJcLynP4z4mTDjuxACCye40Hi-p",
});
let idOrganizacion;
let idr;
let correopago = "";
let aporte = 3;
let today = new Date();
let date =
  today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
let time =
  today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
let dateTime = date + " " + time;

console.log(dateTime);

exports.pagina = (req, res, next) => {
  const { createPromisesImagenesMascotas } = require("./InicioController");

  idOrganizacion = req.params.idUsuario;

  console.log("w");
  Usuario_Bloqueado.query().then((r) => {
    ban = false;
    for (let i = 0; i < r.length; i++) {
      console.log("a" + r[i].ID_Usuario + " b " + r[i].ID_Bloqueado);

      if (
        (r[i].ID_Usuario == req.session.IdSession &&
          r[i].ID_Bloqueado == req.params.idUsuario) ||
        (r[i].ID_Usuario == req.params.idUsuario &&
          r[i].ID_Bloqueado == req.session.IdSession)
      ) {
        console.log(
          "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
        );
        ban = true;
      }
    }

    if (ban == true) {
      res.redirect("petco/inicio");
    } else {
      //No se bloquearon lso usuarios
      Usuario.query()
        .withGraphJoined("UsuarioRegistro")
        .where("usuario.ID", "=", req.params.idUsuario)
        .then((result) => {
          if (result.length == 0) {
            res.redirect("/petco/inicio");
            return;
          }
          idu = result[0].UsuarioRegistro.ID;

          Publicacion.query()
            .where("publicacion.ID_Usuario", "=", req.params.idUsuario)
            .andWhere("publicacion.Activo", "=", 1)
            .withGraphJoined("Mascota.MascotasPublicacion")
            .withGraphJoined("Mascota.MascotasEstado")
            .withGraphJoined("Mascota.MascotasImagenes")
            .then((resultado) => {
              let mascotasUsuario = new Array();
              let contador = 0;

              let promises = [];
              for (let i = 0; i < resultado.length; i++) {
                for (let j = 0; j < resultado[i].Mascota.length; j++) {
                  //      console.log(resultado[i].Mascota[j]);
                  mascotasUsuario[contador] = resultado[i].Mascota[j];
                  for (
                    let index = 0;
                    index < mascotasUsuario[contador].MascotasImagenes.length;
                    index++
                  ) {
                    promises.push(
                      createPromisesImagenesMascotas(
                        mascotasUsuario[contador],
                        mascotasUsuario[contador].MascotasImagenes[index].Ruta,
                        req.app.storageFirebase,
                        index
                      )
                    );
                  }
                  contador++;
                }
              }
              createPromiseGetPfp(
                result[0].Foto_Perfil,
                req.app.storageFirebase
              ).then((url) => {
                result[0].Foto_Perfil = url;
                Promise.all(promises).then(() => {
                  mascotasUsuario.reverse();
                  res.render("perfil.ejs", {
                    user: result,
                    idUsuarioPublicacion: req.params.idUsuario,
                    MascotaRender: mascotasUsuario,
                    currentUser: req.session.IdSession,
                    Tipo: req.session.Tipo,
                  });
                });
              });
              //console.log("🚀 ~ file: PerfilController.js ~ line 26 ~ .then ~ mascotasUsuario", mascotasUsuario)
            });
        });
    }
  });
};

exports.UsuariosBlocked = (req, res, next) => {
  Usuario_Bloqueado.query()
    .withGraphFetched("UsuarioBloqueado.UsuarioRegistro")
    .where("usuario_bloqueado.ID_Usuario", "=", req.session.IdSession)
    .then((results) => {
      let promises = [];

      results.forEach((result) => {
        promises.push(createPromiseGetPfp(result.UsuarioBloqueado.Foto_Perfil, req.app.storageFirebase).then((url)=> {result.UsuarioBloqueado.Foto_Perfil= url}));

      })
      Promise.all(promises).then(() => {

        res.render("usuariosbloqueados.ejs", {
          Tipo: req.session.Tipo,
          bloqueos: results

        });

      })
    })
}

exports.UsuariosDesbloquear = (req, res, next) => {

  console.log("El usuario a desbloquear es " + req.params.idbloqueo)

  Usuario_Bloqueado.query()
    .where("usuario_bloqueado.ID_Usuario", "=", req.session.IdSession)
    .andWhere("usuario_bloqueado.ID_Bloqueado", "=", req.params.idbloqueo)
    .delete()
    .then((result) => {
      res.json("Se Borro");
    })




}




exports.DonacionesUser = (req, res, next) => {
  Donaciones.query()
    .where("donaciones.ID_Organizacion", "=", req.params.idUsuario)
    .withGraphJoined("DonacionesUsuario.UsuarioRegistro")
    .withGraphJoined("DonacionesMetas.Mascota.MascotasPublicacion")
    .then((rDonacion) => {
      console.log(rDonacion);
      res.render("Verdonaciones.ejs", {
        donacionesPerfil: rDonacion,
        Tipo: req.session.Tipo,
      });
    });
};

exports.bloquear = (req, res, next) => {
  Usuario_Bloqueado.query()
    .insert({
      ID_Usuario: req.session.IdSession,
      ID_Bloqueado: req.params.idB,
    })
    .then(() => { });
  res.json("Se hizo la query");
};

exports.fetchDonation = (req, res, next) => {
  Usuario.query()
    .where("usuario.ID", "=", req.session.IdSession)
    .patch({ AceptaDonaciones: req.params.bandera })
    .then({});

  res.json("Se hizo la query");
};

exports.pay = (req, res) => {
  console.log(req.body);
  aporte = req.body.cantidad;
  console.log("🚀 ~ file: PerfilController.js ~ line 102 ~ aporte", aporte);

  Registro.query()
    .withGraphJoined("RegistroUsuario")
    .where("RegistroUsuario.FK_Registro", "=", idu)
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
          return_url: process.env.SERVER_DOMAIN + "/petco/perfil/successP",
          cancel_url: process.env.SERVER_DOMAIN + "/petco/perfil/cancelP",
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
  Donaciones.query()
    .insert({
      ID_Organizacion: parseInt(idOrganizacion),
      ID_Usuario: req.session.IdSession,
      Cantidad: aporte,
      Fecha: dateTime,
    })
    .then((registroCreado) => {
      Usuario.query()
        .withGraphFetched("UsuarioRegistro.muni.estado")
        .findOne({ "usuario.ID": req.session.IdSession })
        .then((usuarioFind) => {
          let descripcion = `¡${usuarioFind.UsuarioRegistro.Nombre} te ha donado ${aporte}!`;
          let origen = "/petco/perfil/Dusuario/" + idOrganizacion;
          sendNotificacion(descripcion, origen, idOrganizacion, req.app.io);
        });
      console.log(registroCreado);
    });

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
        console.log("Success");
        res.redirect("/petco/perfil/usuario/" + idOrganizacion);
      }
    }
  );
};

exports.paycancel = (req, res) => {
  res.send("Cancelled");
};

const checkImagepfp = (req, res, next) => {
  if (res.fileReadableStream) {
    var min = 100,
      max = 10000;
    probe(res.fileReadableStream[0].stream).then((data) => {
      if (
        data.width < min ||
        data.height < min ||
        data.width > max ||
        data.height > max
      ) {
        res.json({
          errors: [
            {
              msg: `<p>La imagen de perfil debe de tener una resolución:</p> <p>Mínima de ${min}px por ${min}px <p>Máxima de ${max}px por ${max}px</p>`,
            },
          ],
        });
      } else {
        next();
      }
      console.log(data);
    });
  } else {
    res.json("error");
  }
};

exports.cambiarpfp = [
  fetchInput(
    ["image/png", "image/jpeg", "image/jpg"],
    "images/ImagenesPerfilUsuario"
  ),
  checkImagepfp,
  (req, res, next) => {
    if (res.errors.length > 0) {
      res.json({ errors: res.errors });
    } else {
      Promise.all(uploadFiles(res, req.app.storageFirebase)).then(() => {
        Usuario.query()
          .findById(req.session.IdSession)
          .then((usuario) => deletePromisePfp(usuario, req.app.storageFirebase))
          .then((usuario) =>
            usuario.$query().patchAndFetchById(req.session.IdSession, {
              Foto_Perfil: req.body.pfp,
            })
          )
          .then((usuario) =>
            createPromiseGetPfp(usuario.Foto_Perfil, req.app.storageFirebase)
          )
          .then((url) => {
            res.json({ url: url });
          })
          .catch((err) => {
            console.log(err);
            res.json("error");
          });
      });
    }
  },
];

const deletePromisePfp = (usuario, storage) => {
  return new Promise((resolve, reject) => {
    let fullPath = usuario.Foto_Perfil;
    let fragmentedPath = fullPath.split("/");
    let fileName = fragmentedPath.pop();
    let referencePath = fullPath.replace(fileName, "");
    let storageRef = ref(storage);
    fragmentedPath.forEach((route) => {
      storageRef = ref(storageRef, route);
    });
    if (usuario.Foto_Perfil == "images/ImagenesPerfilUsuario/default.png") {
      resolve(usuario);
    } else {
      storageRef = ref(storageRef, fileName);
      deleteObject(storageRef)
        .then(() => {
          resolve(usuario);
        })
        .catch((error) => {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          console.log(error);
          switch (error.code) {
            case "storage/object-not-found":
              // File doesn't exist
              resolve(usuario);
              break;
            case "storage/unauthorized":
              // User doesn't have permission to access the object
              break;
            case "storage/canceled":
              // User canceled the upload
              break;

            // ...

            case "storage/unknown":
              // Unknown error occurred, inspect the server response
              break;
          }
          resolve("wrong");
        });
    }
    // getDownloadURL()
  });
};

const createPromiseGetPfp = (path, storage) => {
  return new Promise((resolve, reject) => {
    let fullPath = path;
    let fragmentedPath = fullPath.split("/");
    let fileName = fragmentedPath.pop();
    let referencePath = fullPath.replace(fileName, "");
    let storageRef = ref(storage);
    fragmentedPath.forEach((route) => {
      storageRef = ref(storageRef, route);
    });
    storageRef = ref(storageRef, fileName);
    getDownloadURL(storageRef)
      .then((url) => {
        resolve(url);
      })
      .catch((error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        resolve("wrong");
        switch (error.code) {
          case "storage/object-not-found":
            // File doesn't exist
            break;
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            break;
          case "storage/canceled":
            // User canceled the upload
            break;

          // ...

          case "storage/unknown":
            // Unknown error occurred, inspect the server response
            break;
        }
      });
    // getDownloadURL()
  });
};

exports.createPromiseGetPfp = createPromiseGetPfp;
