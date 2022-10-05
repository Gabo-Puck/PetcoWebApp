const Mascota = require("../models/Mascota");

exports.getProceso = (req, res, next) => {
  if (req.params.MascotaID) {
    // Mascota.query()
    //   .withGraphJoined("MascotasSolicitudes")
    //   .where("mascota.ID", "=", req.params.MascotaID)
    //   .andWhere("MascotasSolicitudes.ID","=",);
    res.render("procesoAdopcion");
  }
};
