const Preguntas = require("../models/Preguntas");
const Publicacion = require("../models/Publicacion");
const Respuestas = require("../models/Respuestas");
const Solicitudes = require("../models/Solicitudes");
const { secureRegistro } = require("../utils/formDatabaseClean");
const {
  sendNotificacion,
  getTodayDateFormated,
} = require("../controllers/NotificacionesController");
const Mascota = require("../models/Mascota");

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
  } else res.redirect("/login");
};

exports.getListaSolicitudesMascota = (req, res, next) => {
  if (req.params.MascotaID) {
    Solicitudes.query()
      .withGraphJoined("Usuario.[UsuarioRegistro]")
      .where("solicitudes.ID_Mascota", "=", req.params.MascotaID)
      .then((SolicitudesUsuario) => {
        SolicitudesUsuario.forEach((solicitud) => {
          solicitud.Usuario.UsuarioRegistro = secureRegistro(
            solicitud.Usuario.UsuarioRegistro,
            ["Contrasena", "Correo", "Documento_Identidad"]
          );
        });
        // console.log(SolicitudesUsuario[0].Usuario.UsuarioRegistro);
        return res.json(SolicitudesUsuario);
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
      .andWhere("Estado", "=", "1")
      .then((solicitudes) => {
        if (solicitudes.length >= 1) {
          return res.json({
            error: "<p>Ya hay una solicitud en proceso activo</p>",
          });
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
                    .findById(result.ID_Mascota)
                    .patch({ Fecha_Ultima_Solicitud: Fecha_Generacion })
                    .then(() => {});

                  getUsuarioMascota(
                    req.params.MascotaID,
                    result.ID_Usuario,
                    req,
                    "ha aceptado su solicitud para proceso de adopción"
                  );
                  res.json("ok");
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
            res.json("ok");
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
