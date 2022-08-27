export function removeItemOnce(arr, value) {
  var index = Array.prototype.indexOf.call(arr, value);
  // var index = arr.indexOf(value);
  if (index > -1) {
    Array.prototype.splice.call(arr, index, 1);
    // arr.splice(index, 1);
  }
  return arr;
}

export function addPregunta(
  preguntaPrototype,
  form,
  contPregunta,
  Formulario = "",
  arrayPregElim = "",
  arrayRespElim = ""
) {
  var newPregunta = preguntaPrototype.cloneNode(true);
  contPregunta = contPregunta + 1;
  newPregunta.id = `preg${contPregunta}`;
  newPregunta.querySelectorAll(".eliminarButton").forEach((button) => {
    button.addEventListener("click", (e) => {
      if (Formulario !== "") {
        var parent = retrieveParent(e.target, "pregContainer");
        // var a = document.querySelector("");
        parent.classList.forEach((classItem) => {
          if (classItem.length >= 3) {
            var aa = "aa";
            var classSlice = classItem.split("-", 2);
            if (classSlice[0] == "pid") {
              Formulario.Preguntas.forEach((Pregunta) => {
                if (Pregunta.ID == classSlice[1]) {
                  arrayPregElim.push(Pregunta);
                  Formulario.Preguntas = removeItemOnce(
                    Formulario.Preguntas,
                    Pregunta
                  );
                }
              });
            }
          }
        });
        parent.classList.contains;
        console.log(arrayPregElim);
      }
      selectParent(e.target, "pregContainer");
    });
  });
  var button = newPregunta.querySelector(".configButton");
  button.addEventListener("click", (e) => {
    displayModal(button);
  });
  if (newPregunta.querySelector(".respuesta")) {
    newPregunta
      .querySelector(".respuesta")
      .querySelector(".eliminarButtonRespuesta")
      .addEventListener("click", (e) => {
        selectParent(e.target, "respuesta");
      });
  }
  form.appendChild(newPregunta);
  return { pregunta: newPregunta, cont: contPregunta };
}
export function selectParent(button, parentNameClass) {
  var parent = button;
  while (true) {
    console.log("tr");
    if (parent.classList.contains(parentNameClass)) {
      parent.remove();
      break;
    }
    parent = parent.parentNode;
  }
}

export function displayModal(button) {
  var myModal2 = button.nextElementSibling;
  var myModal = new bootstrap.Modal(myModal2, {});
  myModal.show();
}

export function bindPreguntasConRespuestas(preguntaBinded, preguntas, tipo) {
  preguntas.forEach((pregunta) => {
    var preguntaText = pregunta.querySelector(".preguntaText").value;
    var id = pregunta.id;
    var opcional;
    if (screen.width <= 575) {
      opcional = pregunta.querySelector(".opcionalMb").checked;
    } else {
      opcional = pregunta.querySelector(".opcionalLg").checked;
    }
    var respuestas = [];
    pregunta.querySelectorAll(".respuesta").forEach((respuesta) => {
      respuestas.push({
        respuestaText: respuesta.querySelector("textarea").value,
        formID: respuesta.querySelector("textarea").parentNode.id,
      });
    });
    preguntaBinded.push({
      preguntaText: preguntaText,
      tipo: tipo,
      opcional: opcional,
      respuestas: respuestas,
      formID: id,
    });
  });
  console.log(preguntaBinded);
}

