import { insertAfter } from "/javascripts/FormulariosFunctions.js";

const progressBarSteps = document.querySelector(".progress-bar ul");
const pasoPendiente = document.querySelector(
  ".templateElmentsPasosProgressBar .pending-paso-progressbar"
);
const pasoCompletado = document.querySelector(
  ".templateElmentsPasosProgressBar .completed-paso-progressbar"
);
const pasoActivo = document.querySelector(
  ".templateElmentsPasosProgressBar .active-paso-progressbar"
);

const progressBarLine = document.querySelector(
  ".templateElmentsPasosProgressBar .progress-bar-line"
);

const infoPasoProceso = {
  infoPasoProceso: document.querySelector(".infoPasoProceso"),
  header: document.querySelector(".infoPasoProceso .card-header"),
  title: document.querySelector(".infoPasoProceso .card-title "),
  body: document.querySelector(".infoPasoProceso .card.body"),
  text: document.querySelector(".infoPasoProceso .card-text"),
};

window.addEventListener("DOMContentLoaded", () => {
  addPasosToProgressBarSteps(progressBarSteps, PasosProceso);
});

const pasos = [];

function addPasosToProgressBarSteps(progressBar, PasosProceso) {
  let count = 0;
  let eventoClick = new Event("click");
  let thereIsCompletado = false;
  for (let index = 0; index < PasosProceso.length; index++) {
    const Paso = PasosProceso[index];
    let newPasoToProgressBar;
    let newBar = progressBarLine.cloneNode(true);
    if (Paso.PasoProceso[0].Completado == 0) {
      newPasoToProgressBar = pasoPendiente.cloneNode(true);
    }
    if (Paso.PasoProceso[0].Completado == 3) {
      newPasoToProgressBar = pasoCompletado.cloneNode(true);
    }
    if (
      Paso.PasoProceso[0].Completado != 3 &&
      Paso.PasoProceso[0].Completado != 0
    ) {
      newPasoToProgressBar = pasoActivo.cloneNode(true);
    }
    newPasoToProgressBar.id = `paso-${count}`;
    pasos[count] = newPasoToProgressBar;
    newPasoToProgressBar.querySelector("span").textContent = ++count;
    addListenerToProgressDot(newPasoToProgressBar);
    progressBar.insertBefore(newPasoToProgressBar, progressBar.lastChild);
    if (index == 0) {
      newPasoToProgressBar.dispatchEvent(eventoClick);
    }
    if (index < PasosProceso.length - 1)
      progressBar.insertBefore(newBar, progressBar.lastChild);
    //   insertAfter(progressBar.childNodes[progressBarSteps.childElementCount-1]);
    //   insertAfter(referenceNode, newNode)
  }
  //   if (!thereIsCompletado) {
  //     pasos[0].classList.remove("pending-paso-progressbar");
  //     pasos[0].classList.add("active-paso-progressbar");
  //   }
  let completadoArray = progressBar.querySelectorAll(
    ".completed-paso-progressbar"
  );
  let ultimoCompletado = completadoArray[completadoArray.length - 1];

  let idUltimoCompletado = ultimoCompletado.id.split("-")[1];
  if (idUltimoCompletado < pasos.length) {
    pasos[idUltimoCompletado].classList.remove("pending-paso-progressbar");
    pasos[idUltimoCompletado].classList.add("active-paso-progressbar");
  }
}

function addListenerToProgressDot(dot) {
  dot.addEventListener("click", (e) => {
    let idPaso;
    if (e.target.id === "") {
      idPaso = e.target.parentNode.id.split("-")[1];
    } else {
      idPaso = e.target.id.split("-")[1];
    }
    // alert(`pasos[${idPaso}] = ${pasos[idPaso]}`);
    infoPasoProceso.title.textContent = PasosProceso[idPaso].Titulo_Paso;
    infoPasoProceso.text.textContent = PasosProceso[idPaso].Descripcion;
    if (pasos[idPaso].classList.contains("active-paso-progressbar")) {
      infoPasoProceso.header.querySelector("div").textContent = "Paso Activo";
    }
    if (pasos[idPaso].classList.contains("completed-paso-progressbar")) {
      infoPasoProceso.header.querySelector("div").textContent =
        "Paso completado";
    }
    if (pasos[idPaso].classList.contains("pending-paso-progressbar")) {
      infoPasoProceso.header.querySelector("div").textContent =
        "Paso pendiente";
    }
  });
}
