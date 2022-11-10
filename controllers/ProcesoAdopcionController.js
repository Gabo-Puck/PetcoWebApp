const Mascota = require("../models/Mascota");
const Pasos_Mascota = require("../models/Pasos_Mascota");
const Usuario = require("../models/Usuario");
const {
  fetchInput,
  uploadFiles,
  deleteFiles,
} = require("../utils/multipartRequestHandle");
const { secureRegistro } = require("../utils/formDatabaseClean");
const Mensajes = require("../models/Mensajes");
const { encrypt } = require("../utils/cryptoUtils/randomId");
const {
  isAdoptante,
  isDuenoMascota,
} = require("../utils/procesoAdopcionUtils");
const Solicitudes = require("../models/Solicitudes");
const { sendNotificacion } = require("./NotificacionesController");
const { getDownloadURL, ref } = require("firebase/storage");
const { createPromiseGetPfp } = require("./PerfilController");

var acceptedTypes = [
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/pdf",
];

exports.getProceso = [
  getUsuario,
  isAdoptante,
  isDuenoMascota,
  getMensajes,
  (req, res, next) => {
    if (res.isAdoptante || res.isDuenoMascota) {
      console.log("Si es valido para entrar");
      Mascota.query()
        .withGraphJoined("MascotasPasos.[PasoProceso]")
        .where("mascota.ID", "=", req.params.MascotaID)
        .andWhere(
          "MascotasPasos:PasoProceso.ID_Mascota",
          "=",
          req.params.MascotaID
        )
        .then((PasosProceso) => {
          // isProcesoCompleted(res, PasosProceso);
          console.log("ESTOA QUI");
          let tipoUsuario = res.isAdoptante ? 2 : 1; //Si existe res.isAdoptante el usuario será adoptante (2), si no existe entonces será dueño (1)
          let ROOM_ID = encrypt(req.params.MascotaID);
          let promises = [];

          console.log(
            "🚀 ~ file: ProcesoAdopcionController.js ~ line 56 ~ PasosProceso[0].MascotasPasos.forEach ~ PasosProceso[0]",
            PasosProceso[0]
          );
          PasosProceso[0].MascotasPasos.forEach((paso_proceso) => {
            console.log(
              "🚀 ~ file: ProcesoAdopcionController.js ~ line 56 ~ PasosProceso[0].MascotasPasos.forEach ~ paso_proceso.PasoProceso[0]",
              paso_proceso.PasoProceso[0]
            );
            if (paso_proceso.PasoProceso[0].Archivo !== null) {
              promises.push(
                getArchivoUrl(
                  paso_proceso.PasoProceso[0],
                  paso_proceso.PasoProceso[0].Archivo,
                  req.app.storageFirebase
                )
              );
            }
          });
          promises.push(
            createPromiseGetPfp(
              res.PeerProceso.Foto_Perfil,
              req.app.storageFirebase
            ).then((url) => {
              res.PeerProceso.Foto_Perfil = url;
            })
          );
          promises.push(
            createPromiseGetPfp(
              res.usuarioProceso.foto,
              req.app.storageFirebase
            ).then((url) => {
              res.usuarioProceso.foto = url;
            })
          );
          Promise.all(promises).then(() => {
            res.render("procesoAdopcion", {
              PasosProceso: PasosProceso[0].MascotasPasos,
              tipo: tipoUsuario,
              MascotaID: req.params.MascotaID,
              Usuario: res.usuarioProceso,
              UsuarioPeer: res.PeerProceso,
              SolicitudID: res.SolicitudID,
              Mensajes: res.MensajesSolicitud,
              ROOM_ID: ROOM_ID,
              Tipo: req.session.Tipo,
            });
          });
        });
    } else {
      console.log("Te mando al login");
      res.redirect("/login");
    }
  },
];

function isProcesoCompleted(res, PasosProceso) {
  let lastIndex = PasosProceso[0].MascotasPasos.length - 1;
  let lastPaso = PasosProceso[0].MascotasPasos[lastIndex].PasoProceso[0];
  console.log(lastPaso);
  if (lastPaso.Completado < 6) {
    return;
  }
  res.redirect("/inicio");
}

function getMensajes(req, res, next) {
  try {
    if (req.params.MascotaID) {
      MascotaID = req.params.MascotaID;
    } else if (req.body.MascotaID) {
      MascotaID = req.body.MascotaID;
    }
  } catch (err) {
    next(err);
  }
  if (res.isAdoptante || res.isDuenoMascota) {
    Mascota.query()
      .withGraphJoined("MascotasSolicitudes.[MensajesSolicitud]")
      .where("mascota.ID", "=", MascotaID)
      .orderBy("MascotasSolicitudes:MensajesSolicitud.Fecha_Envio", "asc")

      .then((MascotaMensajes) => {
        console.log("Estamos en mascota mensajes");
        res.MensajesSolicitud =
          MascotaMensajes[0].MascotasSolicitudes[0].MensajesSolicitud;

        next();
      })
      .catch((err) => next(err));
  } else {
    next();
  }
}

