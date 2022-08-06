// import { displayModal } from "/javascripts/FormulariosFunctions.js";
const button = document.querySelector(".pruebaB");
var preguntaAbiertaTemplate;
var preguntaCerradaTemplate;
var preguntaMultipleTemplate;

button.addEventListener("click", (e) => {
  fetch("http://localhost:3000/formulario/preguntaTemplate")
    .then((res) => res.text())
    .then((html) => {
      var parserDOM = new DOMParser();
      var doc = parserDOM.parseFromString(html, "text/html");
      preguntaAbiertaTemplate = doc.querySelector(".preguntaAbierta");
      preguntaCerradaTemplate = doc.querySelector(".preguntaCerrada");
      preguntaMultipleTemplate = doc.querySelector(".preguntaMultiple");
      //   console.log(doc);
    })
    .then(() => {
      document
        .querySelector("body")
        .appendChild(preguntaAbiertaTemplate.cloneNode(true));
    });
});

function displayModal(button) {
  var myModal2 = button.nextElementSibling;
  var myModal = new bootstrap.Modal(myModal2, {});
  myModal.show();
}
