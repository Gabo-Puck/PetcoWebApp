import { insertAfter } from "/javascripts/FormulariosFunctions.js";
import { loadingScreen } from "/javascripts/FormulariosFunctions.js";
import { initSocket } from "/javascripts/socketUtils.js";

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

const enviarMensajeChatProceso = document.querySelector(
  "#enviarMensajeChatProceso"
);

const chatBox = document.querySelector(".messagesChatProceso");

const mensajeYou = document.querySelector(".you");
const mensajeSomeone = document.querySelector(".someone");
const mensajeYouTemplate = document.querySelector(".youMessage");
const mensajeSomeoneTemplate = document.querySelector(".someoneMessage");
let socket = initSocket();

var archivoProtocolo;
var archivoPasoSubido;
var idPaso;
var defaultTimer = 400;

const infoPasoProceso = {
  infoPasoProceso: document.querySelector(".infoPasoProceso"),
  header: document.querySelector(".infoPasoProceso .card-header"),
  title: document.querySelector(".infoPasoProceso .card-title "),
  body: document.querySelector(".infoPasoProceso .card.body"),
  text: document.querySelector(".infoPasoProceso .card-text"),
  subirArchivo: document.querySelector("#subirArchivo"),
  descargarArchivoSubido: document.querySelector("#descargarArchivoSubido"),
  descargarArchivoProtocolo: document.querySelector(
    "#descargarArchivoProtocolo"
  ),
};

window.addEventListener("DOMContentLoaded", () => {
  var popoverTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="popover"]')
  );
  var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl);
  });
  addPasosToProgressBarSteps(progressBarSteps, PasosProceso);
  let buttonDescargarArchivoProtocolo =
    infoPasoProceso.descargarArchivoProtocolo.querySelector("button");
  buttonDescargarArchivoProtocolo.addEventListener("click", (e) => {
    downloadFile(archivoProtocolo);
  });

  let buttonDescargarArchivoSubido =
    infoPasoProceso.descargarArchivoSubido.querySelector("button");
  buttonDescargarArchivoSubido.addEventListener("click", (e) => {
    downloadFile(archivoPasoSubido);
  });
  if (infoPasoProceso.subirArchivo !== null) {
    let buttonUpload = infoPasoProceso.subirArchivo.querySelector("button");
    addListenerSubirArchivo(buttonUpload);
  }
  emitConnectionData();
  addListenerMandarMensajeButton();
});

insertPreviousMessages();

function insertPreviousMessages() {
  Mensajes.forEach((mensaje) => {
    insertNewMensaje(
      mensaje.Texto,
      mensaje.Usuario_Remitente,
      mensaje.Fecha_Envio,
      socket
    );
  });
}

function emitConnectionData() {
  socket.emit("join-proceso", MascotaID);
}

function addListenerSubirArchivo(button) {
  let inputImage = button.querySelector("input[type='file']");
  button.addEventListener("click", (e) => {
    inputImage.click();
  });

  inputImage.addEventListener("change", (e) => {
    let formData = new FormData();
    formData.append("MascotaID", PasosProceso[0].PasoProceso[0].ID_Mascota);
    formData.append("PasoID", PasosProceso[idPaso].ID);

    formData.append("archivoPaso", inputImage.files[0]);

    loadingScreen.fire();
    setTimeout(() => {
      fetch(`/proceso/subirArchivo`, { method: "POST", body: formData })
        .then((res) => res.json())
        .then((res) => {
          if (res == "ok") {
            Swal.fire(
              "Correcto!",
              "Se ha subido correctamente el archivo",
              "success"
            );
          } else {
            Swal.fire(
              "Error!",
              "Algo ha ido mal, intentelo más tarde",
              "error"
            );
          }
        });
    }, defaultTimer);
  });
}

const pasos = [];

function addPasosToProgressBarSteps(progressBar, PasosProceso) {
  let count = 0;
  let eventoClick = new Event("click");
  let thereIsCompletado = false;
  let liGap = document.createElement("li");
  liGap.classList.add("px-4", "w-100", "h-100");
  progressBar.appendChild(liGap);
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
    // progressBar.insertBefore(newPasoToProgressBar, progressBar.lastChild);
    progressBar.appendChild(newPasoToProgressBar);
    if (index == 0) {
      newPasoToProgressBar.dispatchEvent(eventoClick);
    }
    if (index < PasosProceso.length - 1)
      // progressBar.insertBefore(newBar, progressBar.lastChild);
      progressBar.appendChild(newBar);
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

  let idUltimoCompletado = Number(ultimoCompletado.id.split("-")[1]);
  if (idUltimoCompletado < pasos.length) {
    pasos[idUltimoCompletado + 1].classList.remove("pending-paso-progressbar");
    pasos[idUltimoCompletado + 1].classList.add("active-paso-progressbar");
  }
  progressBar.appendChild(liGap.cloneNode());
}

