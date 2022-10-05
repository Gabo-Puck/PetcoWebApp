const Preguntas = require("../models/Preguntas");
const Publicacion = require("../models/Publicacion");
const Respuestas = require("../models/Respuestas");
const Solicitudes = require("../models/Solicitudes");
const { secureRegistro } = require("../utils/formDatabaseClean");
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
            resolve(
              Solicitudes.query()
                .patch({ Estado: 1 })
                .findById(req.params.SolicitudID)
                .then((result) => {
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
      .delete()
      .then(() => {
        res.json("ok");
      })
      .catch((err) => {
        console.log(err);
        return res.json({
          error: "<p>Algo ha salido mal</p><p>Intentelo más tarde</p>",
        });
      });
  }
};
