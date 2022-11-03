var Registro = require("../models/Registro");
var Usuario = require("../models/Usuario");
var Municipio = require("../models/Municipio");
var objection = require("objection");
var { decrypt, encrypt } = require("../utils/cryptoUtils/randomId");
const { sendMail } = require("./email");
const { validationResult, checkSchema } = require("express-validator");
const { getTodayDateFormated } = require("./NotificacionesController");

const correoSchema = checkSchema({
  correo: {
    in: ["params", "query"],
    trim: true,
    isLength: {
      options: { min: 1 },
      errorMessage: "El campo de correo es obligatorio",
    },
    isEmail: {
      errorMessage: "Correo en formato incorrecto",
    },
  },
});

const contrasenaSchema = checkSchema({
  Contrasena: {
    in: "body",
    isLength: {
      options: { min: 8 },
      errorMessage: "La contraseña debe tener al menos 8 caracteres de largo",
    },
    custom: {
      options: (value, { req, location, path }) => {
        if (value == req.body.ContrasenaVer) {
          return true;
        }
        throw new Error("Las contraseñas no coinciden");
      },
    },
  },
  ContrasenaVer: {
    in: "body",
    isLength: {
      options: { min: 8 },
      errorMessage: " ",
    },
    custom: {
      options: (value, { req, location, path }) => {
        if (value == req.body.Contrasena && value.length >= 8) {
          return true;
        }
        throw new Error(" ");
      },
    },
  },
});

exports.session = (req, res, next) => {
  if (req.session.IdSession) {
    res.redirect("/petco/inicio");
  } else {
    res.render("login.ejs");
  }
};

exports.sessionModerador = (req, res, next) => {};

exports.recuperarContrasena = (req, res, next) => {
  res.render("recuperarContrasena.ejs");
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
        let Fecha_Generacion = getTodayDateFormated();
        console.log(
          "🚀 ~ file: LoginController.js ~ line 83 ~ .then ~ Fecha_Generacion",
          Fecha_Generacion
        );
        Results[0].RegistroUsuario.$query()
          .patchAndFetch({ UltimaConexion: Fecha_Generacion })
          .then((usuarioPatched) => {
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
            if (Results[0].Tipo_Usuario == 1 || Results[0].Tipo_Usuario == 2) {
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
            if (Results[0].Tipo_Usuario == 3) {
              req.session.isModerador = true;
              res.render("login.ejs", {
                alert: true,
                alertTitle: "Conexion Exitosa",
                alertMessage: "Se ha iniciado Sesion",
                alertIcon: "success",
                showCofirmButton: false,
                timer: 2500,
                ruta: "/moderador",
              });
            }
          })
          .catch((err) => {
            console.log(err);
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

const encryptRegistroIdPasschange = [
  correoSchema,
  (req, res, next) => {
    const result = validationResult(req);
    console.log("a: ", req.params);
    if (!result.isEmpty()) {
      let element = result.array();
      element = result.array({ onlyFirstError: true });
      res.json({ error: element[0].msg });
      return;
    }
    Registro.query()
      .withGraphJoined("RegistroUsuario")
      .findOne({ Correo: req.params.correo })
      .then((usuarioCorreo) => {
        console.log(usuarioCorreo);
        if (usuarioCorreo === undefined) {
          console.log("No correo encontrado");
          res.json({ error: "No se ha encontrado esta dirección de correo" });
        } else if (usuarioCorreo.RegistroUsuario === null) {
          console.log("No cuenta validada");
          res.json({
            error: "El registro asociado a este correo no ha sido validado",
          });
        } else {
          let idEncrypted = encrypt(usuarioCorreo.ID.toString());
          if (idEncrypted == "error") {
            console.log("error");
            res.json({ error: "Algo ha salido mal, intente más tarde" });
          } else {
            res.registroActivarChange = usuarioCorreo;
            usuarioCorreo
              .$query()
              .patch({ cambioContrasena: 1 })
              .then(() => {
                res.registroPatch = {};
                res.registroPatch.Correo = req.params.correo;
                console.log("id enc:", idEncrypted);
                res.urlCambio = `${process.env.SERVER_DOMAIN}/login/editarContrasena/${idEncrypted}`;
                next();
              });

            // let idDecrypted = decrypt(idEncrypted);
            // console.log("id dec:", idDecrypted);

            // console.log("link mandado");
          }
        }
      })
      .catch((err) => {
        console.log("Enviar correo", Date.now(), err);
      });
  },
];

exports.requestPassChange = [
  encryptRegistroIdPasschange,
  (req, res, next) => {
    res.render(
      "correoRestablecerContra.ejs",
      { url: res.urlCambio },
      (err, html) => {
        if (err) {
          next(err);
        } else {
          res.htmlCorreo = html;
          res.subjectCorreo = "Cambio de contraseña";
          next();
        }
      }
    );
  },
  sendMail,
];

exports.editarContrasenaGet = [
  (req, res, next) => {
    let id = decrypt(req.params.correo);
    if (id == "error") {
      res.redirect("/login");
    }
    // console.log("id: ", id);
    Registro.query()
      .findById(id)
      .then((UsuarioFind) => {
        if (UsuarioFind === undefined || UsuarioFind.cambioContrasena == 0) {
          res.redirect("/login");
        } else {
          res.render("editarContrasena.ejs", { id: req.params.correo });
        }
      })
      .catch((err) => {
        console.log(err);
        next(err);
      });
  },
];

exports.editarContrasenaPost = [
  contrasenaSchema,
  (req, res, next) => {
    const result = validationResult(req);
    console.log("a: ", req.params);
    if (!result.isEmpty()) {
      let element = result.array();
      element = result.array({ onlyFirstError: true });
      res.json({ error: element });
      return;
    }
    let decryptedID = decrypt(req.body.id);
    Registro.query()
      .withGraphJoined("RegistroUsuario")
      .findById(decryptedID)
      .then((findedUsuario) => {
        if (findedUsuario) {
          if (findedUsuario === undefined) {
            res.json({
              error: [
                {
                  msg: "No se ha encontrado un usuario con este correo",
                  param: "Contrasena",
                },
                {
                  msg: "",
                  param: "ContrasenaVer",
                },
              ],
            });
            return;
          }
          if (findedUsuario.RegistroUsuario === null) {
            res.json({
              error: [
                {
                  msg: "Este correo no tiene una cuenta validada asociada",
                  param: "Contrasena",
                },
                {
                  msg: "",
                  param: "ContrasenaVer",
                },
              ],
            });
            return;
          }
          if (findedUsuario.Contrasena == req.body.Contrasena) {
            res.json({
              error: [
                {
                  msg: "La contraseña nueva y la actual son las mismas. Elije otra porfavor",
                  param: "Contrasena",
                },
                {
                  msg: "",
                  param: "ContrasenaVer",
                },
              ],
            });
            return;
          }
          findedUsuario
            .$query()
            .patch({ Contrasena: req.body.Contrasena, cambioContrasena: 0 })
            .then(() => {
              res.json("ok");
            })
            .catch((err) => {
              console.log("Cambiar contraseña ", Date.now(), err);
            });
        }
      })
      .catch((err) => {
        console.log("Obtener usuario contraseña", Date.now(), err);
      });
  },
];