function getUsuario(req, res, next) {
  Usuario.query()
    .withGraphJoined("UsuarioRegistro")
    .findOne({ "usuario.ID": req.session.IdSession })
    .then((usuario) => {
      let resUsuario = {};
      resUsuario["Usuario"] = secureRegistro(usuario.UsuarioRegistro, [
        "Contrasena",
        "Correo",
        "Documento_Identidad",
        "Telefono",
        "Municipio",
        "Tipo_Usuario",
      ]);
      resUsuario["foto"] = usuario.Foto_Perfil;
      resUsuario["UsuarioID"] = usuario.ID;
      res.usuarioProceso = resUsuario;
      next();
    })
    .catch((err) => {
      console.log(err);
      console.log("Algo ha salido mal");
      next(err);
    });
}

const getArchivoUrl = (paso_mascota, path, storage) => {
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
        paso_mascota.Archivo = url;
        resolve("ok");
      })
      .catch((error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        resolve("xd");
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
  });
};

exports.uploadFile = [
  fetchInput(acceptedTypes, "archivosPasos"),
  isAdoptante,
  (req, res, next) => {
    if (res.isAdoptante) {
      if (res.errors.length >= 1) {
        return res.json({ errors: res.errors });
      }
      Promise.all(uploadFiles(res, req.app.storageFirebase)).then(() => {
        Pasos_Mascota.query()
          .findOne({
            ID_Mascota: req.body.MascotaID,
            ID_Paso: req.body.PasoID,
          })
          .then((PasoMascotaFound) => {
            return new Promise((resolve, reject) => {
              let archivo = PasoMascotaFound.Archivo;
              req.deleteFilesPath = [];
              req.deleteFilesPath.push(archivo);
              console.log("archivoPASO", req.body.archivoPaso);
              if (
                req.body.archivoPaso != "" &&
                req.body.archivoPaso != null &&
                req.body.archivoPaso != "undefined"
              ) {
                if (archivo != null) {
                  let deletePromises = deleteFiles(req);
                  Promise.all(deletePromises).then(() => {
                    PasoMascotaFound.$query()
                      .patch({ Archivo: req.body.archivoPaso })
                      .then((resultFetch) => {
                        resolve(resultFetch);
                      });
                  });
                } else {
                  PasoMascotaFound.$query()
                    .patch({ Archivo: req.body.archivoPaso })
                    .then((resultFetch) => {
                      resolve(resultFetch);
                    });
                }
              } else {
                resolve(1);
                req.body.archivoPaso = archivo;
              }
            });
          })
          .then((resultFetch) => {
            console.log(resultFetch);
            if (resultFetch > 0) {
              createPromisesArchivos(
                req.body.archivoPaso,
                req.app.storageFirebase
              ).then((url) => {
                res.json({ state: "ok", path: url });
              });
            } else {
              res.json({ state: "notOk" });
              console.log(
                "Something wrong happened: No se hizo el cambio en la bd"
              );
            }
          });
      });
    } else {
      console.log("Something wrong happened: No es adoptante");

      res.json("notOk");
    }
  },
];

