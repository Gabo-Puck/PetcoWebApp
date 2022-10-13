var Registro = require("../models/Registro");
var Municipio = require("../models/Municipio");
var Estado = require("../models/Estado");
var objection = require("objection");
const { validationResult, checkSchema } = require("express-validator");
const multer = require("multer");
const { uploadFile } = require("./uploadFileMiddleware");
const { secureRegistro } = require("../utils/formDatabaseClean");
const {
  validateRequest,
  validateRequestFiles,
  validateFilesExtension,
} = require("./requestValidator");

const { deleteFiles } = require("../utils/multipartRequestHandle");
const Usuario = require("../models/Usuario");

const RegistroSchema = checkSchema({
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
            console.log(req);
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
    custom: {
      options: (value, { req, location, path }) => {
        if (value == req.body.ContrasenaVer) {
          return true;
        }
        throw new Error("La contraseña no coinciden");
      },
    },
  },
  ContrasenaVer: {
    in: "body",
    custom: {
      options: (value, { req, location, path }) => {
        if (value == req.body.Contrasena && value.length > 8) {
          return true;
        }
        throw new Error(" ");
      },
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

const RegistroSchemaEditar = checkSchema({
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
          .where("Correo", "=", value)
          .andWhere("ID", "!=", req.params.registroID)
          .then((CorreoFind) => {
            console.log(req);
            if (CorreoFind.length != 0) {
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
    custom: {
      options: (value, { req, location, path }) => {
        if (value == req.body.ContrasenaVer) {
          return true;
        }
        throw new Error("La contraseña no coinciden");
      },
    },
  },
  ContrasenaVer: {
    in: "body",
    custom: {
      options: (value, { req, location, path }) => {
        if (value == req.body.Contrasena && value.length > 8) {
          return true;
        }
        throw new Error(" ");
      },
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
const renderRegistroMiddleware = (req, res, next) => {
  if (res.stuff) {
    console.log("si hay estados");
  } else console.log("no hay estados");
  res.render("HacerRegistro", {
    title: "Registrarse",
    EstadosMunicipios: res.stuff,
    errors: res.errors,
    RegistroPrevio: null,
    urlVerificarReq: "/registro/verify",
    urlGrabarReq: "/registro/crear",
  });
};
const getAllEstados = (req, res, next) => {
  Estado.query()
    .withGraphFetched("municipios")
    .then((Estados) => {
      res.stuff = Estados;
      next();
    })
    .catch((err) => next(err));
};
const hacerRegistroMiddleware = [getAllEstados, renderRegistroMiddleware];

exports.registro_estado = (req, res, next) => {
  Registro.query()
    .withGraphJoined("muni.[estado]")
    .findOne({ "registro.ID": req.params.registroID })
    .then((RegistroEncontrado) => {
      if (RegistroEncontrado) {
        RegistroEncontrado = secureRegistro(RegistroEncontrado, [
          "Correo",
          "Telefono",
          "Contrasena",
          "Pendiente",
          "Municipio",
        ]);
        res.json({ RegistroEncontrado: RegistroEncontrado });
      } else {
        res.json("failed");
      }
    })
    .catch((err) => {
      console.log("Algo ha salido mal en registro_estado");
      next(err);
    });
};

exports.registro_aprobar = (req, res, next) => {
  Registro.query()
    .findOne({ ID: req.params.registroID })
    .then((registro) => checkIfPendiente(registro, res))
    .then((registro) => patchRegistroPendiente(registro))
    .then((registroCambiado) => crearUsuarioPromise(registroCambiado))
    .then((registro) => {
      if (registro) {
        res.json("ok");
      }
    })
    .catch((err) => {
      console.log("Algo ha salido mal en registro_aprobar");
      next(err);
    });
};

const checkIfPendiente = (registro, res) => {
  return new Promise((resolve, reject) => {
    if (registro) {
      if (registro.Pendiente == 1) {
        resolve(registro);
      } else {
        return res.json("aprobadoPreviamente");
      }
    }
  });
};

const patchRegistroPendiente = (registro) => {
  return new Promise((resolve, reject) => {
    resolve(Registro.query().patchAndFetchById(registro.ID, { Pendiente: 0 }));
  });
};

const crearUsuarioPromise = (registro) => {
  return new Promise((resolve, reject) => {
    resolve(
      Usuario.query().insertAndFetch({
        Foto_Perfil: "/images/ImagenesPerfilUsuario/default.png",
        FK_Registro: registro.ID,
        Reputacion: 0,
      })
    );
  });
};

exports.registro_devolver = (req, res, next) => {};

const getRegistroPrevio = (req, res, next) => {
  Registro.query()
    .withGraphJoined("muni")
    .findOne({ "registro.ID": req.params.registroID })
    .then((RegistroPrevio) => {
      if (RegistroPrevio) {
        res.RegistroPrevio = RegistroPrevio;
        next();
      } else {
        res.redirect("/login");
      }
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

// const getRegistroPrevio2 = (req, res, next) => {
//   Registro.query()
//     .withGraphJoined("muni")
//     .findOne({ "registro.ID": req.params.registroID })
//     .then((RegistroPrevio) => {
//       if (RegistroPrevio) {
//         res.RegistroPrevio = RegistroPrevio;
//         console.log(RegistroPrevio);

//         res.render("HacerRegistro", {
//           title: "Editar Registro",
//           EstadosMunicipios: res.stuff,
//           errors: res.errors,
//           RegistroPrevio: res.RegistroPrevio,
//           urlVerificarReq: `/registro/verifyEditar/${req.params.registroID}`,
//           urlGrabarReq: `/registro/editarPatch/${req.params.registroID}`,
//         });
//       } else {
//         res.redirect("/login");
//       }
//     })
//     .catch((err) => {
//       console.log(err);
//       next(err);
//     });
// };

exports.registro_edit_get = [
  getAllEstados,
  getRegistroPrevio,
  (req, res, next) => {
    console.log(res.RegistroPrevio);
    res.render("HacerRegistro", {
      title: "Editar Registro",
      EstadosMunicipios: res.stuff,
      errors: res.errors,
      RegistroPrevio: res.RegistroPrevio,
      urlVerificarReq: `/registro/verifyEditar/${req.params.registroID}`,
      urlGrabarReq: `/registro/editarPatch/${req.params.registroID}`,
    });
  },
];

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
            Pendiente: 1,
          })
          .then((registroCreado) => {
            return res.json({ res: "ok i did it" });
          });
      }
    }
  },
];

exports.registro_editar_patch = [
  validateRequestFiles("images/imagenesRegistros"),
  RegistroSchemaEditar,
  validateRequest,
  getRegistroPrevio,
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
          .findById(req.params.registroID)
          .patch({
            Tipo_Usuario: req.body.Tipo,
            Nombre: req.body.Nombre,
            Correo: req.body.Correo,
            Municipio: req.body.Municipio,
            Telefono: req.body.Telefono,
            Contrasena: req.body.Contrasena,
            Documento_Identidad: req.body.pathFilesSaved,
            Pendiente: 1,
          })
          .then((registroCreado) => {
            let as = "";
            as.split(";");
            let filesPath = res.RegistroPrevio.Documento_Identidad.split(";");
            req.deleteFilesPath = filesPath;
            deleteDocumentosIdentidad(req).then(() => {
              return res.json({ res: "ok i did it" });
            });
          });
      }
    }
  },
];

function deleteDocumentosIdentidad(req) {
  let deletePromises = deleteFiles(req);
  return new Promise((resolve, reject) => {
    resolve(Promise.all(deletePromises));
  });
}
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

module.exports.registro_verify_editar = [
  getTextFields.none(),
  validateFilesExtension([".png", ".jpg", ".bmp", ".jpeg"]),
  RegistroSchemaEditar,
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
  // Registro.query().insert(Esme).then(res.json(Esme));
  Registro.query().then((ez) => console.log(ez));
};

exports.registros_pendientes_list = (req, res, next) => {
  Registro.query()
    .withGraphJoined("muni.[estado]")
    // .whereNot("RegistroUsuario.ID", ">", "0")
    .andWhere("registro.Pendiente", "=", "1")
    .then((registrosPendientes) => {
      res.render("listaRegistros", { registros: registrosPendientes });
      // res.json(Result);
    })
    .catch((err) => {
      console.log("Algo ha salido mal en registros_pendientes_list");
      console.log(err);
      next(err);
    });
};
