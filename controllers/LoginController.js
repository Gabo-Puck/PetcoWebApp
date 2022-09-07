var Registro = require("../models/Registro");
var Usuario = require("../models/Usuario");
var Municipio = require("../models/Municipio");
var objection = require("objection");

exports.session = (req, res, next) => {
  Registro.query()
    .where("Registro.Contrasena", "=", "12341")
    .then((Results) => {
      resultado = Results;
      console.log(Results);
      res.render("login.ejs");
    })
    .catch((err) => next(err));
};

exports.CheckDB = (req, res, next) => {
  console.log(req.body);

  Registro.query()
    .where("Registro.Contrasena", "=", req.body.Password)
    .andWhere("Registro.Correo", "=", req.body.Correo)
    .then((Results) => {
      if (Results.length > 0) {
        Usuario.query()
          .where("Usuario.ID", "=", Results[0].ID)
          .then((UsserLogged) => {
            console.log(Results);

            //LoginCorrecto

            if (UsserLogged.length > 0) {
              //Usuario encontrado y existente
              req.session.Logged = true;
              Usuario.query();
              req.session.IdSession = UsserLogged[0].ID;
              console.log(UsserLogged);
              console.log(req.session);
              //Alert
              res.render("login.ejs", {
                alert: true,
                alertTitle: "Conexion Exitosa",
                alertMessage: "Se ha iniciado Sesion",
                alertIcon: "success",
                showCofirmButton: false,
                timer: 2500,
                ruta: "./inicio",
              });
            } else {
              //Usuario no encontrado
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
          });
      } else {
        //Login Incorrecto
        //Alert
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
    })
    .catch((err) => next(err));
};
