var Registro = require("../models/Registro");
var Municipio = require("../models/Municipio");
var Estado = require("../models/Estado");
var objection = require("objection");
const { validationResult, checkSchema } = require("express-validator");
const multer = require("multer");
const { uploadFile } = require("./uploadFileMiddleware");
const {
  validateRequest,
  validateRequestFiles,
  validateFilesExtension,
} = require("./requestValidator");

const RegistroSchema = checkSchema({
  // Municipio: {
  //   in: "body",
  //   custom: {
  //     options: (value, { req, location, path }) => {
  //       if (value == 1) {
  //         throw new Error("Inga tu roña we vives en Aguascalientes");
  //       }
  //       return "a";
  //     },
  //   },
  // },
  Correo: {
    in: "body",
    trim: true,
    isLength: {
      options: { min: 1 },
      errorMessage: "El campo de correo es obligatorio",
    },
    isEmail: {
      errorMessage: "Correo en formato incorrecto",
    },
    custom: {
      options: (value, { req, location, path }) => {
        return Registro.query()
          .findOne({ Correo: value })
          .then((CorreoFind) => {
            if (CorreoFind) {
              throw new Error("Ese correo ya ha sido registrado");
            }
            var nombreUsuario = value.split("@");
            if (nombreUsuario[0].length < 5) {
              throw new Error(
                "Correo en formato incorrecto. El nombre de usuario debe de constar de 5 o más caracteres"
              );
            }
          });
      },
    },
  },
  Contrasena: {
    in: "body",
    isLength: {
      options: { min: 8 },
      errorMessage: "La contraseña debe tener al menos 8 caracteres de largo",
    },
  },
  Telefono: {
    in: "body",
    trim: true,
    isNumeric: {
      errorMessage: "El telefono solo debe constar de numeros",
    },
    isLength: {
      options: { min: 10, max: 10 },
      errorMessage: "El telefono debe tener 10 digitos",
    },
  },
  Nombre: {
    in: "body",
    trim: true,
    isLength: {
      options: { min: 1 },
      errorMessage: "El campo de nombre es obligatorio",
    },
  },
  ApellidoP: {
    in: "body",
    // isLength: {
    //   options: { min: 1 },
    //   errorMessage: "El campo de Apellido Paterno es obligatorio",
    // },
    custom: {
      options: (val, { req, location, path }) => {
        if (val == null) {
          return true;
          // throw new Error("EEEEE");
        }

        val = val.trim();

        if (val.length <= 1) {
          throw new Error("El apellido paterno es un campo obligatorio");
        }
        return "a";
      },
    },
    trim: true,
  },
  ApellidoM: {
    in: "body",
    custom: {
      options: (val, { req, location, path }) => {
        if (val == null) {
          return true;
          // throw new Error("EEEEE");
        }

        val = val.trim();

        if (val.length <= 1) {
          throw new Error("El apellido materno es un campo obligatorio");
        }
        return "a";
      },
    },
    trim: true,
  },
});
// const { initialize } = require("objection");

const renderRegistroMiddleware = (req, res, next) => {
  if (res.stuff) {
    console.log("si hay estados");
  } else console.log("no hay estados");
  res.render("HacerRegistro", {
    title: "Registrarse",
    EstadosMunicipios: res.stuff,
    errors: res.errors,
  });
};
const hacerRegistroMiddleware = [
  (req, res, next) => {
    Estado.query()
      .withGraphFetched("municipios")
      .then((Estados) => {
        console.log("Agregue estados");
        res.stuff = Estados;
        next();
      });
  },
  renderRegistroMiddleware,
];

exports.registro_list = (req, res) => {
  Registro.query()
    .then((Result) => {
      res.json(Result);
    });
};

exports.registro_details = (req, res) => {
  Registro.query()
    .findById(req.params.id)
    .then((Registros) => {
      // res.json(Registros);
      res.render("Registro", {
        results: Registros,
        encabezado: Object.getOwnPropertyNames(Registros),
      });
      console.log(JSON.stringify(Registros));
    });
};

exports.registro_crear_post = [
  validateRequestFiles("images/imagenesRegistros"),
  RegistroSchema,
  validateRequest,
  (req, res, next) => {
    console.log("im in registro controller");
    console.log(res.errors);
    console.log(req.body.Nombre);
    if (res.errors) {
      console.log("si se paso we");
      return res.json({ errors: res.errors });
    } else {
      if (req.body.pathFilesSaved) {
        console.log(req.body);
        Registro.query()
          .insert({
            Tipo_Usuario: req.body.Tipo,
            Nombre: req.body.Nombre,
            Correo: req.body.Correo,
            Municipio: req.body.Municipio,
            Telefono: req.body.Telefono,
            Contrasena: req.body.Contrasena,
            Documento_Identidad: req.body.pathFilesSaved,
          })
          .then((registroCreado) => {
            return res.json({ res: "ok i did it" });
          });
      }
    }
  },
];

exports.registro_redirect = (req, res) => {
  res.json({ registro: "completed" });
};
var getTextFields = multer();
module.exports.registro_verify = [
  getTextFields.none(),
  validateFilesExtension([".png", ".jpg", ".bmp", ".jpeg"]),
  RegistroSchema,
  validateRequest,
  (req, res) => {
    if (res.errors) {
      return res.json({ errors: res.errors, correct: res.correctFields });
    } else {
      return res.json({ res: "ok" });
    }
  },
];

exports.registro_crear_get = [hacerRegistroMiddleware];

exports.registro_municipio = async (req, res) => {
  // await initialize([Registro, Municipio]);
  await Registro.query()
    .withGraphJoined("muni")
    .where("muni.Nombre", "=", "Asientos")
    .then((Results) => {
      res.json(Results);
      console.log(Results);
    });

  // var A = Registro.query()
  //   // .innerJoin("Municipio", "Registro.Municipio", "=", "Municipio.ID")
  //   // .withGraphJoined("muni")
  //   .joinRelated("muni")
  //   .toKnexQuery();
  // console.info(A.toQuery());
};

exports.registro_esme = async (req, res) => {
  var Esme = {
    Tipo_Usuario: 1,
    Nombre: "Esmeralda Itzel",
    Correo: "esme@gmail.com",
    Municipio: "2a",
    Telefono: "3323821711",
    Contrasena: "mapaches",
    Documento_Identidad: "cosa.pdf",
  };
  Registro.query().insert(Esme).then(res.json(Esme));
};
