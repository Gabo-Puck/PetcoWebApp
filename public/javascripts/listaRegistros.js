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

const defaultTimer = 400;
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

aceptarRegistroListaPendiente.addEventListener("click", (e) => {
  let id = actualID.split("-")[1];
  fetch(`/registro/aprobar/${id}`, { method: "POST" })
    .then((res) => res.json())
    .then((res) => {
      if (res == "ok") {
        Swal.fire({
          title: "¡Registro aprobado!",
          html: "Gracias por tu ayuda <3",
          icon: "success",
          confirmButtonText: "Ok",
        });
      }
      if (res == "aprobadoPreviamente") {
        Swal.fire({
          title: "¡Este registro ya ha sido revisado!",
          html: "<p>Gracias por tu ayuda <3</p>",
          icon: "info",
          confirmButtonText: "Ok",
        });
      }
      document.querySelector(`#${actualID}`).remove();
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
