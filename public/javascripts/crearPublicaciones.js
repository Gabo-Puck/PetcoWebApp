const card = document.querySelector(".swiperCard");
const cont = [0];

import {
  SliderController,
  addListenersToElementsInCarousel,
} from "/javascripts/SliderFunctionsPublicaciones.js";
import { loadingScreen } from "/javascripts/FormulariosFunctions.js";
import { handleResponse, insertAfter } from "/javascripts/handleResponse.js";

var swiperControllers = [];

var controller = new SliderController();

var swiper = new Swiper(".mySwiper", {
  spaceBetween: 50,
  noSwipingSelector: "input",
  pagination: {
    el: ".swiper-pagination-parent",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next-parent",
    prevEl: ".swiper-button-prev-parent",
  },
});

$(window).on("load", () => {
  // alert("Cargado");
});

document.querySelector(".addCardButton").addEventListener("click", () => {
  // swiper.appendSlide(`<div class="swiper-slide">new new</div>`);
  addListenersToElementsInCarousel(
    controller,
    MascotaTemplateDOM,
    responseData,
    swiper
  );
});

document.querySelector(".savePublicacion").addEventListener("click", () => {
  var bodyRequest = new FormData();
  var arrayMascotas = [];
  var tituloPublicacion = document.querySelector(".publicacionTitulo").value;
  var tituloPublicacionID = document.querySelector(".publicacionTitulo").id;
  var descripcionPublicacion = document.querySelector(
    ".publicacionDescripcion"
  ).value;
  var descripcionPublicacionID = document.querySelector(
    ".publicacionDescripcion"
  ).id;
  var cont = 0; //contador para las fotos, luego hay que cambiarlo por la id de las imagenes
  let conteoMascotas = true;
  bodyRequest.append("Titulo", tituloPublicacion);
  bodyRequest.append("TituloID", tituloPublicacionID);
  bodyRequest.append("Descripcion", descripcionPublicacion);
  bodyRequest.append("DescripcionID", descripcionPublicacionID);
  document
    .querySelector("#mainCard")
    .querySelectorAll(".mascota")
    .forEach((mascota) => {
      let mascotaObject = {};
      mascotaObject.Nombre = mascota.querySelector(".nombreMascota").value;
      mascotaObject.NombreID = mascota.querySelector(".nombreMascota").id;
      mascotaObject.ID_Especie = mascota.querySelector(".especieSelect").value;
      mascotaObject.ID_EspecieID = mascota.querySelector(".especieSelect").id;
      mascotaObject.Edad = mascota.querySelector(".edadInput").value;
      mascotaObject.EdadID = mascota.querySelector(".edadInput").id;
      mascotaObject.Descripcion = mascota.querySelector(
        ".mascotaDescripcion"
      ).value;
      mascotaObject.DescripcionID = mascota.querySelector(
        ".mascotaDescripcion"
      ).id;
      mascotaObject.ID_Salud = mascota
        .querySelector(".saludOptions")
        .querySelector("input[type='radio']:checked").value;

      mascotaObject.ID_Tamano = mascota
        .querySelector(".tamanoOptions")
        .querySelector("input[type='radio']:checked").value;
      mascotaObject.ID_Castrado = mascota
        .querySelector(".castradoOptions")
        .querySelector("input[type='radio']:checked").value;
      mascotaObject.ID_Estado = 1;
      let vacunas = [];
      mascota
        .querySelector(".vacunasBox")
        .querySelectorAll("input[type='checkbox']:checked")
        .forEach((vacunaInput) =>
          vacunas.push({ ID_Vacuna: vacunaInput.value })
        );
      let metas = [];
      if (
        mascota.querySelector(".optionMascotaConMeta").querySelector("input")
          .checked == 1
      ) {
        let meta = mascota.querySelector(".metasBox");

        let cantidad = meta.querySelector(".metaCantidad").value;
        let cantidadID = meta.querySelector(".metaCantidad").id;
        let descripcionMeta = meta.querySelector(".metaDescripcion").value;
        let descripcionMetaID = meta.querySelector(".metaDescripcion").id;
        metas.push({
          Cantidad: cantidad,
          CantidadID: cantidadID,
          Descripcion: descripcionMeta,
          DescripcionID: descripcionMetaID,
          Completado: false,
        });
      }
      let images = {};
      let cont2 = 0;
      mascotaObject.MascotasImagenes = [];
      let mascotaImagenes = mascota.querySelectorAll("input[type='file']");
      mascotaImagenes.forEach((element) => {
        if (element.files.length == 0) {
          element.remove();
        }
      });
      mascota.querySelector(".infoImagenes").classList.remove("fa-circle-info");
      if (
        mascotaImagenes.length >= 3 &&
        mascotaImagenes.length <= 5 &&
        conteoMascotas
      ) {
        conteoMascotas = true;
        mascota
          .querySelector(".infoImagenes")
          .classList.remove("fa-circle-exclamation");
        mascota.querySelector(".infoImagenes").classList.add("fa-circle-check");
        mascota.querySelector(".informative").style.color = "#28B62C";
      } else {
        conteoMascotas = false;
        mascota
          .querySelector(".infoImagenes")
          .classList.remove("fa-circle-check");
        mascota
          .querySelector(".infoImagenes")
          .classList.add("fa-circle-exclamation");
        mascota.querySelector(".informative").style.color = "#FF4136";
      }
      mascota.querySelectorAll("input[type='file']").forEach((imagen) => {
        bodyRequest.append(`${cont}-${cont2}`, imagen.files[0]);
        cont2++;
      });

      let protocolo = mascota.querySelector(".protocoloSelector").value;
      mascotaObject.ID_Protocolo = protocolo;

      mascotaObject.MascotasVacunasThrough = vacunas;
      mascotaObject.MascotasMetas = metas;
      mascotaObject.MascotasImagenes = [];

      arrayMascotas.push(mascotaObject);
      cont++;

      console.log(mascotaObject);
    });
  if (conteoMascotas) {
    bodyRequest.append("Mascota", JSON.stringify(arrayMascotas));
    loadingScreen.fire();
    fetch("/petco/publicacion/crear", { method: "POST", body: bodyRequest })
      .then((res) => res.json())
      .then((res) =>
        handleResponse(
          res,
          "/petco/inicio/",
          "¡Publicación creada correctamente!"
        )
      )
      .then((res) => displayErrors(res));
    return;
  }
  Swal.fire({
    icon: "warning",
    title: "¡Aviso!",
    html: `<p>Cada mascota debe de tener entre 3 y 5 fotografías</p>`,
    confirmationButtonText: "Entendido",
  });
});

