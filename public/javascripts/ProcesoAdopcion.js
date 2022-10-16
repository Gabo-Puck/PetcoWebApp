import { loadingScreen } from "/javascripts/FormulariosFunctions.js"; //Importamos la pantalla de carga
import { initSocket } from "/javascripts/socketUtils.js"; //Importamos la función para inicilizar el socket

const progressBarSteps = document.querySelector(".progress-bar ul"); //Obtenemos la barra de progreso de los pasos
const pasoPendiente = document.querySelector(
  ".templateElmentsPasosProgressBar .pending-paso-progressbar"
); //Obtenemos la plantilla para los pasos pendientes
const pasoCompletado = document.querySelector(
  ".templateElmentsPasosProgressBar .completed-paso-progressbar"
); //Obtenemos la plantilla para los pasos completados
const pasoActivo = document.querySelector(
  ".templateElmentsPasosProgressBar .active-paso-progressbar"
); //Obtenemos la plantilla para el paso activo

const progressBarLine = document.querySelector(
  ".templateElmentsPasosProgressBar .progress-bar-line"
); //Obtenemos la linea que se usa para la unión de dos pasos

const enviarMensajeChatProceso = document.querySelector(
  "#enviarMensajeChatProceso"
); //Obtenemos el formulario para mandar mensajes

var idPaso; //ID del paso seleccionado actual por el usuario

const pasoCompletadoCheckBox = document.querySelector("#pasoCompletado");

pasoCompletadoCheckBox.addEventListener("change", (e) => {
  if (pasoCompletadoCheckBox.checked == "1") {
    Swal.fire({
      title: "¡Hola!",
      html: "<p>¿Deseas marcar este paso como compleado?</p>",
      showDenyButton: true,
      confirmButtonText: "Si",
      denyButtonText: `No`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        // Swal.fire('Saved!', '', 'success')
        //hacer algo para guardar el paso
        socket.emit("paso-completado-intento", {
          tipo: tipo,
          idPasoMascota: PasosProceso[idPaso].PasoProceso[0].ID,
          idPasoArray: idPaso,
        });
      } else if (result.isDenied) {
        pasoCompletadoCheckBox.checked = 0;
        Swal.close();
      }
    });
  } else {
    Swal.fire({
      title: "¡Hola!",
      html: "<p>¿Deseas desmarcar este paso como compleado?</p>",
      showDenyButton: true,
      confirmButtonText: "Si",
      denyButtonText: `No`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        // Swal.fire('Saved!', '', 'success')
        //hacer algo para guardar el paso
        socket.emit("paso-incompleto-intento", { tipo, MascotaID, idPaso });
      } else if (result.isDenied) {
        pasoCompletadoCheckBox.checked = 1;
        Swal.close();
      }
    });
  }
});

const chatBox = document.querySelector(".messagesChatProceso"); //Obtenemos el elemento que contiene los mensajes del chat

const mensajeYou = document.querySelector(".you"); //Obtenemos la plantilla de el contenedor de un mensaje. Esta es la plantilla para el contenedor de un mensaje que el cliente envia
const mensajeSomeone = document.querySelector(".someone"); //Obtenemos la plantilla de el contenedor de un mensaje. Esta es la plantilla para el contenedor de un mensaje que el cliente recibe
const mensajeYouTemplate = document.querySelector(".youMessage"); //Obtenemos la plantilla de el texto de un mensaje. Esta es la plantilla para el text de un mensaje que el cliente envia
const mensajeSomeoneTemplate = document.querySelector(".someoneMessage"); //Obtenemos la plantilla de el texto de un mensaje. Esta es la plantilla para el text de un mensaje que el cliente recibe

var archivoProtocolo; //Objeto que representa la ruta del archivo de protocolo
var archivoPasoSubido; //Objeto que representa la ruta del archivo que el usuario adoptante ha subido
var defaultTimer = 400; //Esta variable es el tiempo minimo para que una petición al servidor se realice. Se usa para mostrar la pantalla de carga

const infoPasoProceso = {
  infoPasoProceso: document.querySelector(".infoPasoProceso"), //Propiedad que representa el contenedor de la información de un paso
  header: document.querySelector(".infoPasoProceso .card-header"), //Propiedad que representa el encabezado del elemento "card" de bootstrap
  title: document.querySelector(".infoPasoProceso .card-title "), //Propiedad que representa el titulo del encabezado del elemento "card" de bootstrap
  body: document.querySelector(".infoPasoProceso .card.body"), //Propiedad que representa el cuerpo del elemento "card" de bootstrap
  text: document.querySelector(".infoPasoProceso .card-text"), //Propiedad que representa el texto dentro del cuerpo del elemento "card" de bootstrap
  subirArchivo: document.querySelector("#subirArchivo"), //Propiedad que representa el boton para subir archivo dentro del cuerpo del elemento "card" de bootstrap
  descargarArchivoSubido: document.querySelector("#descargarArchivoSubido"), //Propiedad que representa el boton para descargar el archivo subido por el usuario adoptante
  descargarArchivoProtocolo: document.querySelector(
    //Propiedad que representa el boton para descargar el archivo subido por el creador del protocolo
    "#descargarArchivoProtocolo"
  ),
}; //Objeto que define la estructura del contenedor para la información de unp paso

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
let socket;

