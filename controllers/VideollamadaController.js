const Registro = require("../models/Registro");

exports.getUserData = (req, res, next) => {
  if (req.session.IdSession) {
    Registro.query()
      .withGraphJoined("RegistroUsuario")
      .findOne({ "RegistroUsuario.ID": req.session.IdSession })
      .then((user) => {
        res.render("videochatRoom", { nombre: user.Nombre });
      });
  }
};
