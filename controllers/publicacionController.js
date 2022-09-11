var Mascota = require("../models/Mascota");
var { fetchInput } = require("../utils/multipartRequestHandle/index");
var probe = require("probe-image-size");
const Especie = require("../models/Especie");
const Salud = require("../models/Salud");
const Castrado = require("../models/Castrado");
const Usuario = require("../models/Usuario");
const Tamano = require("../models/Tamano");

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
  req.session.IdSession;
  if (req.session.IdSession) {
    console.log("ProtocolosUsuario");
    Usuario.query()
      .withGraphFetched("Protocolos")
      .findById(req.session.IdSession)
      .then((ProtocolosUsuario) => {
        if (ProtocolosUsuario.length > 0) {
          res.ProtocolosUsuario = ProtocolosUsuario;
          next();
        }
      })
      .catch((err) => console.log(err));
  }
};

exports.crearPublicacion = [
  getAllEspecieWithVacuna,
  getAllSalud,
  getAllCastrado,
  getAllTamano,
  getProtocolosFromUsuario,
  getMascotaTemplate,
  (req, res, next) =>
    res.render("Publicacion/crearPublicacion", {
      mascotaTemplate: res.htmlTemplate,
      EspeciesVacunas: res.EspeciesVacunas,
      SaludStatus: res.SaludStatus,
      CastradoStatus: res.CastradoStatus,
      Tamanos: res.Tamanos,
      ProtocolosUsuario: res.ProtocolosUsuario,
    }),
];

exports.checkImage = [
  fetchInput(acceptedTypes, "./public/imagenesMascotas"),
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
