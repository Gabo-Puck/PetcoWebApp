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

window.addEventListener("DOMContentLoaded", () => {
  addPasosToProgressBarSteps(progressBarSteps, PasosProceso);
});

function addPasosToProgressBarSteps(progressBar, PasosProceso) {
  let count = 0;
  PasosProceso.forEach((Paso) => {
    let newPasoToProgressBar;
    if (Paso.Completado == 0) {
      newPasoToProgressBar = pasoPendiente.cloneNode(true);
    }
    if (Paso.Compleatdo == 3) {
      newPasoToProgressBar = pasoCompletado.cloneNode(true);
    }
    if (Paso.Compleatdo != 3 && Paso.Compleatdo != 0) {
      newPasoToProgressBar = pasoActivo.cloneNode(true);
    }
    newPasoToProgressBar.querySelector("span").textContent = ++count;
    progressBar.insertBefore(newPasoToProgressBar, progressBar.lastChild);
    //   insertAfter(progressBar.childNodes[progressBarSteps.childElementCount-1]);
    //   insertAfter(referenceNode, newNode)
  });
}
