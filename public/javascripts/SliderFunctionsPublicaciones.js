import { selectParent } from "/javascripts/FormulariosFunctions.js";

export class SliderController {
  constructor() {
    this.cont = 0;
    this.swiperControllers = [];
    this.contInput = 0;
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
            fetch("/publicacion/check", {
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

export function addListenersToElementsInCarousel(
  controller,
  MascotaTemplateDOM,
  responseData,
  swiper
) {
  const MascotaTemplate = MascotaTemplateDOM.querySelector(".swiperCard");
  const ImagenCardTemplate =
    MascotaTemplateDOM.querySelector(".swiperCardImage");
  const metaTemplate = MascotaTemplateDOM.querySelector(".metaTemplate");
  const optionEspecieTemplate =
    MascotaTemplateDOM.querySelector(".optionEspecie");
  const vacunaTemplate = MascotaTemplateDOM.querySelector(".vacunaTemplate");
  const radioSelectorTemplate =
    MascotaTemplateDOM.querySelector(".radioSelector");
  let newCard = controller.addCardAfterButton(
    MascotaTemplate.cloneNode(true),
    swiper
  );
  controller.addCardBeforeButtonNested(
    newCard,
    controller.swiperControllers,
    ImagenCardTemplate
  );

  responseData.EspeciesVacunas.forEach((EspecieVacuna) => {
    let optionElement = document.createElement("option");
    optionElement.value = EspecieVacuna.ID;
    optionElement.innerText = EspecieVacuna.Nombre_Especie;
    newCard.querySelector(".especieSelect").appendChild(optionElement);
  });
  newCard.querySelector(".especieSelect").id = controller.contInput++;

  responseData.SaludStatus.forEach((Status) => {
    let radioInput = radioSelectorTemplate.cloneNode(true);
    radioInput.querySelector("input").value = Status.ID;
    radioInput.querySelector("label").innerText = Status.Salud;
    radioInput.querySelector("input").name = `Salud${controller.contInput}`;
    radioInput.querySelector("label").for = `Salud${controller.contInput}`;

    newCard.querySelector(".saludOptions").appendChild(radioInput);
  });
  newCard.querySelector(".saludOptions").id = controller.contInput++;

  responseData.CastradoStatus.forEach((Status) => {
    let radioInput = radioSelectorTemplate.cloneNode(true);
    radioInput.querySelector("input").value = Status.ID;
    radioInput.querySelector("label").innerText = Status.Castrado;
    radioInput.querySelector("input").name = `Castrado${controller.contInput}`;
    radioInput.querySelector("label").for = `Castrado${controller.contInput}`;
    newCard.querySelector(".castradoOptions").appendChild(radioInput);
  });
  newCard.querySelector(".castradoOptions").id = controller.contInput++;

  responseData.Tamanos.forEach((Tamano) => {
    let radioInput = radioSelectorTemplate.cloneNode(true);
    radioInput.querySelector("input").value = Tamano.ID;
    radioInput.querySelector("label").innerText = Tamano.Tamano;
    radioInput.querySelector("input").name = `Tamano${controller.contInput}`;
    radioInput.querySelector("label").for = `Tamano${controller.contInput}`;
    newCard.querySelector(".tamanoOptions").appendChild(radioInput);
  });
  newCard.querySelector(".tamanoOptions").id = controller.contInput++;

  newCard.querySelector(".especieSelect").addEventListener("change", (e) => {
    let cardID;
    newCard.classList.forEach((e) => {
      if (e.indexOf("card") != -1) {
        cardID = e;
      }
    });

    $(`.${cardID} .vacunasBox`).empty();
    responseData.EspeciesVacunas.forEach((Especie) => {
      if (Especie.ID == e.target.value) {
        Especie.Vacunas.forEach((Vacuna) => {
          if (Vacuna.Nombre_Vacuna == "Especie sin vacunas") {
            let text = document.createElement("p");
            text.innerText = "Especie sin vacunas";
            newCard.querySelector(".vacunasBox").appendChild(text);
          } else {
            let checkboxInput = vacunaTemplate.cloneNode(true);
            checkboxInput.querySelector("input").value = Vacuna.ID;
            checkboxInput.querySelector("label").innerText =
              Vacuna.Nombre_Vacuna;
            newCard.querySelector(".vacunasBox").appendChild(checkboxInput);
          }
        });
      }
    });
    newCard.querySelector(".vacunasBox").id = controller.contInput++;

    // responseData.vacunas.forEach((vacuna) => {
    //   if(vacuna)
    // })
  });

  responseData.ProtocolosUsuario.forEach((Usuario) => {
    Usuario.Protocolos.forEach((Protocolo) => {
      let optionElement = document.createElement("option");
      optionElement.value = Protocolo.ID;
      optionElement.innerText = Protocolo.Titulo;
      newCard.querySelector(".protocoloSelector").appendChild(optionElement);
    });
  });
  newCard.querySelector(".protocoloSelector").id = controller.contInput++;
  newCard.querySelector(".mascotaDescripcion").id = controller.contInput++;
  newCard.querySelector(".nombreMascota").id = controller.contInput++;
  newCard.querySelector(".edadInput").id = controller.contInput++;

  newCard.querySelector(".crearMetaButton").addEventListener("click", (e) => {
    e.preventDefault();
    let meta = metaTemplate.cloneNode(true);
    meta.querySelector(".metaDescripcion").id = controller.contInput++;
    meta.querySelector(".metaCantidad").id = controller.contInput++;

    newCard.querySelector(".metasBox").insertBefore(meta, e.target);
  });
  newCard
    .querySelector(".habilitarDonacionescheck")
    .addEventListener("click", (e) => {
      let button = newCard.querySelector(".crearMetaButton");
      button.disabled = e.target.checked ? false : true;
    });
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
}
