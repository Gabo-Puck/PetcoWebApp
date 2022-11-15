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
const Protocolo = require("../models/Protocolo");
const Paso = require("../models/Paso");
const Pasos_Mascota = require("../models/Pasos_Mascota");

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
  Usuario.query()
    .findById(req.session.IdSession)
    .then((UsuarioFind) => {
      res.render(
        "Publicacion/mascotaTemplate",
        {
          AceptaDonaciones: UsuarioFind.AceptaDonaciones,
          Tipo: req.session.Tipo,
        },
        (error, html) => {
          if (error) {
            next(error);
          } else {
            res.htmlTemplate = html.replace(/\r?\n|\r/g, " ");
            next();
          }
        }
      );
    })
    .catch((err) => {
      console.log(err);
      next(err);
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
      Tipo: req.session.Tipo,
    }),
];

exports.crearPublicacionGuardar = [
  fetchInput(acceptedTypes, "images/ImagenesMascotas"),
  check("Titulo")
    .isLength({ min: 10, max: 50 })
    .withMessage("El título debe tener entre 10 y 50 caracteres"),
  check("Descripcion")
    .isLength({ min: 20, max: 255 })
    .withMessage("La descripción debe de tener entre 20 y 255 caracteres"),
  check("Mascota.*.Nombre")
    .isLength({ min: 5, max: 20 })
    .withMessage("El nombre debe de tener entre 5 y 20 caracteres"),
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

    console.log(req.body.Mascota[0].MascotasVacunas);
    req.body.Activo = 1;
    req.body.Reportes_Peso = 0;
    req.body.ID_Usuario = req.session.IdSession;
    let protocolos = [];
    let dateNow = new Date(Date.now());
    let date = dateNow.toLocaleDateString("es-MX");
    let time = dateNow.toLocaleTimeString("es-MX");
    let date2 = date.split("/");
    let time2 = time.split(":");
    var dateFormatted = new Date(
      date2[2],
      date2[1] - 1,
      date2[0],
      time2[0],
      time2[1],
      time2[2]
    );
    var dateGeneracion =
      dateFormatted.getFullYear() +
      "-" +
      (dateFormatted.getMonth() + 1) +
      "-" +
      dateFormatted.getDate();
    var timeGeneracion =
      dateFormatted.getHours() +
      ":" +
      dateFormatted.getMinutes() +
      ":" +
      dateFormatted.getSeconds();
    var Fecha_Generacion = dateGeneracion + " " + timeGeneracion;
    for (let index = 0; index < req.body.Mascota.length; index++) {
      const mascota = req.body.Mascota[index];
      req.body.Mascota[index].Fecha_Ultima_Solicitud = Fecha_Generacion;
      if (mascota.MascotasMetas.length == 0) {
        delete mascota.MascotasMetas;
      }
      if (mascota.MascotasVacunasThrough.length == 0) {
        delete mascota.MascotasVacunasThrough;
      }
      protocolos.push(mascota.ID_Protocolo);
      delete mascota.ID_Protocolo;
      for (const key in req.body) {
        if (Object.hasOwnProperty.call(req.body, key)) {
          const prop = req.body[key];
          const numMascota = key.split("-")[0];
          if (numMascota == index) {
            ruta = prop.replace(/public/g, "");
            ruta = ruta.replaceAll("\\", "/");
            mascota.MascotasImagenes.push({ Ruta: ruta });
            delete req.body[key];
          }
        }
      }
      console.log(mascota);
    }

    Publicacion.query()
      .insertGraphAndFetch(req.body)
      .then((response) => {
        // return new Promise((resolve, reject) => {
        //   Protocolo.query().withGraphJoined("Pasos").findById(ID_Protocolo).then((Pasos) => {

        //   })
        // });
        return new Promise((resolve, reject) => {
          resolve(
            createArrayPromisesPasosMascota(response.Mascota, protocolos)
          );
        });

        // console.log(response);
      })
      .then((promises) => Promise.all(promises))
      .then(() => Promise.all(uploadFiles(res, req.app.storageFirebase)))
      .then(() => res.json("ok"))
      .catch((err) => {
        console.log(err);
        res.json({
          globalError: "<p>Algo ha salido mal</p><p>Intentalo más tarde</p>",
        });
      });
  },
];

function createArrayPromisesPasosMascota(Mascotas, Protocolos) {
  let arrayProm = [];
  for (let index = 0; index < Mascotas.length; index++) {
    const element = Mascotas[index];
    let prom = createPromisesPasosMascota(
      Mascotas[index].ID,
      Protocolos[index]
    );
    arrayProm.push(prom);
  }
  return arrayProm;
}

function createPromisesPasosMascota(ID_Mascota, ID_Protocolo) {
  return new Promise((resolve, reject) => {
    Paso.query()
      // .withGraphJoined("Pasos")
      .where("ID_Protocolo", "=", 1)
      .orWhere("ID_Protocolo", "=", ID_Protocolo)
      .then((Pasos) => {
        if (ID_Protocolo == 1) {
          resolve(Pasos);
        } else {
          let PasosID = [];
          // console.log(Pasos[0]);
          PasosID.push(Pasos[0]);
          // console.log(Pasos[1]);
          PasosID.push(Pasos[1]);
          for (let index = 4; index < Pasos.length; index++) {
            const element = Pasos[index];
            console.log(element);
            PasosID.push(Pasos[index]);
          }

          resolve(PasosID);
        }
        // resolve(1);
      });
  }).then((Pasos) => {
    let PasosMascotaInsert = [];
    for (let index = 0; index < Pasos.length; index++) {
      const element = Pasos[index];
      if (index == 0) {
        PasosMascotaInsert.push({
          ID_Mascota: ID_Mascota,
          ID_Paso: element.ID,
          Completado: 3,
        });
      } else {
        PasosMascotaInsert.push({
          ID_Mascota: ID_Mascota,
          ID_Paso: element.ID,
          Completado: 0,
        });
      }
    }
    Pasos_Mascota.query()
      .insertGraph(PasosMascotaInsert)
      .then((res) => console.log("done"));
  });
}

exports.checkImage = [
  fetchInput(acceptedTypes, "./public/images/ImagenesMascotas"),
  (req, res, next) => {
    if (res.fileReadableStream) {
      var min = 10,
        max = 8000;
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
