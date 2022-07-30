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
