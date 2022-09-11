export class SliderController {
  constructor() {
    this.cont = 0;
    this.swiperControllers = [];
  }

  addCardAfterButton(card, swiper) {
    var previousIndex = swiper.activeIndex;
    var arrayCards = swiper.slides;
    // var e = document.createElement("");
    var button = arrayCards[previousIndex];
    var newCard = card.cloneNode(true);
    newCard.classList.add(`card-${this.cont}`);
    newCard
      .querySelector(".swiper-button-next")
      .classList.add(`swiper-button-next-child${this.cont}`);
    newCard
      .querySelector(".swiper-button-prev")
      .classList.add(`swiper-button-prev-child${this.cont}`);
    newCard
      .querySelector(".swiper-pagination")
      .classList.add(`swiper-pagination-child${this.cont}`);
    console.log(newCard.childNodes);
    console.log(newCard.querySelector(".buttonAddFoto").parentNode);

    document
      .querySelector(".mySwiper .swiper-wrapper")
      .insertBefore(newCard, button);
    this.createCarouselController(newCard, this.swiperControllers);
    swiper.update();
    this.cont++;
    return newCard;
  }

  addCardBeforeButtonNested(newCard, swiperControllers, ImagenCardTemplate) {
    newCard.querySelector(".buttonAddFoto").addEventListener("click", () => {
      const eventClick = new Event("click");
      var newCardNested = ImagenCardTemplate.cloneNode(true);
      newCardNested.classList.add("d-none");

      let cardID;
      // let x = "XD";
      // x.indexOf();
      newCard.classList.forEach((e) => {
        if (e.indexOf("card") != -1) {
          cardID = e.split("-", 2)[1];
        }
      });
      let swiperController = swiperControllers[cardID];
      let swiperNestedSlides = swiperController.slides;
      let activeSlide = swiperNestedSlides[swiperController.activeIndex];

      // for (var i = 1; i <= 5; i++) {
      newCard
        .querySelector(".swiper-wrapper")
        .insertBefore(newCardNested, activeSlide);
      // }
      let inputFile = newCardNested.querySelector(".mascotaImageInput");
      inputFile.addEventListener("change", () => {
        const [image] = inputFile.files;
        if (image && image.type.indexOf("image") != -1) {
          newCardNested.classList.remove("d-none");
          newCardNested.querySelector("img").src = URL.createObjectURL(image);
          var bodyRequest = new FormData();
          bodyRequest.append("imagen", image);
          newCardNested.querySelector("img").addEventListener("load", () => {
            URL.revokeObjectURL(newCardNested.querySelector("img").src);
            fetch("/publicaciones/check", {
              method: "POST",
              body: bodyRequest,
            })
              .then((res) => res.json())
              .then((res) => {
                if (res.warning) {
                  Swal.fire({
                    icon: "warning",
                    title: "¡Aviso!",
                    html: res.warning,
                    confirmButtonText: "Entendido",
                  });
                  newCardNested.remove();
                  swiperController.update();
                }
              });
          });
        } else {
          newCardNested.remove();
          Swal.fire({
            icon: "warning",
            title: "¡Aviso!",
            text: "Solo se aceptan imagenes",
            confirmButtonText: "Entendido",
          });
        }
        swiperController.update();
      });

      let deleteButton = newCardNested.querySelector(".btn-delete");
      deleteButton.addEventListener("click", () => {
        swiperController.removeSlide(swiperController.activeIndex);
      });
      newCardNested.querySelector(".mascotaImageInput").click();

      swiperController.update();
    });
  }

  createCarouselController(swiperCarousel, swiperControllers) {
    let swiper2 = new Swiper(
      swiperCarousel.querySelector(".swiper .swiper-v"),
      {
        mousewheel: true,
        noSwipingSelector: "input",
        zoom: { maxRatio: 5, toggle: true },

        grabCursor: true,
        slidesPerView: "1",

        pagination: {
          el: `.swiper-pagination-child${this.cont}`,
          clickable: true,
          type: "bullets",
          dynamicBullets: true,
        },
        navigation: {
          nextEl: `.swiper-button-next-child${this.cont}`,
          prevEl: `.swiper-button-prev-child${this.cont}`,
        },
        nested: true,
      }
    );
    swiperControllers.push(swiper2);
    // swiper2.uptdate();
  }
}
