// const swiper = new Swiper(".mySwiper", {
//   pagination: {
//     el: ".swiper-pagination",
//     type: "bullets",
//     dynamicBullets: true,
//   },
//   navigation: {
//     nextEl: ".swiper-button-next",
//     prevEl: ".swiper-button-prev",
//   },
// });

// const swiper2 = new Swiper(".mySecondSwiper", {
//   pagination: {
//     el: ".swiper-pagination1",
//     type: "bullets",
//     dynamicBullets: true,
//   },
//   navigation: {
//     nextEl: ".swiper-button-next1",
//     prevEl: ".swiper-button-prev1",
//   },
// });

// swiper;

var swiperControllers = [];

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

function addListenerToElement(element, functionEvent, eventType) {
  element.addEventListener(eventType, () => {
    functionEvent;
  });
}

const card = document.querySelector(".swiperCard");
const cont = [0];

function addCardAfterButton(element, cont) {
  var previousIndex = swiper.activeIndex;
  var arrayCards = swiper.slides;
  // var e = document.createElement("");
  var button = arrayCards[previousIndex];
  var newCard = card.cloneNode(true);
  newCard.classList.add(`card${cont[0]}`);
  newCard
    .querySelector(".swiper-button-next")
    .classList.add(`swiper-button-next-child${cont[0]}`);
  newCard
    .querySelector(".swiper-button-prev")
    .classList.add(`swiper-button-prev-child${cont[0]}`);
  newCard
    .querySelector(".swiper-pagination")
    .classList.add(`swiper-pagination-child${cont[0]}`);

  document
    .querySelector(".mySwiper .swiper-wrapper")
    .insertBefore(newCard, button);
  createCarouselController(newCard, cont[0]);
  swiper.update();
  cont[0]++;
}

function createCarouselController(swiperCarousel, cont) {
  console.log(swiperCarousel.classList);
  let swiper2 = new Swiper(swiperCarousel.querySelector(".swiper"), {
    effect: "cards",
    grabCursor: true,
    // centeredSlides: true,
    slidesPerView: "auto",

    pagination: {
      el: `.swiper-pagination-child${cont}`,
      clickable: true,
      type: "bullets",
      dynamicBullets: true,
    },
    navigation: {
      nextEl: `.swiper-button-next-child${cont}`,
      prevEl: `.swiper-button-prev-child${cont}`,
    },
    nested: true,
  });
  swiperControllers.push(swiper2);
}

document.querySelector(".addCardButton").addEventListener("click", () => {
  // swiper.appendSlide(`<div class="swiper-slide">new new</div>`);
  addCardAfterButton(document.querySelector(".addCardButton"), cont);
});
