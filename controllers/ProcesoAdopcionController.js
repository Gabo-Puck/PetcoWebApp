const Mascota = require("../models/Mascota");

exports.getProceso = [
  isAdoptante,
  isDuenoMascota,
  (req, res, next) => {
    if (res.isAdoptante || res.isDuenoMascota) {
      console.log("Si es valido para entrar");
      Mascota.query()
        .withGraphJoined("MascotasPasos")
        .where("mascota.ID", "=", req.params.MascotaID)
        .then((PasosProceso) => {
          res.render("procesoAdopcion", { PasosProceso: PasosProceso });
        });
    } else {
      console.log("Te mando al login");
      res.redirect("/login");
    }
  },
];

function isAdoptante(req, res, next) {
  console.log("Estamos en adoptante");
  Mascota.query()
    .withGraphJoined("MascotasSolicitudes")
    .where("mascota.ID", "=", req.params.MascotaID)
    .andWhere("MascotasSolicitudes.ID_Usuario", "=", req.session.IdSession)
    .andWhere("MascotasSolicitudes.Estado", "=", 1)
    // .debug()
    .then((usuarioSolicitud) => {
      console.log(usuarioSolicitud);
      if (usuarioSolicitud.length == 1) {
        //hacer algo cuando el usuario encontrado es el adoptante
        // res.render("procesoAdopcion")
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
