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

const { encrypt, decrypt } = require("../utils/cryptoUtils/randomId");

const { sendMail } = require("./email");

const { deleteFiles } = require("../utils/multipartRequestHandle");
const Usuario = require("../models/Usuario");
const { getTodayDateFormated } = require("./NotificacionesController");

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
            // console.log(req);
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
        if (value == req.body.Contrasena && value.length >= 8) {
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
  Municipio: {
    in: "body",
    isNumeric: {
      errorMessage: "Municipio en formato incorrecto",
    },
    custom: {
      options: (value, { req, location, path }) => {
        if (value == -1) {
          throw new Error("Por favor, seleccione un municipio");
        }
        return true;
      },
    },
  },
  Estado: {
    in: "body",
    isNumeric: {
      errorMessage: "Estado en formato incorrecto",
    },
    custom: {
      options: (value, { req, location, path }) => {
        if (value == -1) {
          throw new Error("Por favor, seleccione un estado");
        }
        return true;
      },
    },
  },

  Nombre: {
    in: "body",
    trim: true,
    isLength: {
      options: { min: 3 },
      errorMessage:
        "El campo de nombre es debe ser de por lo menos 3 caracteres",
    },

    custom: {
      options: (value, { req, location, path }) => {
        // return value + req.body.foo + location + path;
        if (!isAlpha(value)) {
          throw new Error("El nombre solo debe contener letras");
        }
        let checkValue = value.replaceAll(" ", "").trim();
        if (checkValue.length < 3) {
          throw new Error("El nombre debe tener por lo menos 3 letras");
        }
        return true;
      },
    },
  },
  ApellidoP: {
    in: "body",
    custom: {
      options: (value, { req, location, path }) => {
        // return value + req.body.foo + location + path;
        if (!isAlpha(value)) {
          throw new Error("El apellido paterno solo debe contener letras");
        }
        let checkValue = value.replaceAll(" ", "").trim();
        if (checkValue.length < 3) {
          throw new Error(
            "El apellido paterno debe tener por lo menos 3 caracteres"
          );
        }
        return true;
      },
    },
  },
  ApellidoM: {
    in: "body",
    custom: {
      options: (value, { req, location, path }) => {
        // return value + req.body.foo + location + path;
        if (!isAlpha(value)) {
          throw new Error("El apellido materno solo debe contener letras");
        }
        let checkValue = value.replaceAll(" ", "").trim();
        if (checkValue.length < 3) {
          throw new Error(
            "El apellido materno debe tener por lo menos 3 caracteres"
          );
        }
        return true;
      },
    },
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
          .andWhere("ID", "!=", req.registroIdDecrypted)
          .then((CorreoFind) => {
            // console.log(req);
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
        if (value == req.body.Contrasena && value.length >= 8) {
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
      options: { min: 3 },
      errorMessage:
        "El campo de nombre es debe ser de por lo menos 3 caracteres",
    },

    custom: {
      options: (value, { req, location, path }) => {
        // return value + req.body.foo + location + path;
        if (!isAlpha(value)) {
          throw new Error("El nombre solo debe contener letras");
        }
        let checkValue = value.replaceAll(" ", "").trim();
        if (checkValue.length < 3) {
          throw new Error("El nombre debe tener por lo menos 3 letras");
        }
        return true;
      },
    },
  },
  ApellidoP: {
    in: "body",
    custom: {
      options: (value, { req, location, path }) => {
        // return value + req.body.foo + location + path;
        if (!isAlpha(value)) {
          throw new Error("El apellido paterno solo debe contener letras");
        }
        let checkValue = value.replaceAll(" ", "").trim();
        if (checkValue.length < 3) {
          throw new Error(
            "El apellido paterno debe tener por lo menos 3 caracteres"
          );
        }
        return true;
      },
    },
  },
  ApellidoM: {
    in: "body",
    custom: {
      options: (value, { req, location, path }) => {
        // return value + req.body.foo + location + path;
        if (!isAlpha(value)) {
          throw new Error("El apellido paterno solo debe contener letras");
        }
        let checkValue = value.replaceAll(" ", "").trim();
        if (checkValue.length < 3) {
          throw new Error(
            "El apellido paterno debe tener por lo menos 3 caracteres"
          );
        }
        return true;
      },
    },
  },
});
const encryptIdRegistro = (req, res, next) => {
  if (res.RegistroPrevio) {
    res.registroIdEncrypted = encrypt(res.RegistroPrevio.ID.toString());
    next();
  } else {
    next(new Error("no hay registro previo"));
  }
};

const decryptIdRegistro = (req, res, next) => {
  console.log(req.params);
  if (req.params.registroID) {
    req.registroIdDecrypted = decrypt(req.params.registroID);
    if (req.registroIdDecrypted == "error") {
      return res.redirect("/login");
    }
    next();
  } else {
    next(new Error("no hay registro previo"));
  }
};
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
    isModerador: false,
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

exports.registro_aprobar = [
  (req, res, next) => {
    Registro.query()
      .findOne({ ID: req.params.registroID })
      .then((registro) => checkIfPendiente(registro, res))
      .then((registro) => patchRegistroPendiente(registro, 0))
      .then((registroCambiado) => crearUsuarioPromise(registroCambiado, res))
      .then((registro) => {
        if (registro) {
          next();
        } else {
          res.json("Algo ha salido mal");
        }
      })
      .catch((err) => {
        console.log("Algo ha salido mal en registro_aprobar");
        next(err);
      });
  },
  (req, res, next) => {
    res.subjectCorreo = "Registro Cuenta aprobada";

    res.render(
      "correoCuentaVerificada",
      {
        login: `${process.env.SERVER_DOMAIN}/login`,
        Nombre: res.registroPatch.Nombre,
        Titulo: "¡Bienvenido!",
      },
      (err, html) => {
        if (err) {
          next(err);
        } else {
          res.htmlCorreo = html;
          next();
        }
      }
    );
  },
  sendMail,
];

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

const patchRegistroPendiente = (registro, pendiente) => {
  return new Promise((resolve, reject) => {
    let Fecha_Registro = getTodayDateFormated();
    resolve(
      Registro.query().patchAndFetchById(registro.ID, {
        Pendiente: pendiente,
        Fecha_Registro: Fecha_Registro,
      })
    );
  });
};

const crearUsuarioPromise = (registro, res) => {
  res.registroPatch = registro;
  return new Promise((resolve, reject) => {
    let Fecha_Generacion = getTodayDateFormated();
    resolve(
      Usuario.query().insertAndFetch({
        Foto_Perfil: "/images/ImagenesPerfilUsuario/default.png",
        FK_Registro: registro.ID,
        Reputacion: 0,
        UltimaConexion: Fecha_Generacion,
      })
    );
  });
};

exports.registro_devolver = [
  (req, res, next) => {
    Registro.query()
      .findOne({ ID: req.params.registroID })
      .then((registro) => checkIfPendiente(registro, res))
      .then((registro) => patchRegistroPendiente(registro, 0))
      .then((registro) => {
        if (registro) {
          res.registroPatch = registro;
          res.RegistroPrevio = registro;
          next();
        }
      });
  },
  encryptIdRegistro,
  (req, res, next) => {
    res.subjectCorreo = "Registro devuelto";
    console.log(req.body);
    console.log(req.body.razon);

    res.render(
      "correoCuentaDevuelta",
      {
        editarUrl: `${process.env.SERVER_DOMAIN}/registro/editar/${res.registroIdEncrypted}`,
        Nombre: res.registroPatch.Nombre,
        Titulo: "¡Hola!",
        razon: req.body.razon,
      },
      (err, html) => {
        if (err) {
          next(err);
        } else {
          res.htmlCorreo = html;
          next();
        }
      }
    );
  },
  sendMail,
];

const getRegistroPrevio = (req, res, next) => {
  Registro.query()
    .withGraphJoined("[muni,RegistroUsuario]")
    .findOne({ "registro.ID": req.registroIdDecrypted })
    .then((RegistroPrevio) => {
      if (RegistroPrevio) {
        console.log(RegistroPrevio.Pendiente);
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

exports.registro_edit_get = [
  getAllEstados,
  decryptIdRegistro,
  getRegistroPrevio,
  (req, res, next) => {
    if (
      res.RegistroPrevio.RegistroUsuario == null &&
      res.RegistroPrevio.Pendiente == 0
    ) {
      let isModerador = false;
      if (res.RegistroPrevio.Tipo_Usuario == 3) {
        isModerador = true;
      }
      console.log(res.RegistroPrevio);
      res.render("HacerRegistro", {
        title: "Editar Registro",
        EstadosMunicipios: res.stuff,
        errors: res.errors,
        RegistroPrevio: res.RegistroPrevio,
        urlVerificarReq: `/registro/verifyEditar/${req.params.registroID}`,
        urlGrabarReq: `/registro/editarPatch/${req.params.registroID}`,
        isModerador: isModerador,
      });
    } else {
      res.redirect("/login");
    }
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
    if (res.errors && res.errors.length > 0) {
      console.log("si se paso we");
      return res.json({ errors: res.errors });
    } else {
      if (req.body.pathFilesSaved) {
        if (req.body.ApellidoP && req.body.ApellidoM) {
          req.body.Nombre = req.body.Nombre.concat(
            " ",
            req.body.ApellidoP
          ).concat(" ", req.body.ApellidoM);
        }
        console.log(req.body);
        let Fecha_Registro = getTodayDateFormated();
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
            Fecha_Registro: Fecha_Registro,
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
  decryptIdRegistro,
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
        if (req.body.ApellidoP && req.body.ApellidoM) {
          req.body.Nombre = req.body.Nombre.concat(
            " ",
            req.body.ApellidoP
          ).concat(" ", req.body.ApellidoM);
        }
        let Fecha_Registro = getTodayDateFormated();

        Registro.query()
          .findById(req.registroIdDecrypted)
          .patch({
            Tipo_Usuario: req.body.Tipo,
            Nombre: req.body.Nombre,
            Correo: req.body.Correo,
            Municipio: req.body.Municipio,
            Telefono: req.body.Telefono,
            Contrasena: req.body.Contrasena,
            Documento_Identidad: req.body.pathFilesSaved,
            Pendiente: 1,
            Fecha_Registro: Fecha_Registro,
          })
          .then((registroCreado) => {
            let as = "";
            as.split(";");
            let filesPath = res.RegistroPrevio.Documento_Identidad.split(";");
            let filesPathCorrected = [];
            filesPath.forEach((path) => {
              if (path != "") {
                let newFilePath = `public/${path}`;
                filesPathCorrected.push(newFilePath);
              }
            });
            console.log(filesPathCorrected);

            req.deleteFilesPath = filesPathCorrected;
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
  validateFilesExtension([".png", ".jpg", ".jpeg"]),
  RegistroSchema,
  validateRequest,
  (req, res) => {
    if (res.errors) {
      return res.json({ errors: res.errors, correct: res.correctFields });
    } else {
      return res.json({ errors: [], res: "ok" });
    }
  },
];

module.exports.registro_verify_editar = [
  getTextFields.none(),
  validateFilesExtension([".png", ".jpg", ".jpeg"]),
  decryptIdRegistro,
  RegistroSchemaEditar,
  validateRequest,
  (req, res) => {
    if (res.errors) {
      return res.json({ errors: res.errors, correct: res.correctFields });
    } else {
      return res.json({ errors: [], res: "ok" });
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
  console.log(process.env.SERVER_DOMAIN);
  Registro.query()
    .withGraphJoined("muni.[estado]")
    // .whereNot("RegistroUsuario.ID", ">", "0")
    .andWhere("registro.Pendiente", "=", "1")
    .then((registrosPendientes) => {
      res.render("listaRegistros", {
        registros: registrosPendientes,
        Tipo: req.session.Tipo,
      });
      // res.json(Result);
    })
    .catch((err) => {
      console.log("Algo ha salido mal en registros_pendientes_list");
      console.log(err);
      next(err);
    });
};

function isAlpha(str) {
  let regex = /[^a-zñÑáÁéÉíÍóÓúÚüÜ]/i;
  let stringCheck = str.replaceAll(" ", "");
  return !regex.test(stringCheck);
}
