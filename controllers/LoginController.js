var Registro = require("../models/Registro");
var Usuario = require("../models/Usuario");
var Municipio = require("../models/Municipio");
var objection = require("objection");

exports.session = (req, res, next) => {
  if (req.session.IdSession) {
    res.redirect("petco/inicio");
  } else {
    res.render("login.ejs");
  }
};

exports.CheckDB = (req, res, next) => {
  console.log(req.body);

  Registro.query()
    .withGraphJoined("RegistroUsuario")
    .where("registro.Contrasena", "=", req.body.Password)
    .andWhere("registro.Correo", "=", req.body.Correo)
    .then((Results) => {
      console.log(Results[0]);
      //El usuario se Logeo
      if (Results[0] != null && Results[0].RegistroUsuario != null) {
        console.log("ojo");
        req.session.Logged = true;
        req.session.IdSession = Results[0].RegistroUsuario.ID;
        req.session.Tipo = Results[0].Tipo_Usuario;
        console.log(Results[0]);
        console.log(req.session.Tipo);

        console.log(
          "🚀 ~ file: LoginController.js ~ line 29 ~ .then ~ session",
          req.session.IdSession
        );

        res.render("login.ejs", {
          alert: true,
          alertTitle: "Conexion Exitosa",
          alertMessage: "Se ha iniciado Sesion",
          alertIcon: "success",
          showCofirmButton: false,
          timer: 2500,
          ruta: "./inicio",
        });
      }

      //Datos Sin coincidencias
      if (Results[0] == null) {
        res.render("login.ejs", {
          alert: true,
          alertTitle: "Error",
          alertMessage: "La direccion de correo y la contraseña no coinciden",
          alertIcon: "error",
          showCofirmButton: true,
          timer: false,
          ruta: "./login",
        });
      }

      //Usuario no aprobado
      if (Results[0] != null && Results[0].RegistroUsuario == null) {
        res.render("login.ejs", {
          alert: true,
          alertTitle: "¡Ups!",
          alertMessage: "Aún no cuentas un usuario valido para ingresar",
          alertIcon: "warning",
          showCofirmButton: true,
          timer: false,
          ruta: "./login",
        });
      }
    })
    .catch((err) => next(err));
};
