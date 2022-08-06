var preguntaAbierta = docParsed
  .querySelector(".preguntaAbierta")
  .cloneNode(true);
var preguntaCerrada = docParsed
  .querySelector(".preguntaCerrada")
  .cloneNode(true);
var preguntaMultiple = docParsed
  .querySelector(".preguntaMultiple")
  .cloneNode(true);
var respuestaCerrada = docParsed.querySelector(".respCerr").cloneNode(true);
var respuestaMultiple = docParsed.querySelector(".respMult").cloneNode(true);
var contPregunta = 0;
var contRespuesta = 0;
$(function () {
  // fetch("http://localhost:3000/formulario/preguntaTemplate")
  //   .then((res) => res.text())
  //   .then((html) => {
  //     var parserDOM = new DOMParser();
  //     var doc = parserDOM.parseFromString(html, "text/html");
  //     preguntaAbierta = doc.querySelector(".preguntaAbierta").cloneNode(true);
  //     preguntaCerrada = doc.querySelector(".preguntaCerrada").cloneNode(true);
  //     preguntaMultiple = doc.querySelector(".preguntaMultiple").cloneNode(true);
  //     respuestaCerrada = doc.querySelector(".respCerr").cloneNode(true);
  //     respuestaMultiple = doc.querySelector(".respMult").cloneNode(true);
  //   })
  //   .then(() => {});
});
$(window).on("load", () => {
  renderPreguntas(Formulario);
});
import {
  addPregunta,
  selectParent,
  bindPreguntasConRespuestas,
  bindPreguntas,
  loadingScreen,
  addRespuestaCerrada,
  addRespuestaMultiple,
} from "/javascripts/FormulariosFunctions.js";

// renderPreguntas(Formulario);

function renderPreguntas(Formulario) {
  Formulario.Preguntas.forEach((pregunta) => {
    if (pregunta.Tipo == 1) {
      //Abiertas
      var newPregunta = addPregunta(
        preguntaAbierta,
        document.querySelector("form"),
        contPregunta
      );
      newPregunta.pregunta.querySelector(".preguntaText").value =
        pregunta.Pregunta;
      newPregunta.pregunta.classList.add(`preguntaLoaded${pregunta.ID}`);

      contPregunta = newPregunta.cont;
    }
    if (pregunta.Tipo == 2) {
      //Cerradas
      generatePreguntaConOpciones(
        preguntaCerrada,
        respuestaCerrada,
        pregunta,
        addRespuestaCerrada
      );
    }
    if (pregunta.Tipo == 3) {
      //Multiples
      generatePreguntaConOpciones(
        preguntaMultiple,
        respuestaMultiple,
        pregunta,
        addRespuestaMultiple
      );
    }
  });
}

function generatePreguntaConOpciones(
  preguntaTemplate,
  respuestaTemplate,
  pregunta,
  addRespuesta
) {
  var newPregunta = addPregunta(
    preguntaTemplate,
    document.querySelector("form"),
    contPregunta
  );
  newPregunta.pregunta.querySelector(".preguntaText").value = pregunta.Pregunta;
  newPregunta.pregunta.classList.add(`preguntaLoaded${pregunta.ID}`);
  contPregunta = newPregunta.cont;
  var button = newPregunta.pregunta.querySelector(".agregarRespuesta");
  button.addEventListener("click", () => {
    contRespuesta = addRespuesta(button, contRespuesta, respuestaMultiple);
  });
  pregunta.Opciones_Respuestas_Pregunta.forEach((respuesta) => {
    contRespuesta = addRespuesta(
      newPregunta.pregunta.querySelector(".agregarRespuesta"),
      contRespuesta,
      respuestaTemplate,
      respuesta.Opcion_Respuesta,
      respuesta.ID
    );
  });
}

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
      "http://localhost:3000/formulario/info",
      document
    );
  });

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
