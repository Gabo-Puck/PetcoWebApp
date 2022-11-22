const Preguntas = require("../models/Preguntas");
const Publicacion = require("../models/Publicacion");
const Respuestas = require("../models/Respuestas");
const Solicitudes = require("../models/Solicitudes");
const { secureRegistro } = require("../utils/formDatabaseClean");
const {
  sendNotificacion,
  getTodayDateFormated,
  getDateFormated,
} = require("../controllers/NotificacionesController");
const Mascota = require("../models/Mascota");
const Usuario = require("../models/Usuario");
const { createPromisesImagenesMascotas } = require("./InicioController");
const { createPromiseGetPfp } = require("./PerfilController");

Date.prototype.addDays = function (days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

exports.getListaSolicitudesPublicacion = (req, res, next) => {
  //Importante Borrar esta parte

  console.log("BORRAR LINEA 5 SolicitudesController.js");
  if (req.session.IdSession) {
    Publicacion.query()
      .withGraphJoined("Mascota.[MascotasImagenes]")
      .findOne({
        "publicacion.ID": req.params.PublicacionID,
        "publicacion.ID_Usuario": req.session.IdSession,
      })
      // .where("publicacion.ID", "=", req.params.PublicacionID)
      // .andWhere("publicacion.ID_Usuario", "=", req.session.IdSession)

      .then((result) => {
        let promises = [];
        for (let index = 0; index < result.Mascota.length; index++) {
          const mascota = result.Mascota[index];
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
        Promise.all(promises).then(() => {
          // return res.json(result);
          console.log(result.Mascota);
          // console.log(result.Mascota);
          console.log(result);
          res.render("listaSolicitudes", {
            Mascotas: result.Mascota,
            PublicacionNombre: result.Titulo,
            Tipo: req.session.Tipo,
          });
        });
      });
  } else res.redirect("/login");
};

exports.getListaSolicitudesMascota = (req, res, next) => {
  if (req.params.MascotaID) {
    Solicitudes.query()
      .withGraphJoined("Usuario.[UsuarioRegistro]")
      .where("solicitudes.ID_Mascota", "=", req.params.MascotaID)
      .then((SolicitudesUsuario) => {
        let promises = [];
        SolicitudesUsuario.forEach((solicitud) => {
          promises.push(
            createPromiseGetPfp(solicitud.Usuario.Foto_Perfil).then(
              (url) => (solicitud.Usuario.Foto_Perfil = url)
            )
          );
          solicitud.Usuario.UsuarioRegistro = secureRegistro(
            solicitud.Usuario.UsuarioRegistro,
            ["Contrasena", "Correo", "Documento_Identidad"]
          );
        });
        Promise.all(promises).then(() => {
          return res.json(SolicitudesUsuario);
        });
        // console.log(SolicitudesUsuario[0].Usuario.UsuarioRegistro);
      })
      .catch((err) => {
        console.log(err);
        return res.json({
          error: "<p>Algo ha salido mal</p><p>Intentelo más tarde</p>",
        });
      });
  }
};

exports.getRespuestasSolicitudMascota = (req, res, next) => {
  if (req.params.SolicitudID && req.session.IdSession) {
    Preguntas.query()
      .withGraphJoined("Respuestas")
      .where("Respuestas.ID_Solicitud", "=", req.params.SolicitudID)
      .then((PreguntasRespuestas) => {
        console.log(PreguntasRespuestas);
        res.json(PreguntasRespuestas);
      })
      .catch((err) => {
        console.log(err);
        return res.json({
          error: "<p>Algo ha salido mal</p><p>Intentelo más tarde</p>",
        });
      });
  }
};

exports.aceptarSolicitud = (req, res, next) => {
  if (req.params.SolicitudID && req.params.MascotaID) {
    // res.json("ok");
    Solicitudes.query()
      .where("ID_Mascota", "=", req.params.MascotaID)
      .andWhere("Estado", ">=", "1")
      .then((solicitudes) => {
        if (solicitudes.length >= 1) {
          if (solicitudes[0].Estado == 1) {
            return res.json({
              error: "<p>Ya hay una solicitud en proceso activo</p>",
            });
          }
          if (solicitudes[0].Estado == 2) {
            return res.json({
              error: "<p>Esta mascota ya se adopto</p>",
            });
          }
        } else {
          return new Promise((resolve, reject) => {
            let Fecha_Generacion = getTodayDateFormated();
            resolve(
              Solicitudes.query()
                .patchAndFetchById(req.params.SolicitudID, {
                  Estado: 1,
                  Fecha_Inicio: Fecha_Generacion,
                })
                .then((result) => {
                  // sendNotificacion;

                  Mascota.query()
                    // .findById(result.ID_Mascota)
                    .patchAndFetchById(result.ID_Mascota, {
                      Fecha_Ultima_Solicitud: Fecha_Generacion,
                    })
                    .then((Mascota) => {
                      return new Promise((resolve, reject) => {
                        if (Mascota) {
                          Mascota.$query()
                            .withGraphJoined("MascotasProceso.[Paso]")
                            .then((mascotaPasos) => {
                              let fecha = new Date(Fecha_Generacion);
                              let arrayPromesasAceptar = [];
                              console.log(mascotaPasos);
                              mascotaPasos.MascotasProceso.forEach((paso) => {
                                fecha = fecha.addDays(paso.Paso.DiasEstimados);
                                arrayPromesasAceptar.push(
                                  patchFechaPasosMascota(paso, fecha)
                                );
                                arrayPromesasAceptar.push(
                                  patchPasosDefaultPromise(paso)
                                );
                              });

                              resolve(arrayPromesasAceptar);
                            })
                            .catch((err) => {
                              console.log(err);
                              return res.json({
                                error:
                                  "<p>Algo ha salido mal</p><p>Intentelo más tarde</p>",
                              });
                            });
                        }
                      });
                    })
                    .then((arrayPromesasAceptar) => {
                      Promise.all(arrayPromesasAceptar)
                        .then(() => {
                          console.log("hola");
                          getUsuarioMascota(
                            req.params.MascotaID,
                            result.ID_Usuario,
                            req,
                            "ha aceptado su solicitud para proceso de adopción"
                          );
                          res.json("ok");
                        })
                        .catch((err) => {
                          console.log(err);
                          return res.json({
                            error:
                              "<p>Algo ha salido mal</p><p>Intentelo más tarde</p>",
                          });
                        });
                    })
                    .catch((err) => {
                      console.log(err);
                      return res.json({
                        error:
                          "<p>Algo ha salido mal</p><p>Intentelo más tarde</p>",
                      });
                    });
                })
            );
          });
        }
      })
      .catch((err) => {
        console.log(err);
        return res.json({
          error: "<p>Algo ha salido mal</p><p>Intentelo más tarde</p>",
        });
      });
  }
};

function patchFechaPasosMascota(paso, fecha) {
  console.log(
    "🚀 ~ file: SolicitudesController.js ~ line 178 ~ patchFechaPasosMascota ~ fecha",
    fecha
  );
  let fechaFormat = getDateFormated(fecha);
  return new Promise((resolve, reject) => {
    resolve(
      paso.$query().patch({
        Fecha_Limite: fechaFormat,
      })
    );
  });
}

function getUsuarioMascota(MascotaID, ID_Usuario, req, msg) {
  return new Promise((resolve, reject) => {
    Mascota.query()
      .withGraphJoined(
        "MascotasPublicacion.[PublicacionUsuario.[UsuarioRegistro]]",
        { minimize: true }
      )
      .findById(MascotaID)
      .then((MascotaFind) => {
        MascotaFind.$query()
          .patch({ ID_Estado: 3 })
          .then(() => {
            let nombreUsuario =
              MascotaFind.MascotasPublicacion.PublicacionUsuario.UsuarioRegistro
                .Nombre;
            let descripcion = `${nombreUsuario} ${msg}`;
            let origen = `/petco/proceso/ver/${MascotaID}`;
            sendNotificacion(descripcion, origen, ID_Usuario, req.app.io);
            console.log(MascotaFind);
          });
      });
  });
}

exports.denegarSolicitud = (req, res, next) => {
  if (req.params.SolicitudID && req.params.MascotaID) {
    Solicitudes.query()
      .withGraphJoined("Mascota.[MascotasPublicacion]")
      .where(
        "Mascota:MascotasPublicacion.ID_Usuario",
        "=",
        req.session.IdSession
      )
      .andWhere("Mascota.ID", "=", req.params.MascotaID)
      .andWhere("solicitudes.ID", "=", req.params.SolicitudID)
      .then((solicitudFind) => {
        let idUsuario = solicitudFind[0].ID_Usuario;
        let descripcion = `Se ha rechazado tu solicitud de adopción para ${solicitudFind[0].Mascota.Nombre}`;
        let origen = `/petco/publicacion/adopciones/${solicitudFind[0].Mascota.MascotasPublicacion.ID}`;
        solicitudFind[0]
          .$query()
          .delete()
          .then(() => {
            sendNotificacion(descripcion, origen, idUsuario, req.app.io);
            Mascota.query()
              .withGraphJoined("MascotasSolicitudes")
              .findById(req.params.MascotaID)
              .then((mascotaSolicitudes) => {
                if (mascotaSolicitudes) {
                  if (mascotaSolicitudes.MascotasSolicitudes.length == 0) {
                    mascotaSolicitudes
                      .$query()
                      .patch({ ID_Estado: 1 })
                      .then(() => {});
                  }
                  res.json("ok");
                } else {
                  return res.json({
                    error:
                      "<p>Algo ha salido mal</p><p>Intentelo más tarde</p>",
                  });
                }
              });
          })
          .catch((err) => {
            console.log(err);
            return res.json({
              error: "<p>Algo ha salido mal</p><p>Intentelo más tarde</p>",
            });
          });
      });
    // Solicitudes.query()
    //   .withGraphJoined("Mascota.[MascotasPublicacion]")
    //   .where(
    //     "Mascota:MascotasPublicacion.ID_Usuario",
    //     "=",
    //     req.session.IdSession
    //   )
    //   .andWhere("Mascota.ID", "=", req.params.MascotaID)
    //   .andWhere("solicitudes.ID", "=", req.params.SolicitudID)
    //   .delete()
    //   .then(() => {
    //     res.json("ok");
    //   })
  }
};

exports.eliminarSolicitud = (req, res, next) => {
  Solicitudes.query()
    .deleteById(req.body.SolicitudID)
    .then(() => {
      res.json("ok");
    })
    .catch((err) => {
      console.log(err);
      res.json("Algo ha salido mal, intentalo más tarde");
    });
};

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
        })
        .then(() => {})
    );
  });
}

exports.verSolicitudesUsuario = (req, res, next) => {
  Usuario.query()
    .withGraphFetched("Solicitudes.Mascota.[MascotasImagenes,MascotasEspecie]")
    .findById(req.session.IdSession)
    .then((UsuarioSolicitudes) => {
      let promises = [];
      for (
        let index = 0;
        index < UsuarioSolicitudes.Solicitudes.length;
        index++
      ) {
        const mascota = UsuarioSolicitudes.Solicitudes[index].Mascota;
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
      console.log(
        "🚀 ~ file: pruebaContarDonaciones.js ~ line 497 ~ .then ~ UsuarioSolicitudes",
        UsuarioSolicitudes
      );
      Promise.all(promises).then(() => {
        res.render("usuarioVerSolicitudes.ejs", {
          Tipo: req.session.Tipo,
          UsuarioSolicitudes: UsuarioSolicitudes,
        });
      });
    });
};
