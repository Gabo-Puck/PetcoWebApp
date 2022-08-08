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
  loadingScreen,
  responseFetch,
  addRespuestaCerrada,
  addRespuestaMultiple,
  renderMessages,
} from "/javascripts/FormulariosFunctions.js";

// renderPreguntas(Formulario);
var preguntasEliminadas = [];
var respuestasEliminadas = [];
function renderPreguntas(Formulario) {
  Formulario.Preguntas.forEach((pregunta) => {
    if (pregunta.Tipo == 1) {
      //Abiertas
      var newPregunta = addPregunta(
        preguntaAbierta,
        document.querySelector("form"),
        contPregunta,
        Formulario,
        preguntasEliminadas,
        respuestasEliminadas
      );
      newPregunta.pregunta.querySelector(".preguntaText").value =
        pregunta.Pregunta;
      newPregunta.pregunta.classList.add(
        "preguntaLoaded",
        `pid-${pregunta.ID}`
      );
      if (pregunta.Opcional == 1) {
        newPregunta.pregunta.querySelector(".opcionalMb").checked = true;
        newPregunta.pregunta.querySelector(".opcionalLg").checked = true;
      } else {
        newPregunta.pregunta.querySelector(".opcionalLg").checked = false;
        newPregunta.pregunta.querySelector(".opcionalMb").checked = false;
      }
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
    contPregunta,
    Formulario,
    preguntasEliminadas,
    respuestasEliminadas
  );
  newPregunta.pregunta.querySelector(".preguntaText").value = pregunta.Pregunta;
  if (pregunta.Opcional == 1) {
    newPregunta.pregunta.querySelector(".opcionalMb").checked = true;
    newPregunta.pregunta.querySelector(".opcionalLg").checked = true;
  } else {
    newPregunta.pregunta.querySelector(".opcionalLg").checked = false;
    newPregunta.pregunta.querySelector(".opcionalMb").checked = false;
  }
  newPregunta.pregunta.classList.add("preguntaLoaded", `pid-${pregunta.ID}`);
  contPregunta = newPregunta.cont;
  var button = newPregunta.pregunta.querySelector(".agregarRespuesta");
  button.addEventListener("click", () => {
    contRespuesta = addRespuesta(button, contRespuesta, respuestaTemplate);
  });
  pregunta.Opciones_Respuestas_Pregunta.forEach((respuesta) => {
    contRespuesta = addRespuesta(
      newPregunta.pregunta.querySelector(".agregarRespuesta"),
      contRespuesta,
      respuestaTemplate,
      respuesta.Opcion_Respuesta,
      respuesta.ID,
      pregunta,
      respuestasEliminadas
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
      "http://localhost:3000/petco/formulario/info",
      document,
      "http://localhost:3000/petco/formulario/editar"
    );
  });

buttonAddPreguntaAbierta.addEventListener("click", (e) => {
  var response = addPregunta(
    preguntaAbierta,
    document.querySelector("form"),
    contPregunta
  );
  contPregunta = response.cont;
  response.pregunta.classList.add("newPregunta");
});
buttonAddPreguntaCerrada.addEventListener("click", (e) => {
  var response = addPregunta(
    preguntaCerrada,
    document.querySelector("form"),
    contPregunta
  );
  contPregunta = response.cont;
  response.pregunta.classList.add("newPregunta");
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
  response.pregunta.classList.add("newPregunta");

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

function bindPreguntas(
  preguntasAbiertas,
  preguntasCerradas,
  preguntasMultiples,
  url,
  document,
  urlUpdate
) {
  // var preguntasAbiertas = document.querySelectorAll(".preguntaAbierta");
  // var preguntasCerradas = document.querySelectorAll(".preguntaCerrada");
  // var preguntasMultiples = document.querySelectorAll(".preguntaMultiple");
  var error = [];
  var titulo = document.querySelector("#titulo");
  loadingScreen.fire();
  var preguntasAbiertasFetch = [];
  preguntasAbiertas.forEach((pregunta) => {
    var preguntaText = pregunta.querySelector(".preguntaText").value;
    var id = pregunta.id;

    var tipo = 1;
    var opcional;
    if (screen.width <= 575) {
      opcional = pregunta.querySelector(".opcionalMb").checked;
      console.log(opcional);
    } else {
      opcional = pregunta.querySelector(".opcionalLg").checked;
    }
    preguntasAbiertasFetch.push({
      preguntaText: preguntaText,
      tipo: tipo,
      opcional: opcional,
      formID: id,
    });
  });
  console.log(preguntasAbiertasFetch);
  var preguntasCerradasFetch = [];
  bindPreguntasConRespuestas(preguntasCerradasFetch, preguntasCerradas, 2);
  var preguntasMultiplesFetch = [];
  bindPreguntasConRespuestas(preguntasMultiplesFetch, preguntasMultiples, 3);
  var preguntasFetched = {
    titulo: { tituloText: titulo.value, formID: titulo.id },
    abiertas: preguntasAbiertasFetch,
    cerradas: preguntasCerradasFetch,
    multiples: preguntasMultiplesFetch,
  };

  console.log(JSON.stringify(preguntasFetched));
  var xhr = new XMLHttpRequest();

  const header = new Headers();
  setTimeout(() => {
    var response = fetch("http://localhost:3000/petco/formulario/verify", {
      method: "POST",
      body: JSON.stringify(preguntasFetched),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => renderMessages(res, document))
      .then((res) => fetchPreguntas(preguntasFetched, res, Formulario))
      .then((res) => responseFetch(res.response, res, urlUpdate))
      .then((res) => res.json())
      .then((res) => {
        if (res.response == "ok") {
          loadingScreen.close();
          Swal.fire({
            title: "Listo!",
            text: `Se ha guardado de manera exitosa tu formulario: '${titulo.value}'`,
            icon: "success",
            confirmButtonText: "Siguiente",
          }).then((sweetResult) => {
            if (sweetResult.isConfirmed) {
              window.location = url;
            }
          });
        }
      })
      .catch((reason) => console.log(reason));
  }, 1300);
}

function fetchPreguntas(preguntasFetched, res) {
  console.log("ayuda");
  // console.log(FormularioBodyChanged);
  return new Promise(function (resolve, reject) {
    if (res == "ok") {
      var contenidoEliminado = {
        preguntas: preguntasEliminadas,
        respuestas: respuestasEliminadas,
      };

      var preguntasAbiertas = document.querySelectorAll(
        ".preguntaAbierta.newPregunta"
      );
      var preguntasCerradas = document.querySelectorAll(
        ".preguntaCerrada.newPregunta"
      );
      var preguntasMultiples = document.querySelectorAll(
        ".preguntaMultiple.newPregunta"
      );
      var preguntasAbiertasArray = [];
      var preguntasCerradasArray = [];
      var preguntasMultiplesArray = [];
      preguntasAbiertas.forEach((pregunta) => {
        var preguntaText = pregunta.querySelector(".preguntaText").value;
        var id = pregunta.id;

        var tipo = 1;
        var opcional;
        if (screen.width <= 575) {
          opcional = pregunta.querySelector(".opcionalMb").checked;
          console.log(opcional);
        } else {
          opcional = pregunta.querySelector(".opcionalLg").checked;
        }
        preguntasAbiertasArray.push({
          preguntaText: preguntaText,
          tipo: tipo,
          opcional: opcional,
          formID: id,
        });
      });

      bindPreguntasConRespuestas(preguntasCerradasArray, preguntasCerradas, 2);
      bindPreguntasConRespuestas(
        preguntasMultiplesArray,
        preguntasMultiples,
        3
      );

      var preguntas = document.querySelectorAll(".preguntaLoaded");
      var preguntasMod = [];
      var respuestasMod = [];
      var respuestasAdd = [];
      var FormularioBodyChanged = Formulario.Preguntas.map(
        (preguntaFormulario) => {
          preguntas.forEach((pregunta) => {
            pregunta.classList.forEach((classElement) => {
              if (classElement.split("-", 2)[0] == "pid") {
                if (classElement.split("-", 2)[1] == preguntaFormulario.ID) {
                  var modPregunta =
                    pregunta.querySelector(".preguntaText").value;
                  var opcional;
                  if (screen.width <= 575) {
                    opcional = pregunta.querySelector(".opcionalMb").checked;
                  } else {
                    opcional = pregunta.querySelector(".opcionalLg").checked;
                  }
                  var returnValue = {};
                  pregunta
                    .querySelectorAll(".respuesta")
                    .forEach((respuesta) => {
                      respuesta.classList.forEach((classRespuesta) => {
                        if (classRespuesta.split("-", 2)[0] == "rid") {
                          preguntaFormulario.Opciones_Respuestas_Pregunta.forEach(
                            (opcion) => {
                              if (
                                classRespuesta.split("-", 2)[1] == opcion.ID
                              ) {
                                var modRespuesta =
                                  respuesta.querySelector("textarea").value;
                                var ID = opcion.ID;
                                var ID_Pregunta = preguntaFormulario.ID;
                                var respuestaValue = {};
                                respuestaValue["ID"] = ID;
                                respuestaValue["ID_Pregunta"] = ID_Pregunta;
                                respuestaValue["Opcion_Respuesta"] =
                                  modRespuesta;
                                respuestasMod.push(respuestaValue);
                              }
                            }
                          );
                        }
                        if (classRespuesta == "newRespuesta") {
                          var respuestaText =
                            respuesta.querySelector("textarea").value;
                          var respuesta_ID_Pregunta = preguntaFormulario.ID;
                          respuestasAdd.push({
                            ID_Pregunta: respuesta_ID_Pregunta,
                            Opcion_Respuesta: respuestaText,
                          });
                        }
                      });
                    });
                  var id = preguntaFormulario.ID;
                  returnValue["Pregunta"] = modPregunta;
                  returnValue["Opcional"] = opcional;
                  returnValue["ID"] = id;
                  preguntasMod.push(returnValue);
                  // return returnValue;
                }
              }
            });
          });
        }
      );
      var preguntasAgregadas = {};
      preguntasAgregadas["abiertas"] = preguntasAbiertasArray;
      preguntasAgregadas["cerradas"] = preguntasCerradasArray;
      preguntasAgregadas["multiples"] = preguntasMultiplesArray;

      var contenidoCambiado = {};
      contenidoCambiado["preguntas"] = preguntasMod;
      contenidoCambiado["respuestas"] = respuestasMod;

      var contenidoAgregado = {};
      contenidoAgregado["preguntas"] = preguntasAgregadas;
      contenidoAgregado["respuestas"] = respuestasAdd;

      var resolveValue = {};
      resolveValue["contenidoCambiado"] = contenidoCambiado;
      resolveValue["contenidoEliminado"] = contenidoEliminado;
      // preguntasFetched["respuestasAgregadas"] = respuestasAdd;
      resolveValue["contenidoAgregado"] = contenidoAgregado;
      resolveValue["response"] = "ok";
      resolveValue["titulo"] = preguntasFetched.titulo;
      resolveValue["ID"] = Formulario.ID;
      resolveValue["ID_Usuario"] = Formulario.ID_Usuario;
      console.log(preguntasFetched);
      resolve(resolveValue);
    } else {
      resolve("not");
    }
  });
}
