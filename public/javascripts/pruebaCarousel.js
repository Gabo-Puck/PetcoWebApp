const card = document.querySelector(".swiperCard");
const cont = [0];

import { SliderController } from "/javascripts/SliderFunctionsPublicaciones.js";
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

$(window).on("load", () => {});

document.querySelector(".addCardButton").addEventListener("click", () => {
  // swiper.appendSlide(`<div class="swiper-slide">new new</div>`);
  let newCard = controller.addCardAfterButton(
    MascotaTemplate.cloneNode(true),
    swiper
  );
  controller.addCardBeforeButtonNested(
    newCard,
    controller.swiperControllers,
    ImagenCardTemplate
  );
  newCard.querySelector(".form-range").addEventListener("input", (e) => {
    if (e.target.value == -1) {
      newCard.querySelector(".edadTexto").innerText = "La desconozco";
    }
    if (e.target.value == 0) {
      newCard.querySelector(".edadTexto").innerText = "Menos de un año";
    }
    if (e.target.value > 0)
      newCard.querySelector(".edadTexto").innerText = e.target.value;
  });
});

document.querySelector(".savePublicacion").addEventListener("click", () => {});