const insertPreviousMessages = () => {
  Mensajes.forEach((mensaje) => {
    let formattedDate = new Date(mensaje.Fecha_Envio);
    formattedDate = getFormatedDate(formattedDate);
    insertNewMensaje(
      mensaje.Texto,
      mensaje.Usuario_Remitente,
      formattedDate,
      socket
    );
  });
};
socket = initSocket(insertPreviousMessages);

function emitConnectionData() {
  socket.emit("join-proceso", MascotaID);
  console.log("Emitting connection data...");
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
            // socket.
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
  if (idUltimoCompletado < pasos.length - 1) {
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
      archivoPasoSubido = PasosProceso[idPaso].PasoProceso[0].Archivo;
    } else {
      infoPasoProceso.descargarArchivoSubido.classList.add("d-none");
      archivoPasoSubido = "";
    }

    if (PasosProceso[idPaso].PasoProceso[0].Completado == tipo) {
      infoPasoProceso.infoPasoProceso.querySelector(
        "#pasoCompletado"
      ).checked = 1;
    } else {
      infoPasoProceso.infoPasoProceso.querySelector(
        "#pasoCompletado"
      ).checked = 0;
    }
    if (PasosProceso[idPaso].PasoProceso[0].Completado == 1) {
      infoPasoProceso.infoPasoProceso.classList.add(
        "pasoActualCompletadoDueno"
      );
      infoPasoProceso.infoPasoProceso.classList.remove(
        "pasoActualCompletadoAdoptante"
      );
    }
    if (PasosProceso[idPaso].PasoProceso[0].Completado == 2) {
      infoPasoProceso.infoPasoProceso.classList.remove(
        "pasoActualCompletadoDueno"
      );
      infoPasoProceso.infoPasoProceso.classList.add(
        "pasoActualCompletadoAdoptante"
      );
      infoPasoProceso.infoPasoProceso.classList.remove(
        "pasoActualCompletadoAmbos"
      );
    }
    if (PasosProceso[idPaso].PasoProceso[0].Completado == 0) {
      infoPasoProceso.infoPasoProceso.classList.remove(
        "pasoActualCompletadoDueno"
      );
      infoPasoProceso.infoPasoProceso.classList.remove(
        "pasoActualCompletadoAdoptante"
      );
      infoPasoProceso.infoPasoProceso.classList.remove(
        "pasoActualCompletadoAmbos"
      );
      infoPasoProceso.infoPasoProceso.querySelector(
        "#pasoCompletado"
      ).checked = 0;
    }
    if (PasosProceso[idPaso].PasoProceso[0].Completado == 3) {
      infoPasoProceso.infoPasoProceso.classList.remove(
        "pasoActualCompletadoDueno"
      );
      infoPasoProceso.infoPasoProceso.classList.remove(
        "pasoActualCompletadoAdoptante"
      );

      infoPasoProceso.infoPasoProceso.classList.add(
        "pasoActualCompletadoAmbos"
      );
    }
  });
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
    let dateTime = getFormatedDate(today);
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

function getFormatedDate(dateToFormat) {
  let date =
    dateToFormat.getFullYear() +
    "-" +
    (dateToFormat.getMonth() + 1) +
    "-" +
    dateToFormat.getDate();
  let time =
    dateToFormat.getHours() +
    ":" +
    dateToFormat.getMinutes() +
    ":" +
    dateToFormat.getSeconds();
  let dateTime = date + " " + time;
  return dateTime;
}

socket.on("mensaje-chat-proceso", ({ message, userID, fecha }) => {
  insertNewMensaje(message, userID, fecha, socket);
});

socket.on("paso-completado", ({ Completado, idPasoAfectado }) => {
  PasosProceso[idPasoAfectado].PasoProceso[0].Completado = Completado;
  if (Completado == 1 || Completado == 2) {
    pasos[idPasoAfectado].click();
  } else if (Completado == 3) {
    pasos[idPasoAfectado].classList = pasoCompletado.classList;
    if (idPasoAfectado < PasosProceso.length - 1) {
      pasos[Number(idPasoAfectado) + 1].classList = pasoActivo.classList;
      infoPasoProceso.header.querySelector("div").textContent =
        "Paso Completado";
      infoPasoProceso.header
        .querySelector("#pasoCompletado")
        .parentElement.classList.add("d-none");
    }
  }
});

function insertNewMensaje(message, userID, fecha, socket) {
  let newMessage;
  let newContentParagraph;

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
  chatBox.scrollTop = chatBox.scrollHeight;
}
