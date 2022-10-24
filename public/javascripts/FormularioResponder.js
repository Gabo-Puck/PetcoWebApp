// const { addMessageFeedback } = require("./FormulariosFunctions");

// const { insertAfter, retrieveParent } = import("./FormulariosFunctions");
import {
  insertAfter,
  retrieveParent,
} from "/javascripts/FormulariosFunctions.js";
const respuestaMultiple = docParsed
  .querySelector(".respuestaMultiple")
  .cloneNode(true);
const respuestaCerrada = docParsed
  .querySelector(".respuestaCerrada")
  .cloneNode(true);
const respuestaAbierta = docParsed
  .querySelector(".respuestaAbierta")
  .cloneNode(true);
const preguntaTemplate = docParsed.querySelector(".pregunta").cloneNode(true);

var loadingScreen = Swal.mixin({
  title: "Espera...!",
  html: ":)",
  loaderHtml: '<div class="spinner-border text-primary"></div>',
  allowOutsideClick: false,
  customClass: {
    loader: "custom-loader",
  },
  loaderHtml:
    '<div class="spinner-grow text-primary" role="status"><span class="sr-only">Loading...</span></div>',
  didOpen: () => {
    loadingScreen.showLoading();
  },
});

function handleResponse(res) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (res == "ok") {
        resolve();
      } else {
        reject(res);
      }
    }, 1000);
  });
}
function eraseMssageFeedback(document) {
  document.querySelectorAll("input").forEach((element) => {
    element.classList.remove("is-invalid");
    element.classList.remove("is-valid");
  });
  document.querySelectorAll("textarea").forEach((element) => {
    element.classList.remove("is-invalid");
    element.classList.remove("is-valid");
  });
  document
    .querySelectorAll(".invalid-feedback")
    .forEach((element) => element.remove());
  document
    .querySelectorAll(".valid-feedback")
    .forEach((element) => element.remove());
}
function addMessageFeedback(
  text,
  inputForm,
  classInputForm,
  feedbackBoxClass,
  document
) {
  var feedbackBox = document.createElement("div");
  feedbackBox.classList.add(feedbackBoxClass, "d-block");
  feedbackBox.innerText = text;
  var parent = retrieveParent(inputForm, "pregunta");
  var preguntaText = parent.querySelector(".lead");
  insertAfter(preguntaText, feedbackBox);
}

function renderMessages(messages) {
  eraseMssageFeedback(document);
  messages.forEach((message) => {
    var inputElement = document.querySelector(
      `input[name='${message.value.nameForm}']`
    );
    if (inputElement == null) {
      inputElement = document.querySelector(
        `textarea[name='${message.value.nameForm}']`
      );
    }
    var parent = retrieveParent(inputElement, "pregunta");
    parent.classList.add("mb-0");
    if (message.value.msg) {
      addMessageFeedback(
        message.value.msg,
        // document.getElementsByName(message.value.nameForm),
        inputElement,
        "is-valid",
        "valid-feedback",
        document
      );
    }
    if (message.value.error) {
      addMessageFeedback(
        message.value.error,
        // document.getElementsByName(message.value.nameForm),
        inputElement,
        "is-invalid",
        "invalid-feedback",
        document
      );
    }
  });
  loadingScreen.close();
}

