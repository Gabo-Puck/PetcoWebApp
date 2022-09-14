const card = document.querySelector(".swiperCard");
const cont = [0];

import {
  SliderController,
  addListenersToElementsInCarousel,
} from "/javascripts/SliderFunctionsPublicaciones.js";
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
  var descripcionPublicacion = document.querySelector(
    ".publicacionDescripcion"
  ).value;
  bodyRequest.append("Titulo", tituloPublicacion);
  bodyRequest.append("Descripcion", descripcionPublicacion);
  document
    .querySelector("#mainCard")
    .querySelectorAll(".mascota")
    .forEach((mascota) => {
      let mascotaObject = {};
      mascotaObject.Nombre = mascota.querySelector(".nombreMascota").value;
      mascotaObject.ID_Especie = mascota.querySelector(".especieSelect").value;
      mascotaObject.Edad = mascota.querySelector(".edadInput").value;
      mascotaObject.Descripcion = mascota.querySelector(
        ".mascotaDescripcion"
      ).value;
      mascotaObject.ID_Salud = mascota
        .querySelector(".saludOptions")
        .querySelector("input[type='radio']:checked").value;
      mascotaObject.ID_Tamano = mascota
        .querySelector(".tamanoOptions")
        .querySelector("input[type='radio']:checked").value;
      mascotaObject.ID_Castado = mascota
        .querySelector(".castradoOptions")
        .querySelector("input[type='radio']:checked").value;
      let vacunas = [];
      mascota
        .querySelector(".vacunasBox")
        .querySelectorAll("input[type='checkbox']:checked")
        .forEach((vacunaInput) => vacunas.push({ ID: vacunaInput.value }));
      mascotaObject.MascotasVacunasThrough = vacunas;
      arrayMascotas.push(mascotaObject);
      console.log(mascotaObject);
    });
  bodyRequest.append("Mascota", JSON.stringify(arrayMascotas));
  fetch("/publicaciones/crear", { method: "POST", body: bodyRequest });
});
