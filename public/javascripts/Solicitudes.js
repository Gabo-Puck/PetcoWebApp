import { retrieveParent } from "/javascripts/FormulariosFunctions.js";

const offCanvasMenuMascotas = document.querySelector(".offcanvas-body");
const loadingSpinnerSolicitudes = document.querySelector(
  ".loadingSpinnerSolicitudes"
);
const cartaSolicitudTemplate = document.querySelector(".cardTemplateSolicitud");
const cardContainer = document.querySelector(".cardContainer");
const preguntaTemplateFormularioSolicitud = document.querySelector(
  ".preguntaTemplateFormularioSolicitud"
);
var activeBefore;
var defaultTimer = 400;

mascotas.forEach((mascota) => {
  let mascotaElement = document.createElement("button");
  mascotaElement.id = mascota.ID;
  let mascotaTexto = document.createElement("p");
  mascotaTexto.classList.add("my-auto", "mx-1");
  mascotaElement.classList.add(
    "d-flex",
    "flex-row-reverse",
    "justify-content-end"
  );
  let foto = document.createElement("div");
  foto.classList.add("rounded-circle", "fotoMascota");
  foto.style.backgroundImage = `url("${mascota.MascotasImagenes[0].Ruta.replaceAll(
    "\\",
    "/"
  )}")`;
  addEventListenerToMascotaButton(mascotaElement);
  mascotaElement.classList.add("mascotaMenuOffCanvas");
  mascotaTexto.textContent = mascota.Nombre;
  offCanvasMenuMascotas.appendChild(mascotaElement);
  mascotaElement.appendChild(mascotaTexto);
  mascotaElement.appendChild(foto);
});

function addEventListenerToMascotaButton(buttonMascota) {
  buttonMascota.addEventListener("click", (e) => {
    loadingSpinnerSolicitudes.parentNode.classList.remove("d-none");
    loadingSpinnerSolicitudes.parentNode.classList.add("d-block");
    setTimeout(() => {
      buttonMascota.classList.add("activeButtonMascota");
      fetch(`/petco/solicitudes/obtener/solicitudesMascota/${buttonMascota.id}`)
        .then((res) => {
          loadingSpinnerSolicitudes.parentNode.classList.remove("d-block");
          loadingSpinnerSolicitudes.parentNode.classList.add("d-none");
          if (activeBefore === undefined || activeBefore === buttonMascota) {
            activeBefore = buttonMascota;
          } else {
            activeBefore.classList.remove("activeButtonMascota");
            activeBefore = buttonMascota;
          }
          return new Promise((resolve, reject) => {
            resolve(res.json());
          });
        })
        .then((res) => {
          renderSolicitudes(res);
          console.log(res);
        })
        .catch((err) => console.log(err));
    }, defaultTimer);
  });
}

function renderAlert({ title, html, icon, url, params }) {
  return Swal.fire({
    title: title,
    html: html,
    icon: icon,
    allowOutsideClick: false,
    showConfirmButton: true,
    showCancelButton: true,
    confirmButtonText: "Si",
    cancelButtonText: "Cancelar",
  });
}

function aceptarSolicitud(idSolicitud, idMascota) {
  return fetch(`/solicitudes/aceptar/${idSolicitud}&${idMascota}`)
    .then((res) => res.json())
    .then((res) => {
      return new Promise((resolve, reject) => {
        return resolve(res);
      });
    });
}

function rechazarSolicitud(idSolicitud, idMascota) {
  return fetch(`/solicitudes/denegar/${idSolicitud}&${idMascota}`)
    .then((res) => res.json())
    .then((res) => {
      return new Promise((resolve, reject) => {
        if (res == "ok") {
          return resolve(res);
        }
      });
    });
}

function renderSolicitudes(solicitudes) {
  $(cardContainer).empty();
  solicitudes.forEach((solicitudFetch) => {
    const solicitud = cartaSolicitudTemplate.cloneNode(true);
    solicitud.querySelector(".nombreUsuario").textContent =
      solicitudFetch.Usuario.UsuarioRegistro.Nombre;
    solicitud.querySelector(".fotoPerfilSolicitud img").src =
      solicitudFetch.Usuario.Foto_Perfil;
    solicitud
      .querySelector(".aceptarButton")
      .setAttribute("id", solicitudFetch.ID);
    solicitud
      .querySelector(".rechazarButton")
      .setAttribute("id", solicitudFetch.ID);
    solicitud
      .querySelector(".progresoButton")
      .setAttribute("id", solicitudFetch.ID);
    addListenerToAceptar(solicitud.querySelector(".aceptarButton"));
    addListenerToRechazar(solicitud.querySelector(".rechazarButton"));
    addListenerToProceso(solicitud.querySelector(".progresoButton"));
    if (solicitudFetch.Estado == 1) {
      updateSolicitudes(solicitud.querySelector(".progresoButton"));
    }

    // solicitud
    //   .querySelector(".rechazarButton")
    //   .setAttribute("data-bs-solicitud", solicitudFetch.ID);
    // solicitud
    //   .querySelector(".progresoButton")
    //   .setAttribute("data-bs-solicitud", solicitudFetch.ID);
    solicitud
      .querySelector(".verSolicitudButton")
      .setAttribute("data-bs-solicitud", solicitudFetch.ID);
    solicitud.classList.remove("d-none");
    solicitud.classList.add("d-block");
    cardContainer.append(solicitud);
  });
}

