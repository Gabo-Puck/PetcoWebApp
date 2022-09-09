const card = document.querySelector(".swiperCard");
const cont = [0];

import { SliderController } from "/javascripts/SliderFunctionsPublicaciones.js";
var swiperControllers = [];

var controller = new SliderController();

var swiper = new Swiper(".mySwiper", {
  spaceBetween: 50,
  pagination: {
    el: ".swiper-pagination-parent",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next-parent",
    prevEl: ".swiper-button-prev-parent",
  },
});

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
});