function displayErrors(res) {
  document.querySelectorAll(".is-invalid,.is-valid").forEach((element) => {
    element.classList.remove("is-invalid");
    element.classList.remove("is-valid");
  });
  document
    .querySelectorAll(".invalid-feedback,.valid-feedback")
    .forEach((element) => {
      element.remove();
    });
  res.errors.forEach((error) => {
    let input = document.querySelector(`#${error.ID}`);
    input.classList.add("is-invalid");
    let elementMsg = document.createElement("p");
    elementMsg.textContent = error.msg;
    elementMsg.classList.add("invalid-feedback");
    insertAfter(input, elementMsg);
  });
  var selector =
    ".publicacionTitulo:not(.is-invalid),.publicacionDescripcion:not(.is-invalid),.nombreMascota:not(.is-invalid)," +
    ".mascotaDescripcion:not(.is-invalid),.metaDescripcion:not(.is-invalid),.metaCantidad:not(.is-invalid)";
  let correctFields = document.querySelectorAll(selector);
  correctFields.forEach((element) => {
    element.classList.add("is-valid");
    let elementMsg = document.createElement("p");
    elementMsg.textContent = "Bien!";
    elementMsg.classList.add("valid-feedback");
    insertAfter(element, elementMsg);
  });
  // correctFields.
}

// function insertAfter(referenceNode, newNode) {
//   referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
// }
