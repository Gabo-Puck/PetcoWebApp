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
    .where("registro.Contrasena", "=", req.body.Password)
    .andWhere("registro.Correo", "=", req.body.Correo)
    .then((Results) => {
      if (Results.length > 0) {
        Usuario.query()
          .where("usuario.ID", "=", Results[0].ID)
          .then((UsserLogged) => {
            //console.log(Results[0].Nombre);
            req.session.UserSessionNombre=Results[0].Nombre;

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
                ruta: "petco/inicio",
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
