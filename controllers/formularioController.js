var Usuario = require("../models/Usuario");
var Formulario = require("../models/Formulario");
var Preguntas = require("../models/Preguntas");
var Opciones = require("../models/Opciones_Respuestas_Preguntas");
var Solicitud = require("../models/Solicitudes");
const Solicitudes = require("../models/Solicitudes");

exports.formularioList = (req, res) => {
  Usuario.query()
    .withGraphJoined("Formularios")
    .then((Formulario) => res.json(Formulario));
};

exports.formularioPreguntas = (req, res) => {
  Formulario.query()
    .withGraphJoined("Preguntas.[Opciones_Respuestas_Pregunta,Respuestas]")
    .then((FormWPreguntas) => res.json(FormWPreguntas));
};

exports.preguntasOpciones = (req, res) => {
  Opciones.query()
    .withGraphJoined("Pregunta")
    .then((OpcionesPregunta) => res.json(OpcionesPregunta));
};

exports.crearFormulario = (req, res) => {
  res.render("Formulario/CrearFormulario");
};

exports.verSolicitud = (req, res) => {
  // Solicitud.query()
  //   .withGraphJoined("RespuestasFormulario.[Pregunta]")
  //   .then((Solicitudes) => res.json(Solicitudes));

  // Formulario.query()
  //   .withGraphJoined("Preguntas.[Respuestas]")
  //   .where("Preguntas:Respuestas.ID_Solicitud", "=", 2)
  //   .then((resultado) => res.json(resultado));
  Usuario.query()
    .withGraphJoined("Solicitudes")
    .then((Sol) => res.json(Sol));
};

exports.verifyFormulario = (req, res) => {
  console.log(req.body);
  var errors = [];
  var correct = [];

  if (req.body.titulo.tituloText.replace(/ /g, "").length < 6) {
    errors.push({
      formID: req.body.titulo.formID,
      msg: "El titulo debe tener por lo menos 6 caracteres",
    });
  } else {
    correct.push({ formID: req.body.titulo.formID, msg: "Bien!" });
  }

  req.body.abiertas.forEach((pregunta) => {
    console.log(pregunta.preguntaText.replace(/ /g, ""));
    if (pregunta.preguntaText.replace(/ /g, "").length <= 7) {
      errors.push({
        formID: pregunta.formID,
        msg: "La pregunta debe tener por lo menos 7 caracteres",
      });
    } else {
      correct.push({ formID: pregunta.formID, msg: "Bien!" });
    }
  });
  validateCerradaMultiple(req.body.cerradas, errors, correct);
  validateCerradaMultiple(req.body.multiples, errors, correct);
  res.json({ errors: errors, correct: correct });
};

exports.formulario_crear_post = (req, res) => {};

function validateCerradaMultiple(preguntas, errors, correct) {
  preguntas.forEach((pregunta) => {
    console.log(pregunta.preguntaText.replace(/ /g, ""));
    var error = "";
    if (pregunta.preguntaText.replace(/ /g, "") <= 7) {
      error = "La pregunta debe tener por lo menos 7 caraceteres";
    }
    if (pregunta.respuestas.length <= 1) {
      error += "\nLa pregunta debe de tener por lo menos dos respuestas";
    }
    pregunta.respuestas.forEach((respuesta) => {
      console.log(respuesta.respuestaText.length);
      if (respuesta.respuestaText.replace(/ /g, "").length < 2) {
        errors.push({
          formID: respuesta.formID,
          msg: "La respuesta debe tener por lo menos 2 caracteres",
        });
      } else {
        correct.push({ formID: respuesta.formID, msg: "Bien!" });
      }
    });
    if (error == "") {
      correct.push({ formID: pregunta.formID, msg: "Bien!" });
    } else {
      errors.push({ formID: pregunta.formID, msg: error });
    }
  });
}
