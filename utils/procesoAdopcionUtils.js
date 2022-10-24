const Mascota = require("../models/Mascota");

exports.isAdoptante = (req, res, next) => {
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
  console.log(req.body);

  console.log(MascotaID);

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
        console.log("Si es adoptante");
        // console.log(usuarioSolicitud);
        // console.log(usuarioSolicitud[0].MascotasSolicitudes[0]);
        res.SolicitudID = usuarioSolicitud[0].MascotasSolicitudes[0].ID;
        let UsuarioQuery =
          usuarioSolicitud[0].MascotasPublicacion.PublicacionUsuario;
        res.PeerProceso = {
          Nombre: UsuarioQuery.UsuarioRegistro.Nombre,
          Foto_Perfil: UsuarioQuery.Foto_Perfil,
          ID: UsuarioQuery.ID,
        };
        console.log(res.PeerProceso);
        res.isAdoptante = true;
      } else {
        console.log("No es adoptante");

        res.isAdoptante = false;
      }
      next();
    });
};

exports.isDuenoMascota = (req, res, next) => {
  console.log("Estamos en dueno");
  try {
    if (req.params.MascotaID) {
      MascotaID = req.params.MascotaID;
    } else if (req.body.MascotaID) {
      MascotaID = req.body.MascotaID;
    }
  } catch (err) {
    next(err);
  }
  if (!res.isAdoptante) {
    Mascota.query()
      .withGraphJoined(
        "[MascotasPublicacion,MascotasSolicitudes.[Usuario.[UsuarioRegistro]]]",
        { minimize: true }
      )
      .where("mascota.ID", "=", MascotaID)
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
            ID: UsuarioQuery.ID,
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
};