function addListenerToAceptar(buttonTriggered) {
  buttonTriggered.addEventListener("click", (e) => {
    const mascotaID = document.querySelector(".activeButtonMascota").id;
    if (mascotaID) {
      var id = e.target.id;
      executeButtonFunction(
        renderAlert({
          title: "¿Desea aprobar esta solicitud?",
          html: "<p>Apruebe una solicitud para empezar el proceso de adopción</p>",
          icon: "info",
        }),
        aceptarSolicitud,
        id,
        mascotaID
      ).then((res) => {
        console.log(res);
        if (res.error) {
          return;
        }
        updateSolicitudes(buttonTriggered);
      });
    }
  });
}

function updateSolicitudes(buttonTriggered) {
  const parentCardTemplate = retrieveParent(
    buttonTriggered,
    "cardTemplateSolicitud"
  );
  parentCardTemplate.classList.remove("border-primary");
  parentCardTemplate.classList.add("border-warning");
  const aceptarButton = parentCardTemplate.querySelector(".aceptarButton");
  retrieveParent(aceptarButton, "row").remove();
  const progresoButton = parentCardTemplate.querySelector(".progresoButton");
  const parentRowProgresoButton = retrieveParent(progresoButton, "row");
  parentRowProgresoButton.classList.remove("d-none");
  // parentRowProgresoButton.classList.add("d-block");
}

function executeButtonFunction(prom, fun, idSolicitud, idMascota) {
  return new Promise((resolve, reject) => {
    resolve(
      prom
        .then((result) => {
          return new Promise((resolve, reject) => {
            if (result.isConfirmed) {
              resolve(fun(idSolicitud, idMascota));
            }
            if (result.isDismissed) {
              reject();
            }
          });
        })
        .then(
          (res) => {
            if (res == "ok") {
              Swal.fire("Correcto!", "", "success");
            }
            if (res.error) {
              Swal.fire("Error!", res.error, "error");
            }
            return res;
          },
          () => {
            return;
          }
        )
        .catch((err) => {
          Swal.fire(
            "¡Error!",
            "<p>Algo ha salido mal, intente más tarde</p>",
            "error"
          );
          return err;
        })
    );
  });
}

function addListenerToRechazar(buttonTriggered, idMascota) {
  buttonTriggered.addEventListener("click", (e) => {
    const mascotaID = document.querySelector(".activeButtonMascota").id;
    if (mascotaID) {
      var id = e.target.id;
      executeButtonFunction(
        renderAlert({
          title: "¿Desea rechazar esta solicitud?",
          html: "<p>Una vez denegada la solicitud, no podrá deshacer esta acción</p>",
          icon: "warning",
        }),
        rechazarSolicitud,
        id,
        mascotaID
      ).then((res) => {
        console.log(res);
        retrieveParent(buttonTriggered, "cardTemplateSolicitud").remove();
      });
    }
  });
}

function addListenerToProceso(buttonTriggered) {
  buttonTriggered.addEventListener("click", (e) => {
    const mascotaID = document.querySelector(".activeButtonMascota").id;
    window.open(`/petco/proceso/ver/${mascotaID}`);
  });
}

var solicitudRespuestasModal = document.getElementById(
  "solicitudRespuestasModal"
);
solicitudRespuestasModal.addEventListener("show.bs.modal", function (event) {
  // Button that triggered the modal
  var loadingModal = loadingSpinnerSolicitudes.parentNode.cloneNode(true);
  loadingModal.style.zIndex = "2000";
  loadingModal.classList.remove("d-none");
  loadingModal.classList.add("d-block");
  solicitudRespuestasModal.appendChild(loadingModal);
  var button = event.relatedTarget;
  var SolicitudID = button.getAttribute("data-bs-solicitud");
  setTimeout(() => {
    fetch(`/solicitudes/obtener/respuestasSolicitud/${SolicitudID}`)
      .then((res) => res.json())
      .then((preguntas) => {
        loadingModal.remove();
        renderPreguntasRespuestas(preguntas);
        console.log(preguntas);
      })
      .catch((err) => console.log(err));
  }, defaultTimer);

  // Extract info from data-bs-* attributes
  // // If necessary, you could initiate an AJAX request here
  // // and then do the updating in a callback.
  // //
  // // Update the modal's content.
  // var modalTitle = solicitudRespuestasModal.querySelector(".modal-title");
  // var modalBodyInput = solicitudRespuestasModal.querySelector(".modal-body input");

  // modalTitle.textContent = "New message to " + recipient;
  // modalBodyInput.value = recipient;
});

function renderPreguntasRespuestas(preguntas) {
  // solicitudRespuestasModal.classList.remove("d-none");
  let modalBody = solicitudRespuestasModal.querySelector(".modal-body");
  $(modalBody).empty();

  preguntas.forEach((pregunta) => {
    let preguntaContainer = preguntaTemplateFormularioSolicitud.cloneNode(true);
    preguntaContainer.classList.remove("d-none");
    let preguntaDom = (preguntaContainer.querySelector(
      ".preguntaFormularioSolicitud"
    ).textContent = pregunta.Pregunta);
    let respuestaContainer = preguntaContainer.querySelector(
      ".respuestasFormularioSolicitud"
    );
    pregunta.Respuestas.forEach((respuesta) => {
      let respuestaDom = document.createElement("li");
      respuestaDom.innerText = respuesta.Respuesta;
      respuestaDom.style.textDecoration = "underline";
      respuestaDom.classList.add("list-group-item");
      respuestaContainer.appendChild(respuestaDom);
    });
    modalBody.appendChild(preguntaContainer);
  });
}
