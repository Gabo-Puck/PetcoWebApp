import { loadingScreen } from "/javascripts/FormulariosFunctions.js";

const loadingScreenLayer = document.querySelector(".loadingScreenLayer");
const exampleModal = document.getElementById("modalRegistroView");
const DocumentosIdentidadImagenes = document.querySelector(
  ".DocumentosIdentidadImagenes"
);

const aceptarRegistroListaPendiente = document.querySelector(
  "#aceptarRegistroListaPendiente"
);
const devolverRegistroListaPendiente = document.querySelector(
  "#devolverRegistroListaPendiente"
);

const enviarRazon = document.querySelector("#enviarRazon");
const textareaRazon = document.querySelector("#textareaRazonListaRegistros");

const defaultTimer = 400;

const eventoRemoveRegistroLista = new Event("registro-removido");
let actualID;
exampleModal.addEventListener("show.bs.modal", (event) => {
  // Button that triggered the modal
  const button = event.relatedTarget;
  // Extract info from data-bs-* attributes
  const idRegistro = button.getAttribute("data-bs-whatever").split("-")[1];
  // If necessary, you could initiate an AJAX request here
  // and then do the updating in a callback.
  //
  // Update the modal's content.
  const modalTitle = exampleModal.querySelector(".modal-title");
  const modalBodyInput = exampleModal.querySelector(".modal-body input");

  loadingScreenLayer.classList.remove("d-none");
  setTimeout(() => {
    getRegistroData(idRegistro);
  }, defaultTimer);
});

enviarRazon.addEventListener("click", (e) => {
  let id = actualID.split("-")[1];
  let value = { razon: textareaRazon.value };
  let newFormData = new FormData();
  newFormData.append("razon", value);
  if (value.length < 10) {
    Swal.fire({
      title: "¡Aviso!",
      html: "<p>La razon tiene que tener por lo menos 10 caracteres</p>",
      icon: "warning",
      confirmButtonText: "Ok",
    });
    return;
  }
  loadingScreen.fire();
  setTimeout(() => {
    enviarRazonCallback(value, id);
  }, defaultTimer);
});

const enviarRazonCallback = (value, id) => {
  fetch(`/registro/devolver/${id}`, {
    method: "POST",
    body: JSON.stringify(value),
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
    .then((res) => res.json())
    .then((res) => {
      if (res == "ok") {
        Swal.fire({
          title: "¡Registro devuelto!",
          html: "Gracias por tu ayuda 💙",
          icon: "success",
          confirmButtonText: "Ok",
        });
      }
      if (res == "aprobadoPreviamente") {
        Swal.fire({
          title: "¡Este registro ya ha sido revisado!",
          html: "<p>Gracias por tu ayuda 💙</p>",
          icon: "info",
          confirmButtonText: "Ok",
        }).then((resp) => {
          Swal.close();
          let exampleModal = new bootstrap.Modal(
            document.getElementById("modalRegistroView")
          );
          exampleModal.hide();
        });
      }
      if (document.querySelector(`#${actualID}`)) {
        document.querySelector(`#${actualID}`).remove();
        exampleModal.dispatchEvent(eventoRemoveRegistroLista);
        count--;
      }
    })
    .catch((err) => {
      console.log(err);
      Swal.fire({
        title: "¡Algo ha salido mal!",
        html: "<p>Intenta más tarde</p>",
        icon: "info",
        confirmButtonText: "Ok",
      });
    });
};

const aceptarRegistro = (id) => {
  fetch(`/registro/aprobar/${id}`, { method: "POST" })
    .then((res) => res.json())
    .then((res) => {
      if (res == "ok") {
        Swal.fire({
          title: "¡Registro aprobado!",
          html: "Gracias por tu ayuda 💙",
          icon: "success",
          confirmButtonText: "Ok",
        });
      }
      if (res == "aprobadoPreviamente") {
        Swal.fire({
          title: "¡Este registro ya ha sido revisado!",
          html: "<p>Gracias por tu ayuda 💙</p>",
          icon: "info",
          confirmButtonText: "Ok",
        });
      }
      if (document.querySelector(`#${actualID}`)) {
        document.querySelector(`#${actualID}`).remove();
        count--;
        exampleModal.dispatchEvent(eventoRemoveRegistroLista);
      }
    })
    .catch((err) => {
      console.log(err);
      Swal.fire({
        title: "¡Algo ha salido mal!",
        html: "<p>Intenta más tarde</p>",
        icon: "info",
        confirmButtonText: "Ok",
      });
    });
};

aceptarRegistroListaPendiente.addEventListener("click", (e) => {
  let id = actualID.split("-")[1];
  loadingScreen.fire();

  setTimeout(() => {
    aceptarRegistro(id);
  }, defaultTimer);
});

function getRegistroData(idRegistro) {
  fetch(`/registro/getEstado/${idRegistro}`)
    .then((res) => res.json())
    .then((res) => {
      if (res == "failed") {
        console.log(res);
      } else {
        console.log(res);
        displayRegistroData(res.RegistroEncontrado, exampleModal);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function displayRegistroData(registro, modalRegistro) {
  let nombre = modalRegistro.querySelector("#NombreRegistroLista");
  let estado = modalRegistro.querySelector("#EstadoRegistroLista");
  let municipio = modalRegistro.querySelector("#MunicipioRegistroLista");

  let tipo = registro.Tipo_Usuario == 1 ? "headerOrganizacion" : "headerComun";

  let header = modalRegistro.querySelector(".modal-header");
  header.classList.remove("headerOrganizacion");
  header.classList.remove("headerComun");
  header.classList.add(tipo);

  nombre.textContent = registro.Nombre;
  estado.textContent = registro.muni.estado.Nombre;
  municipio.textContent = registro.muni.Nombre;
  loadingScreenLayer.classList.add("d-none");
  let documentosIdentidad = registro.Documento_Identidad.split(";");
  $(".DocumentosIdentidadImagenes").empty();

  documentosIdentidad.forEach((documento) => {
    if (documento !== "") {
      let image = document.createElement("img");
      image.src = documento;
      image.style.maxWidth = "50%";
      image.style.minWidth = "50%";
      image.classList.add("imgRegistroPendiente");

      image.addEventListener("click", (e) => {
        let url = e.target.src;
        window.open(url);
      });
      modalRegistro
        .querySelector(".DocumentosIdentidadImagenes")
        .appendChild(image);
    }
  });
  actualID = `r-${registro.ID}`;
}

exampleModal.addEventListener("registro-removido", (e) => {
  count--;
  let mainContainer = document.querySelector(".mainContainerListaRegistros");

  if (count == 0) {
    let aviso = document.querySelector(".avisoListaRegistros").cloneNode(true);
    aviso.classList.remove("d-none");
    mainContainer.appendChild(aviso);
    document.querySelector(".ListaRegistrosPendientes").classList.add("d-none");
  }
});