const guardarButton = document
  .querySelector(".guardarButton")
  .addEventListener("click", () => {
    loadingScreen.fire();
    var bodyFetch = fetchRespuestas(document);
    fetch("/petco/formulario/responderFormulario", {
      method: "POST",
      body: JSON.stringify(bodyFetch),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => handleResponse(res))
      .then(
        () => {
          Swal.fire({
            title: "Listo!",
            text: `Se han guardado tus respuestas!'`,
            icon: "success",
            confirmButtonText: "Siguiente",
          }).then((sweetResult) => {
            if (sweetResult.isConfirmed) {
              window.location = "google.com";
            }
          });
        },
        (res) => {
          renderMessages(res);
        }
      );
  });
function fetchRespuestas(document) {
  var respuestas = document.querySelectorAll(".respuesta");
  var bodyFetchOpciones = {};
  var bodyFetchAbiertas = [];

  respuestas.forEach((respuestaDOM) => {
    if (
      respuestaDOM.classList.contains("respuestaMultiple") ||
      respuestaDOM.classList.contains("respuestaCerrada")
    ) {
      var respuestaInputCheck = respuestaDOM.querySelector("input");
      var respuestaInputLabel = respuestaDOM.querySelector("label");
      var response = {}; //name es el id de la pregunta, id es el id de la respuesta
      response.ID_Pregunta = respuestaInputCheck.name; //ID de la pregunta
      response.ID = respuestaInputCheck.id;
      response.Opcion_Respuesta = respuestaInputLabel.innerText;
      response.check = respuestaInputCheck.checked;
      if (
        // respuestaInputCheck.checked &&
        respuestaDOM.classList.contains("respuestaCerrada")
      ) {
        response.Tipo = 2;
        if (bodyFetchOpciones[`${response.ID_Pregunta}`]) {
          bodyFetchOpciones[`${response.ID_Pregunta}`].push(response);
        } else {
          bodyFetchOpciones[`${response.ID_Pregunta}`] = [];
          bodyFetchOpciones[`${response.ID_Pregunta}`].push(response);
        }
        // bodyFetchOpciones.push({ respuestasOpciones: response });
      }
      if (
        // respuestaInputCheck.checked &&
        respuestaDOM.classList.contains("respuestaMultiple")
      ) {
        response.Tipo = 3;
        // bodyFetchOpciones.push({ respuestasOpciones: response });
        if (bodyFetchOpciones[`${response.ID_Pregunta}`]) {
          bodyFetchOpciones[`${response.ID_Pregunta}`].push(response);
        } else {
          bodyFetchOpciones[`${response.ID_Pregunta}`] = [];
          bodyFetchOpciones[`${response.ID_Pregunta}`].push(response);
        }
      }
    }

    if (respuestaDOM.classList.contains("respuestaAbierta")) {
      var idPregunta = respuestaDOM.querySelector("textarea").name;
      var respuesta = respuestaDOM.querySelector("textarea").value;
      bodyFetchAbiertas.push({ Respuesta: respuesta, ID_Pregunta: idPregunta });
    }
  });
  var body = {
    bodyFetchAbiertas: bodyFetchAbiertas,
    bodyFetchOpciones: bodyFetchOpciones,
    FormularioID: Formulario.ID,
    MascotaID: Mascota,
  };
  console.log(body);
  return body;
}

function addPreguntasForm() {
  var form = document.querySelector("form");
  Formulario.Preguntas.forEach((pregunta) => {
    var newPregunta = preguntaTemplate.cloneNode(true);
    newPregunta.querySelector("b").innerText = pregunta.Pregunta;
    if (pregunta.Tipo == 1) {
      renderPreguntasAbiertasForm(pregunta, newPregunta);
    }
    if (pregunta.Tipo == 2) {
      renderPreguntasOpcionForm(pregunta, newPregunta, respuestaCerrada);
    }
    if (pregunta.Tipo == 3) {
      renderPreguntasOpcionForm(pregunta, newPregunta, respuestaMultiple);
    }
    form.appendChild(newPregunta);
  });
}

var respCont = 0;

$(window).on("load", () => {
  addPreguntasForm();
});

function renderPreguntasAbiertasForm(preguntaFormulario, preguntaDOM) {
  var respuesta = respuestaAbierta.cloneNode("true");
  respuesta.querySelector("textarea").name = preguntaFormulario.ID;
  respuesta.querySelector("textarea").classList.add("pe-2");
  preguntaDOM.appendChild(respuesta);
}
function renderPreguntasOpcionForm(
  preguntaFormulario,
  preguntaDOM,
  respuestaTemplate
) {
  preguntaFormulario.Opciones_Respuestas_Pregunta.forEach((opcion) => {
    var newRespuesta = respuestaTemplate.cloneNode(true);
    newRespuesta.querySelector("label").innerText = opcion.Opcion_Respuesta;
    newRespuesta.querySelector("input").name = preguntaFormulario.ID;
    newRespuesta.querySelector("input").id = opcion.ID;
    newRespuesta.querySelector("label").htmlFor = opcion.ID;
    newRespuesta.classList.add("ps-2");
    respCont++;
    preguntaDOM.appendChild(newRespuesta);
  });
}
