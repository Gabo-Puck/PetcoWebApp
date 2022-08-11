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
  respuesta.querySelector("textarea").id = preguntaFormulario.ID;
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
    newRespuesta.querySelector("input").id = respCont;
    newRespuesta.querySelector("label").htmlFor = respCont;
    newRespuesta.classList.add("ps-2");
    respCont++;
    preguntaDOM.appendChild(newRespuesta);
  });
}
