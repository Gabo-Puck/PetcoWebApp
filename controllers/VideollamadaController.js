const Mascota = require("../models/Mascota");
const Registro = require("../models/Registro");
const Solicitudes = require("../models/Solicitudes");
const { decrypt } = require("../utils/cryptoUtils/randomId");
const {
  isAdoptante,
  isDuenoMascota,
} = require("../utils/procesoAdopcionUtils");

exports.getUserData = [
  (req, res, next) => {
    if (req.session.IdSession) {
      req.params.MascotaID = decrypt(req.params.ROOM_ID);
      next();
    } else {
      res.redirect("/login");
    }
  },
  isDuenoMascota,
  isAdoptante,
  (req, res, next) => {
    Mascota.query()
      .findById(req.params.MascotaID)
      .then((mascotaFind) => {
        if (mascotaFind) {
          if (
            mascotaFind.ID_Estado == 3 &&
            (res.isAdoptante || res.isDuenoMascota)
          ) {
            console.log("XD");
            Registro.query()
              .withGraphJoined("RegistroUsuario")
              .findOne({ "RegistroUsuario.ID": req.session.IdSession })
              .then((user) => {
                console.log("PIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIILIIIIN");
                console.log(user);
                res.render("videochatRoom", {
                  nombre: user.Nombre,
                  ROOM_ID: req.params.ROOM_ID,
                });
              });
          } else {
            res.redirect("/login");
          }
        } else {
          res.redirect("/login");
        }
      });
  },
];
