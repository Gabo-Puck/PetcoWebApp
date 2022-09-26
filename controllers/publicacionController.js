var Mascota = require("../models/Mascota");
var {
  fetchInput,
  uploadFiles,
  validateBody,
  cleanInputID,
} = require("../utils/multipartRequestHandle/index");
var probe = require("probe-image-size");
const Especie = require("../models/Especie");
const Salud = require("../models/Salud");
const Castrado = require("../models/Castrado");
const Usuario = require("../models/Usuario");
const Tamano = require("../models/Tamano");
const Publicacion = require("../models/Publicacion");
const { check, validationResult } = require("express-validator");
const _ = require("lodash");

// const {  } = require("express-validator/src/base");
// const { ValidationError } = require("express-json-validator-middleware");

exports.prueba = (req, res) => {
  // Mascota.query()
  //   .withGraphFetched(
  //     "[MascotasEspecie,MascotasEstado,MascotasCastrado,MascotasSalud,MascotasTamano,MascotasPublicacion,MascotasImagenes,MascotasVacunas]"
  //   )
  //   .then((resultado) => res.json(resultado));
  Mascota.query()
    .withGraphFetched(
      "[MascotasPasos.[Proto.[FormularioProtocolo.[Preguntas.[Opciones_Respuestas_Pregunta]]]]]"
    )
    .findById(10)
    .then((re) =>
      res.json(
        re.MascotasPasos[re.MascotasPasos.length - 1].Proto.FormularioProtocolo
      )
    );
};

var acceptedTypes = ["image/jpeg", "image/png"];

const getMascotaTemplate = (req, res, next) => {
  res.render("Publicacion/mascotaTemplate", {}, (error, html) => {
    res.htmlTemplate = html.replace(/\r?\n|\r/g, " ");
    next();
  });
};

const getAllEspecieWithVacuna = (req, res, next) => {
  Especie.query()
    .withGraphFetched("Vacunas")
    .then((EspeciesVacunas) => {
      res.EspeciesVacunas = EspeciesVacunas;
      next();
    });
};

const getAllSalud = (req, res, next) => {
  Salud.query().then((SaludStatus) => {
    res.SaludStatus = SaludStatus;
    next();
  });
};

const getAllCastrado = (req, res, next) => {
  Castrado.query().then((CastradoStatus) => {
    res.CastradoStatus = CastradoStatus;
    next();
  });
};

const getAllTamano = (req, res, next) => {
  Tamano.query().then((Tamanos) => {
    res.Tamanos = Tamanos;
    next();
  });
};

const getProtocolosFromUsuario = (req, res, next) => {
  req.session.IdSession = 2;
  if (req.session.IdSession) {
    // console.log("ProtocolosUsuario");
    Usuario.query()
      .withGraphJoined("Protocolos")
      .where("Protocolos.ID_Usuario", "=", req.session.IdSession)
      .orWhere("Protocolos.ID_Usuario", "=", 1)
      .then((ProtocolosUsuario) => {
        console.log(ProtocolosUsuario.length);
        if (ProtocolosUsuario.length > 0) {
          res.ProtocolosUsuario = ProtocolosUsuario;
          next();
        }
      })
      .catch((err) => console.log(err));
  }
};

exports.crearPublicacion = [
  // (req, res, next) => {
  //   Publicacion.query()
  //     .withGraphFetched(
  //       "Mascota.[MascotasCastrado,MascotasSalud,MascotasTamano,MascotasEspecie,MascotasEstado,MascotasVacunas,MascotasImagenes]"
  //     )
  //     .then((response) => res.json(response));
  // },
  getAllEspecieWithVacuna,
  getAllSalud,
  getAllCastrado,
  getAllTamano,
  getProtocolosFromUsuario,
  getMascotaTemplate,
  (req, res, next) =>
    res.render("Publicacion/crearPublicacion", {
      mascotaTemplate: res.htmlTemplate,
      responseData: {
        EspeciesVacunas: res.EspeciesVacunas,
        SaludStatus: res.SaludStatus,
        CastradoStatus: res.CastradoStatus,
        Tamanos: res.Tamanos,
        ProtocolosUsuario: res.ProtocolosUsuario,
      },
    }),
];

exports.crearPublicacionGuardar = [
  fetchInput(acceptedTypes, "./public/images/ImagenesMascotas"),
  check("Titulo")
    .isLength({ min: 10, max: 50 })
    .withMessage("El título debe tener entre 10 y 50 caracteres"),
  check("Descripcion")
    .isLength({ min: 20, max: 255 })
    .withMessage("La descripción debe de tener entre 20 y 255 caracteres"),
  check("Mascota.*.Nombre")
    .isLength({ min: 1 })
    .withMessage("El nombre es un campo obligatorio"),
  check("Mascota.*.Edad")
    .isInt()
    .withMessage("La edad tiene que ser un numero"),
  check("Mascota.*.Descripcion")
    .isLength({ min: 20, max: 255 })
    .withMessage("La descripción debe de tener entre 20 y 255 caracteres"),
  check("Mascota.*.MascotasMetas.*.Descripcion")
    .isLength({ min: 20, max: 255 })
    .withMessage("La descripción debe de tener entre 20 y 255 caracteres"),
  check("Mascota.*.MascotasMetas.*.Cantidad")
    .isInt({ min: 100 })
    .withMessage("La cantidad de la meta debe de ser por lo menos de 100 mxn"),
  validateBody,
  // (req, res, next) => {
  //   var validationResult = validationResult(req).array({
  //     onlyFirstError: true,
  //   });
  //   if (validationResult.length > 0) {
  //     var errorObject = new ValidationError(validationResult);
  //     validationResult.forEach((error) => {
  //       var ID_Error = _.get(req.body, error.param + "ID");
  //       resulta.errors.push({ ID: ID_Error, msg: error.msg });
  //     });
  //     return next(resulta);
  //   }
  //   next();
  // },
  (req, res, next) => {
    cleanInputID(req.body);

    // console.log(req.body.Mascota[0].MascotasVacunas);
    // req.body.Activo = 1;
    // req.body.Reportes_Peso = 0;
    // req.body.ID_Usuario = req.IdSession;
    // for (let index = 0; index < req.body.Mascota.length; index++) {
    //   const mascota = req.body.Mascota[index];
    //   for (const key in req.body) {
    //     if (Object.hasOwnProperty.call(req.body, key)) {
    //       const prop = req.body[key];
    //       const numMascota = key.split("-")[0];
    //       if (numMascota == index) {
    //         ruta = prop.replace(/public/g, "");
    //         mascota.MascotasImagenes.push({ Ruta: ruta });
    //         delete req.body[key];
    //       }
    //     }
    //   }
    //   console.log(mascota);
    // }
    // Publicacion.query()
    //   .insertGraph(req.body)
    //   .then((response) => uploadFiles(res));
  },
];

exports.checkImage = [
  fetchInput(acceptedTypes, "./public/images/ImagenesMascotas"),
  (req, res, next) => {
    if (res.fileReadableStream) {
      var min = 450,
        max = 1600;
      probe(res.fileReadableStream[0].stream).then((data) => {
        if (
          data.width < min ||
          data.height < min ||
          data.width > max ||
          data.height > max
        ) {
          res.json({
            warning: `<p>Las imagenes deben de tener una resolución:</p> <p>Mínima de ${min}px por ${min}px <p>Máxima de ${max}px por ${max}px</p>`,
          });
        } else {
          res.json({ correct: "ok" });
        }
        console.log(data);
      });
    }
  },
];
