const Mascota = require("../models/Mascota");
const Pasos_Mascota = require("../models/Pasos_Mascota");
const Usuario = require("../models/Usuario");
const { fetchInput, uploadFiles } = require("../utils/multipartRequestHandle");
const { secureRegistro } = require("../utils/formDatabaseClean");
const Mensajes = require("../models/Mensajes");
const { encrypt } = require("../utils/cryptoUtils/randomId");
const {
  isAdoptante,
  isDuenoMascota,
} = require("../utils/procesoAdopcionUtils");

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
          let tipoUsuario = res.isAdoptante ? 2 : 1; //Si existe res.isAdoptante el usuario será adoptante (2), si no existe entonces será dueño (1)
          let ROOM_ID = encrypt(req.params.MascotaID);
          res.render("procesoAdopcion", {
            PasosProceso: PasosProceso[0].MascotasPasos,
            tipo: tipoUsuario,
            MascotaID: req.params.MascotaID,
            Usuario: res.usuarioProceso,
            UsuarioPeer: res.PeerProceso,
            SolicitudID: res.SolicitudID,
            Mensajes: res.MensajesSolicitud,
            ROOM_ID: ROOM_ID,
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
      if (res.errors.length >= 1) {
        return res.json({ errors: res.errors });
      }
      uploadFiles(res);
      Pasos_Mascota.query()
        .findOne({
          ID_Mascota: req.body.MascotaID,
          ID_Paso: req.body.PasoID,
        })
        .patch({ Archivo: req.body.archivoPaso })
        .then((resultFetch) => {
          console.log(resultFetch);
          if (resultFetch > 0) {
            res.json({ state: "ok", path: req.body.archivoPaso });
          } else {
            res.json({ state: "notOk" });
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
            .then(() => patchPasoProceso(req.body.MascotaID, res.isAdoptante))
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

function patchPasoProceso(mascotaID, isAdoptante) {
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
            resolve("ok");
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