function addListenerToProgressDot(dot) {
  dot.addEventListener("click", (e) => {
    if (e.target.id === "") {
      idPaso = e.target.parentNode.id.split("-")[1];
    } else {
      idPaso = e.target.id.split("-")[1];
    }
    // alert(`pasos[${idPaso}] = ${pasos[idPaso]}`);
    infoPasoProceso.title.textContent = PasosProceso[idPaso].Titulo_Paso;
    infoPasoProceso.text.textContent = PasosProceso[idPaso].Descripcion;
    infoPasoProceso.header
      .querySelector("#pasoCompletado")
      .parentElement.classList.add("d-none");
    if (pasos[idPaso].classList.contains("active-paso-progressbar")) {
      infoPasoProceso.header.querySelector("div").textContent = "Paso Activo";
      infoPasoProceso.header
        .querySelector("#pasoCompletado")
        .parentNode.classList.remove("d-none");
    }
    if (pasos[idPaso].classList.contains("completed-paso-progressbar")) {
      infoPasoProceso.header.querySelector("div").textContent =
        "Paso completado";
    }
    if (pasos[idPaso].classList.contains("pending-paso-progressbar")) {
      infoPasoProceso.header.querySelector("div").textContent =
        "Paso pendiente";
    }

    if (PasosProceso[idPaso].Archivo !== "") {
      archivoProtocolo = PasosProceso[idPaso].Archivo;
      infoPasoProceso.descargarArchivoProtocolo.classList.remove("d-none");
    } else {
      archivoProtocolo = "";
      infoPasoProceso.descargarArchivoProtocolo.classList.add("d-none");
    }
    if (infoPasoProceso.subirArchivo !== null) {
      if (
        PasosProceso[idPaso].AceptaArchivo == "1" &&
        pasos[idPaso].classList.contains("active-paso-progressbar")
      ) {
        infoPasoProceso.subirArchivo.parentNode.classList.remove("d-none");
      } else {
        infoPasoProceso.subirArchivo.parentNode.classList.add("d-none");
      }
    }

    if (PasosProceso[idPaso].PasoProceso[0].Archivo !== null) {
      infoPasoProceso.descargarArchivoSubido.classList.remove("d-none");
      archivoPasoSubido = PasosProceso[idPaso].Archivo;
    } else {
      infoPasoProceso.descargarArchivoSubido.classList.add("d-none");
      archivoPasoSubido = "";
    }
  });
}

function addListenerToDownloadFile(button, path) {
  button.addEventListener("click", (e) => {
    downloadFile(button, path);
  });
  // button.removeEventListener("click", downloadFile(button, path), true);
}

function downloadFile(path) {
  let newAnchor = document.createElement("a");
  path = path.replace(/public/g, "");
  path = path.replaceAll("\\", "/");
  newAnchor.href = path;
  newAnchor.download = "ArchivoPaso";
  newAnchor.click();
  newAnchor.remove();
}

function addListenerMandarMensajeButton() {
  enviarMensajeChatProceso.addEventListener("submit", (e) => {
    e.preventDefault();
    let input = enviarMensajeChatProceso.querySelector("input");
    let message = input.value;
    let today = new Date();
    let date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    let time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let dateTime = date + " " + time;
    if (message !== "") {
      socket.emit("mensaje-chat-proceso", {
        message: message,
        userID: socket.userID,
        fecha: dateTime,
        SolicitudID: SolicitudID,
      });
    }
    input.value = "";
  });
}

socket.on("mensaje-chat-proceso", ({ message, userID, fecha }) => {
  insertNewMensaje(message, userID, fecha, socket);
});

function insertNewMensaje(message, userID, fecha, socket) {
  let newMessage;
  let newContentParagraph;
  let lastChild = chatBox.lastElementChild;

  if (userID == socket.userID) {
    newContentParagraph = mensajeYouTemplate.cloneNode(true);
    newMessage = mensajeYou.cloneNode(true);
  } else {
    newContentParagraph = mensajeSomeoneTemplate.cloneNode(true);
    newMessage = mensajeSomeone.cloneNode(true);
  }
  // newMessage.querySelector(".nombreChatProceso p").textContent = nombre;
  newContentParagraph.querySelector("p").textContent = message;
  newMessage
    .querySelector(".contenidoChatProceso")
    .appendChild(newContentParagraph);
  // newMessage.querySelector(".fotoMensajeUsuarioChat img").src = foto;
  newContentParagraph.querySelector(".contenidoMensaje").textContent = message;
  newContentParagraph.querySelector(".fecha").textContent = fecha;
  chatBox.appendChild(newMessage);
}