export function bindPreguntas(
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

  //Post with XHR
  // xhr.open("POST", "http://localhost:3000/formulario/verify", true);
  // xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  // xhr.send(JSON.stringify(preguntasFetched));
  //Post with fetch and promises
  const header = new Headers();
  setTimeout(() => {
    var response = fetch("/petco/formulario/verify", {
      method: "POST",
      body: JSON.stringify(preguntasFetched),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => renderMessages(res, document))
      .then((res) => responseFetch(res, preguntasFetched, urlUpdate))
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
export var loadingScreen = Swal.mixin({
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

export function renderMessages(response, document) {
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

  if (response.errors.length == 0 && response.globalError.length == 0) {
    return "ok";
  } else {
    if (response.correct.length >= 1) {
      response.correct.forEach((correctFeedback) => {
        var newCorrectMessage = document.createElement("div");
        newCorrectMessage.classList.add("valid-feedback", "d-block");
        newCorrectMessage.innerText = correctFeedback.msg;
        addMessageFeedback(
          correctFeedback,
          newCorrectMessage,
          "is-valid",
          document
        );
        if (correctFeedback.formID == "titulo") {
          document.querySelector("#titulo").classList.add("is-valid");
          insertAfter(document.querySelector("#titulo"), newCorrectMessage);
        }
      });
    }
    loadingScreen.close();
    response.errors.forEach((error) => {
      var newErrorMessage = document.createElement("div");
      newErrorMessage.classList.add("invalid-feedback", "d-block");
      newErrorMessage.innerText = error.msg;
      addMessageFeedback(error, newErrorMessage, "is-invalid", document);
      if (error.formID == "titulo") {
        document.querySelector("#titulo").classList.add("is-invalid");
        insertAfter(document.querySelector("#titulo"), newErrorMessage);
      }
    });
    loadingScreen.close();
    if (response.globalError.length >= 1) {
      Swal.fire({
        title: "Atención!",
        text: response.globalError[0],
        icon: "warning",
        confirmButtonText: "Entendido",
      });
    }

    return "not";
  }
}

export function addMessageFeedback(
  response,
  newMessage,
  validationInput,
  document
) {
  if (response.formID.slice(0, 4) == "preg") {
    console.log("es pregunta");
    var element = retrieveParent(
      document.querySelector(`#${response.formID}`),
      "pregContainer"
    ).querySelector(".mobileView");
    document
      .querySelector(`#${response.formID}`)
      .querySelector(".preguntaText")
      .classList.add(`${validationInput}`);
    insertAfter(element, newMessage);
  }
  if (response.formID.slice(0, 4) == "resp") {
    console.log("es respuesta");
    var textarea = document
      .querySelector(`#${response.formID}`)
      .querySelector("textarea");
    textarea.classList.add(`${validationInput}`);
    insertAfter(textarea.nextSibling.nextSibling, newMessage);
  }
}

export function insertAfter(referenceNode, newNode) {
  if (referenceNode.type == "file") {
    referenceNode = referenceNode.parentNode.parentNode;
  }
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

export function responseFetch(res, preguntasFetched, url) {
  if (res == "ok") {
    console.log(preguntasFetched);
    return new Promise(function (resolve, reject) {
      resolve(
        fetch(url, {
          method: "POST",
          body: JSON.stringify(preguntasFetched),
          headers: { "Content-Type": "application/json" },
        })
      );
    });
  } else {
    return new Promise(function (resolve, reject) {
      throw new Error("Campos incorrectos");
    });
  }
}

export function retrieveParent(child, parentNameclass) {
  var parent = child;
  while (true) {
    if (parent.classList.contains(parentNameclass)) {
      return parent;
    }
    parent = parent.parentNode;
  }
}

export function addRespuestaCerrada(
  target,
  contRespuesta,
  respuestaCerrada,
  predefined = "",
  id = "",
  Pregunta = "",
  arrayRespuestasEliminadas = ""
) {
  contRespuesta = contRespuesta + 1;
  var respuestaCerradaClone = respuestaCerrada.cloneNode(true);
  respuestaCerradaClone.id = `resp${contRespuesta}`;
  respuestaCerradaClone.querySelector("textarea").value = predefined;
  if (id !== "") {
    respuestaCerradaClone.classList.add("respuestaLoaded", `rid-${id}`);
  } else {
    respuestaCerradaClone.classList.add("newRespuesta");
  }
  respuestaCerradaClone
    .querySelector(".eliminarButtonRespuesta")
    .addEventListener("click", (e) => {
      if (Formulario !== "") {
        var parent = retrieveParent(e.target, "respuesta");
        // var a = document.querySelector("");
        var idPregunta;
        parent.classList.forEach((classItem) => {
          if (classItem.length >= 3) {
            var aa = "aa";
            var classSlice = classItem.split("-", 2);
            if (classSlice[0] == "rid") {
              Pregunta.Opciones_Respuestas_Pregunta.forEach((respuesta) => {
                if (respuesta.ID == classSlice[1]) {
                  arrayRespuestasEliminadas.push(respuesta);
                  Pregunta.Opciones_Respuestas_Pregunta.Preguntas =
                    removeItemOnce(
                      Pregunta.Opciones_Respuestas_Pregunta,
                      respuesta
                    );
                }
              });
            }
          }
        });
        parent.classList.contains;
        console.log(arrayRespuestasEliminadas);
      }
      selectParent(e.target, "respuesta");
    });
  target.parentNode.insertBefore(respuestaCerradaClone, target);

  return contRespuesta;
}

export function addRespuestaMultiple(
  target,
  contRespuesta,
  respuestaMultiple,
  predefined = "",
  id = "",
  Pregunta = "",
  arrayRespuestasEliminadas = ""
) {
  contRespuesta = contRespuesta + 1;
  var respuestaMultipleClone = respuestaMultiple.cloneNode(true);
  respuestaMultipleClone.id = `resp${contRespuesta}`;
  respuestaMultipleClone.querySelector("textarea").value = predefined;
  if (id !== "") {
    respuestaMultipleClone.classList.add("respuestaLoaded", `rid-${id}`);
  } else {
    respuestaMultipleClone.classList.add("newRespuesta");
  }
  respuestaMultipleClone
    .querySelector(".eliminarButtonRespuesta")
    .addEventListener("click", (e) => {
      if (Formulario !== "") {
        var parent = retrieveParent(e.target, "respuesta");
        // var a = document.querySelector("");
        var idPregunta;
        parent.classList.forEach((classItem) => {
          if (classItem.length >= 3) {
            var aa = "aa";
            var classSlice = classItem.split("-", 2);
            if (classSlice[0] == "rid") {
              Pregunta.Opciones_Respuestas_Pregunta.forEach((respuesta) => {
                if (respuesta.ID == classSlice[1]) {
                  arrayRespuestasEliminadas.push(respuesta);
                  Pregunta.Opciones_Respuestas_Pregunta.Preguntas =
                    removeItemOnce(
                      Pregunta.Opciones_Respuestas_Pregunta,
                      respuesta
                    );
                }
              });
            }
          }
        });
        parent.classList.contains;
        console.log(arrayRespuestasEliminadas);
      }
      selectParent(e.target, "respuesta");
    });

  target.parentNode.insertBefore(respuestaMultipleClone, target);
  return contRespuesta;
}
