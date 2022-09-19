var preguntaAbierta;
var preguntaCerrada;
var preguntaMultiple;
var respuestaCerrada;
var respuestaMultiple;

import {
  addPregunta,
  selectParent,
  bindPreguntasConRespuestas,
  bindPreguntas,
  loadingScreen,
  addRespuestaCerrada,
  addRespuestaMultiple,
} from "/javascripts/FormulariosFunctions.js";

$(function () {
  fetch("http://localhost:3000/petco/formulario/preguntaTemplate")
    .then((res) => res.text())
    .then((html) => {
      var parserDOM = new DOMParser();
      var doc = parserDOM.parseFromString(html, "text/html");
      preguntaAbierta = doc.querySelector(".preguntaAbierta").cloneNode(true);
      preguntaCerrada = doc.querySelector(".preguntaCerrada").cloneNode(true);
      preguntaMultiple = doc.querySelector(".preguntaMultiple").cloneNode(true);
      respuestaCerrada = doc.querySelector(".respCerr").cloneNode(true);
      respuestaMultiple = doc.querySelector(".respMult").cloneNode(true);
    });
});

const buttonAddPreguntaCerrada = document.querySelector(
  ".agregarPreguntaCerrada"
);
const buttonAddPreguntaAbierta = document.querySelector(
  ".agregarPreguntaAbierta"
);
const buttonAddPreguntaMultiple = document.querySelector(
  ".agregarPreguntaMultiple"
);

const guardarButton = document
  .querySelector(".guardarButton")
  .addEventListener("click", (e) => {
    bindPreguntas(
      document.querySelectorAll(".preguntaAbierta"),
      document.querySelectorAll(".preguntaCerrada"),
      document.querySelectorAll(".preguntaMultiple"),
      "/petco/dashboard",
      document,
      "/petco/formulario/crear"
    );
  });
var contPregunta = 0;
var contRespuesta = 0;
buttonAddPreguntaAbierta.addEventListener("click", (e) => {
  var response = addPregunta(
    preguntaAbierta,
    document.querySelector("form"),
    contPregunta
  );
  contPregunta = response.cont;
});
buttonAddPreguntaCerrada.addEventListener("click", (e) => {
  var response = addPregunta(
    preguntaCerrada,
    document.querySelector("form"),
    contPregunta
  );
  contPregunta = response.cont;
  var button = response.pregunta.querySelector(".agregarRespuesta");
  button.addEventListener(
    "click",
    () =>
      (contRespuesta = addRespuestaCerrada(
        button,
        contRespuesta,
        respuestaCerrada
      ))
  );
});
buttonAddPreguntaMultiple.addEventListener("click", (e) => {
  var response = addPregunta(
    preguntaMultiple,
    document.querySelector("form"),
    contPregunta
  );
  contPregunta = response.cont;
  var button = response.pregunta.querySelector(".agregarRespuesta");
  button.addEventListener(
    "click",
    () =>
      (contRespuesta = addRespuestaMultiple(
        button,
        contRespuesta,
        respuestaMultiple
      ))
  );
});
