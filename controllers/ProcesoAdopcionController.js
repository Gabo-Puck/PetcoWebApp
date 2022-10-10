const Mascota = require("../models/Mascota");
const Pasos_Mascota = require("../models/Pasos_Mascota");
const Usuario = require("../models/Usuario");
const { fetchInput, uploadFiles } = require("../utils/multipartRequestHandle");
const { secureRegistro } = require("../utils/formDatabaseClean");
const Mensajes = require("../models/Mensajes");

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
          let tipoUSuario = res.isAdoptante ? 0 : 1;
          res.render("procesoAdopcion", {
            PasosProceso: PasosProceso[0].MascotasPasos,
            tipo: tipoUSuario,
            MascotaID: req.params.MascotaID,
            Usuario: res.usuarioProceso,
            UsuarioPeer: res.PeerProceso,
            SolicitudID: res.SolicitudID,
            Mensajes: res.MensajesSolicitud,
          });
        });
    } else {
      console.log("Te mando al login");
      res.redirect("/login");
    }
  },
];

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
        "ID",
      ]);
      resUsuario["foto"] = usuario.Foto_Perfil;
      res.usuarioProceso = resUsuario;
      next();
    })
    .catch((err) => {
      console.log(err);
      console.log("Algo ha salido mal");
      next(err);
    });
}

exports.uploadFile = [
  fetchInput(acceptedTypes, "./public/archivosPasos"),
  isAdoptante,
  (req, res, next) => {
    if (res.isAdoptante) {
      uploadFiles(res);
      Pasos_Mascota.query()
        .findOne({
          ID_Mascota: req.body.MascotaID,
          ID_Paso: req.body.PasoID,
        })
        .patch({ Archivo: req.body.archivoPaso })
        .then((resultFetch) => {
          if (resultFetch > 0) {
            res.json("ok");
          } else {
            res.json("notOk");
            console.log(
              "Something wrong happened: No se hizo el cambio en la bd"
            );
          }
        });
    } else {
      console.log("Something wrong happened: No es adoptante");

      res.json("notOk");
    }
  },
];

function isAdoptante(req, res, next) {
  console.log("Estamos en adoptante");
  let MascotaID;
  try {
    if (req.params.MascotaID) {
      MascotaID = req.params.MascotaID;
    } else if (req.body.MascotaID) {
      MascotaID = req.body.MascotaID;
    }
  } catch (err) {
    next(err);
  }

  Mascota.query()
    .withGraphJoined(
      "[MascotasSolicitudes,MascotasPublicacion.[PublicacionUsuario.UsuarioRegistro]]",
      { minimize: true }
    )
    .where("mascota.ID", "=", MascotaID)
    .andWhere("_t0.ID_Usuario", "=", req.session.IdSession)
    .andWhere("_t0.Estado", "=", 1)
    // .debug()
    .then((usuarioSolicitud) => {
      console.log(usuarioSolicitud);
      if (usuarioSolicitud.length == 1) {
        //hacer algo cuando el usuario encontrado es el adoptante
        // res.render("procesoAdopcion")
        // console.log(usuarioSolicitud);
        // console.log("Si es adoptante");
        // console.log(usuarioSolicitud);
        // console.log(usuarioSolicitud[0].MascotasSolicitudes[0]);
        res.SolicitudID = usuarioSolicitud[0].MascotasSolicitudes[0].ID;
        let UsuarioQuery =
          usuarioSolicitud[0].MascotasPublicacion.PublicacionUsuario;
        res.PeerProceso = {
          Nombre: UsuarioQuery.UsuarioRegistro.Nombre,
          Foto_Perfil: UsuarioQuery.Foto_Perfil,
        };
        console.log(res.PeerProceso);
        res.isAdoptante = true;
      } else {
        console.log("No es adoptante");

        res.isAdoptante = false;
      }
      next();
    });
}

function isDuenoMascota(req, res, next) {
  console.log("Estamos en dueno");
  if (!res.isAdoptante) {
    Mascota.query()
      .withGraphJoined(
        "[MascotasPublicacion,MascotasSolicitudes.[Usuario.[UsuarioRegistro]]]",
        { minimize: true }
      )
      .where("mascota.ID", "=", req.params.MascotaID)
      .andWhere("_t0.ID_Usuario", "=", req.session.IdSession)
      .andWhere("_t1.Estado", "=", 1)
      .then((usuarioDueno) => {
        console.log(usuarioDueno);
        if (usuarioDueno.length == 1) {
          //hacer algo cuando el usuario encontrado es el adoptante
          console.log("Si es dueno");
          // console.log(usuarioDueno);
          // console.log(usuarioDueno[0].MascotasSolicitudes[0]);
          // console.log(usuarioDueno[0].MascotasSolicitudes[0]);
          let UsuarioQuery = usuarioDueno[0].MascotasSolicitudes[0].Usuario;
          res.SolicitudID = usuarioDueno[0].MascotasSolicitudes[0].ID;
          res.PeerProceso = {
            Nombre: UsuarioQuery.UsuarioRegistro.Nombre,
            Foto_Perfil: UsuarioQuery.Foto_Perfil,
          };
          console.log(res.ProcesoPeer);
          res.isDuenoMascota = true;
        } else {
          console.log("No es dueno");
          res.isDuenoMascota = false;
        }
        next();
      });
  } else {
    next();
  }
}
