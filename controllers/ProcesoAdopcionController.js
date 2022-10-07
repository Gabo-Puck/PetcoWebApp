const Mascota = require("../models/Mascota");
const Pasos_Mascota = require("../models/Pasos_Mascota");
const { fetchInput, uploadFiles } = require("../utils/multipartRequestHandle");

var acceptedTypes = [
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/pdf",
];
exports.getProceso = [
  isAdoptante,
  isDuenoMascota,
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
          });
        });
    } else {
      console.log("Te mando al login");
      res.redirect("/login");
    }
  },
];

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
    .withGraphJoined("MascotasSolicitudes")
    .where("mascota.ID", "=", MascotaID)
    .andWhere("MascotasSolicitudes.ID_Usuario", "=", req.session.IdSession)
    .andWhere("MascotasSolicitudes.Estado", "=", 1)
    // .debug()
    .then((usuarioSolicitud) => {
      console.log(usuarioSolicitud);
      if (usuarioSolicitud.length == 1) {
        //hacer algo cuando el usuario encontrado es el adoptante
        // res.render("procesoAdopcion")
        // console.log(usuarioSolicitud);
        console.log("Si es adoptante");
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
      .withGraphJoined("[MascotasSolicitudes,MascotasPublicacion]")
      .where("mascota.ID", "=", req.params.MascotaID)
      .andWhere("MascotasPublicacion.ID_Usuario", "=", req.session.IdSession)
      .andWhere("MascotasSolicitudes.Estado", "=", 1)
      .then((usuarioDueno) => {
        console.log(usuarioDueno);
        if (usuarioDueno.length == 1) {
          //hacer algo cuando el usuario encontrado es el adoptante
          console.log("Si es dueno");

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
