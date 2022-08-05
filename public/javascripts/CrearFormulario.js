const preguntaAbierta = document
  .querySelector(".preguntaAbierta")
  .cloneNode(true);
const preguntaCerrada = document
  .querySelector(".preguntaCerrada")
  .cloneNode(true);
const preguntaMultiple = document
  .querySelector(".preguntaMultiple")
  .cloneNode(true);
const buttonAddPreguntaCerrada = document.querySelector(
  ".agregarPreguntaCerrada"
);
const buttonAddPreguntaAbierta = document.querySelector(
  ".agregarPreguntaAbierta"
);
const buttonAddPreguntaMultiple = document.querySelector(
  ".agregarPreguntaMultiple"
);
const respuestaCerrada = preguntaCerrada
  .querySelector(".respuesta")
  .cloneNode(true);
const respuestaMultiple = preguntaMultiple
  .querySelector(".respuesta")
  .cloneNode(true);

const guardarButton = document
  .querySelector(".guardarButton")
  .addEventListener("click", (e) => {
    bindPreguntas();
  });
var contPregunta = 2;
var contRespuesta = 1;
buttonAddPreguntaAbierta.addEventListener("click", (e) => {
  // var newPregunta = preguntaAbierta.cloneNode(true);
  // document.querySelector("form").appendChild(newPregunta);
  addPregunta(preguntaAbierta, document.querySelector("form"));
});
buttonAddPreguntaCerrada.addEventListener("click", (e) => {
  // var newPregunta = preguntaCerrada.cloneNode(true);
  // document.querySelector("form").appendChild(newPregunta);
  addPregunta(preguntaCerrada, document.querySelector("form"));
});
buttonAddPreguntaMultiple.addEventListener("click", (e) => {
  addPregunta(preguntaMultiple, document.querySelector("form"));
});

buttonAddPreguntaAbierta.id;

function addPregunta(preguntaPrototype, form) {
  var newPregunta = preguntaPrototype.cloneNode(true);
  contPregunta = contPregunta + 1;
  newPregunta.id = `preg${contPregunta}`;
  form.appendChild(newPregunta);
}

function addRespuestaCerrada(target) {
  contRespuesta = contRespuesta + 1;
  var respuestaCerradaClone = respuestaCerrada.cloneNode(true);
  respuestaCerradaClone.id = `resp${contRespuesta}`;
  target.parentNode.insertBefore(respuestaCerradaClone, target);
}
function addRespuestaMultiple(target) {
  contRespuesta = contRespuesta + 1;
  var respuestaMultipleClone = respuestaMultiple.cloneNode(true);
  respuestaMultipleClone.id = `resp${contRespuesta}`;
  target.parentNode.insertBefore(respuestaMultipleClone, target);
}
//Tipo 1 pregunta abierta
//Tipo 2 pregunta cerrada
//Tipo 3 pregunta multiple
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
function bindPreguntas() {
  var preguntasAbiertas = document.querySelectorAll(".preguntaAbierta");
  var preguntasCerradas = document.querySelectorAll(".preguntaCerrada");
  var preguntasMultiples = document.querySelectorAll(".preguntaMultiple");
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

  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      var response = JSON.parse(xhr.responseText);
      console.log(response);
      renderMessages(response);
    }
  };
  //Post with XHR
  // xhr.open("POST", "http://localhost:3000/formulario/verify", true);
  // xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  // xhr.send(JSON.stringify(preguntasFetched));
  //Post with fetch
  const header = new Headers();
  setTimeout(() => {
    var response = fetch("http://localhost:3000/formulario/verify", {
      method: "POST",
      body: JSON.stringify(preguntasFetched),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => renderMessages(res));
  }, 1300);
}

function bindPreguntasConRespuestas(preguntaBinded, preguntas, tipo) {
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

function displayModal(button) {
  var myModal2 = button.nextElementSibling;
  var myModal = new bootstrap.Modal(myModal2, {});
  myModal.show();
}

function selectParent(button, parentNameClass) {
  var parent = button;
  buttonAddPreguntaAbierta.classList.contains(parentNameClass);
  while (true) {
    console.log("tr");
    if (parent.classList.contains(parentNameClass)) {
      parent.remove();
      break;
    }
    parent = parent.parentNode;
  }
}

function retrieveParent(child, parentNameclass) {
  var parent = child;
  while (true) {
    if (parent.classList.contains(parentNameclass)) {
      return parent;
    }
    parent = parent.parentNode;
  }
}

function renderMessages(response) {
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

  if (response.errors.length == 0) {
    loadingScreen.close();
    Swal.fire({
      title: "Listo!",
      text: "Se ha guardado de manera exitosa tu formulario",
      icon: "success",
      confirmButtonText: "Siguiente",
    }).then((sweetResult) => {
      if (sweetResult.isConfirmed) {
        window.location = "http://localhost:3000/registro/info";
      }
    });
    return;
  } else {
    response.errors.forEach((error) => {
      var newErrorMessage = document.createElement("div");
      newErrorMessage.classList.add("invalid-feedback", "d-block");
      newErrorMessage.innerText = error.msg;
      addMessageFeedback(error, newErrorMessage, "is-invalid");
      if (error.formID == "titulo") {
        document.querySelector("#titulo").classList.add("is-invalid");
        insertAfter(document.querySelector("#titulo"), newErrorMessage);
      }
    });
  }
  if (response.correct.length >= 1) {
    response.correct.forEach((correctFeedback) => {
      var newCorrectMessage = document.createElement("div");
      newCorrectMessage.classList.add("valid-feedback", "d-block");
      newCorrectMessage.innerText = correctFeedback.msg;
      addMessageFeedback(correctFeedback, newCorrectMessage, "is-valid");
      if (correctFeedback.formID == "titulo") {
        document.querySelector("#titulo").classList.add("is-valid");
        insertAfter(document.querySelector("#titulo"), newCorrectMessage);
      }
    });
  }
  loadingScreen.close();
}

function addMessageFeedback(response, newMessage, validationInput) {
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

function insertAfter(referenceNode, newNode) {
  if (referenceNode.type == "file") {
    referenceNode = referenceNode.parentNode.parentNode;
  }
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