exports.patchReputacion = [
  isAdoptante,
  isDuenoMascota,
  (req, res, next) => {
    if (res.isAdoptante || res.isDuenoMascota) {
      console.log(res.PeerProceso.ID);
      Usuario.query()
        .findById(res.PeerProceso.ID)
        .then((usuarioReputacion) => {
          let reputacionCambio =
            usuarioReputacion.Reputacion + req.body.reputacionValue;
          usuarioReputacion
            .$query()
            .patch({ Reputacion: reputacionCambio })
            .then(() =>
              patchPasoProceso(
                req.body.MascotaID,
                res.isAdoptante,
                res.PeerProceso,
                next,
                req.app.io
              )
            )
            .then((resolveValue) => {
              if (resolveValue == "ok") {
                res.json(resolveValue);
              } else {
                next(resolveValue);
              }
            });
        })
        .catch((err) => {
          console.log(err);
          next(err);
        });
    } else {
      console.log("Te mando al login");
      res.json("notOk");
    }
  },
];
// io.to(socket.userID).emit(
//   "error-paso-completado-lista-registro",
//   {
//     error:
//       "Este proceso se ha finalizado y no puedes mandar mensajes",
//     idPasoAfectado: 0,
//   }
// );
exports.abortarProceso = [
  isAdoptante,
  isDuenoMascota,
  getUsuario,
  (req, res, next) => {
    if (res.isAdoptante || res.isDuenoMascota) {
      Mascota.query()
        .withGraphJoined("MascotasPasos.[PasoProceso]")
        .where("mascota.ID", "=", req.body.MascotaID)
        .andWhere(
          "MascotasPasos:PasoProceso.ID_Mascota",
          "=",
          req.body.MascotaID
        )
        .then((PasosProceso) => {
          if (PasosProceso[0].ID_Estado == 4) {
            res.json(
              "<p>Este proceso se encuentra completado</p><p>No lo puedes abortar</p>"
            );
            return;
          } else {
            res.PasosProceso = PasosProceso;
            req.deleteFilesPath = [];
            let arrayProm = [];
            PasosProceso[0].MascotasPasos.forEach((pasoProceso) => {
              if (pasoProceso.PasoProceso[0].Archivo != null) {
                req.deleteFilesPath.push(
                  pasoProceso.PasoProceso[0].Archivo.replaceAll("\\", "/")
                );
              }
              console.log(pasoProceso);
              arrayProm.push(
                patchPasosDefaultPromise(pasoProceso.PasoProceso[0])
              );
            });
            console.log(arrayProm);
            return new Promise((resolve, reject) => {
              resolve(arrayProm);
            });
          }
        })
        .then((arrayProm) => Promise.all(arrayProm))
        .then(() => Promise.all(deleteFiles(req)))
        .then(() => {
          return new Promise((resolve, reject) => {
            resolve(
              Solicitudes.query()
                .deleteById(res.SolicitudID)
                .then(() => {
                  let idUsuario = res.PeerProceso.ID;
                  let descripcion = `${res.usuarioProceso.Usuario.Nombre} ha abortado el proceso de adopción `;
                  let origen = `/petco/publicacion/adopciones/${res.PasosProceso[0].ID_Publicacion}`;
                  res.PasosProceso[0]
                    .$query()
                    .patch({ ID_Estado: 2 })
                    .then(() => {
                      sendNotificacion(
                        descripcion,
                        origen,
                        idUsuario,
                        req.app.io
                      );
                    })
                    .catch((err) => {
                      console.log(err);
                      next(err);
                    });
                })
            );
            // resolve("");
          });
        })
        .then(() => {
          res.json("ok");
        })
        .catch((err) => {
          console.log(err);
          next(err);
        });
    }
  },
];

function patchPasosDefaultPromise(PasoProceso) {
  let valueCompletado = 0;
  if (PasoProceso.ID_Paso == 1) {
    valueCompletado = 3;
  }
  return new Promise((resolve, reject) => {
    resolve(
      PasoProceso.$query()
        .patch({
          Completado: valueCompletado,
          Archivo: null,
          Fecha_Limite: null,
        })
        .then(() => {})
    );
  });
}

function createArrayPatchPasosDefaultPromises(PasosProceso) {
  let arrayProm = [];
  PasosProceso.forEach((paso) => {
    arrayProm.push(patchPasosDefaultPromise(PasoProceso));
  });
  return arrayProm;
}

function patchPasoProceso(mascotaID, isAdoptante, peer, next, io, usuario) {
  return new Promise((resolve, reject) => {
    Mascota.query()
      .withGraphJoined("MascotasPasos.[PasoProceso]")
      .where("mascota.ID", "=", mascotaID)
      .andWhere("MascotasPasos:PasoProceso.ID_Mascota", "=", mascotaID)
      .then((PasosProceso) => {
        console.log(PasosProceso[0], "\n");
        console.log(PasosProceso[0].MascotasPasos, "\n");
        console.log(PasosProceso[0].MascotasPasos.PasosProceso, "\n");
        let lastIndex = PasosProceso[0].MascotasPasos.length - 1;
        let valueAdd = isAdoptante ? 2 : 1;
        let completadoPatchValue =
          PasosProceso[0].MascotasPasos[lastIndex].PasoProceso[0].Completado +
          valueAdd;
        Pasos_Mascota.query()
          .findOne({
            ID: PasosProceso[0].MascotasPasos[lastIndex].PasoProceso[0].ID,
          })
          .patch({ Completado: completadoPatchValue })
          .then(() => {
            if (completadoPatchValue >= 4) {
              let descripcion = `${peer.Nombre} te ha calificado tras finalizar el proceso de adoción`;
              let origen = `/petco/proceso/ver/${mascotaID}`;
              sendNotificacion(descripcion, origen, peer.ID, io);
            }

            resolve("ok");
          })
          .catch((err) => {
            console.log(err);
            next(err);
          });
      })
      .catch((err) => {
        console.log(err);
        resolve(err);
      });
  });
}

// exports.isAdoptante = isAdoptante;

// exports.isDuenoMascota = isAdoptante;
function createPromisesArchivos(path, storage) {
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
        resolve("");
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
  });
}
