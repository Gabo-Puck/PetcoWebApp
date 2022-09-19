import {
  removeItemOnce,
  loadingScreen,
  retrieveParent,
  selectParent,
} from "/javascripts/FormulariosFunctions.js";

import {
  addPaso,
  renderMessages,
  handleResponse,
  autoSizeTextarea,
  insertAfter,
} from "/javascripts/PasoFunctions.js";

var pasoCount = 0;
var archivosEliminados = [];
var pasosEliminados = [];

const buttonAddStep = document.querySelector(
  //Se define el boton de añadir un paso
  ".AddStep"
);

const buttonSaveProtocol = document.querySelector(
  //Se define el boton de salvar un protocolo
  ".agregar"
);

$(window).on("load", () => {
  pasos.forEach((paso) => {
    let newPaso = addPaso(
      document,
      pasoCount,
      paso.Titulo_Paso,
      paso.Descripcion,
      paso.DiasEstimados,
      paso.Archivo
    );
    newPaso.newPaso.querySelectorAll("input,textarea").forEach((input) => {
      input.disabled = true;
    });
    newPaso.newPaso.querySelector(".eliminarButtonPaso").remove();
    newPaso.newPaso.classList.add("default");
    pasoCount = newPaso.pasoCount;
  });
  protocolo.Pasos.forEach((paso) => {
    let newPaso = addPaso(
      document,
      pasoCount,
      paso.Titulo_Paso,
      paso.Descripcion,
      paso.DiasEstimados,
      paso.Archivo,
      paso.AceptaArchivo
    );
    if (paso.Archivo != "") {
      let publicFolder = paso.Archivo.split("\\", 2)[0];

      let archivo = document.createElement("a");
      archivo.classList.add("btn", "btn-info", "d-block", "verArchivo");
      let ArchivoEliminarButton = document.createElement("button");
      ArchivoEliminarButton.classList.add(
        "btn",
        "btn-danger",
        "d-block",
        "archivoEliminar"
      );
      ArchivoEliminarButton.innerText = "Eliminar archivo subido";
      ArchivoEliminarButton.classList.add("mt-3");
      ArchivoEliminarButton.type = "button";

      ArchivoEliminarButton.addEventListener("click", (e) => {
        let pasoDOM = retrieveParent(ArchivoEliminarButton, "Paso");
        if (pasoDOM.querySelector("a") != null) {
          archivosEliminados.push({ ID: paso.ID, path: paso.Archivo });
          // archivosEliminados[`f-${paso.ID}`] = paso.Archivo;
          pasoDOM.querySelector("a").remove();
        }
        console.log(archivosEliminados);
      });

      archivo.href = paso.Archivo.replace(`${publicFolder}\\`, "/");
      archivo.style.width = "50%";

      archivo.innerText = "Descargar archivo subido";
      archivo.download = "ArchivoPaso";
      archivo.classList.add("mt-3");
      let inputFile = newPaso.newPaso.querySelector("input[type='file']");
      // inputFile.value = "hola.pdf";
      insertAfter(inputFile, ArchivoEliminarButton);
      insertAfter(inputFile, archivo);
    }
    newPaso.newPaso.classList.add(`pasoCargado-${paso.ID}`);

    let buttonDelete = newPaso.newPaso.querySelector(".eliminarButtonPaso");

    buttonDelete.addEventListener("click", () => {
      pasosEliminados.push({
        ID: paso.ID,
        Titulo_Paso: paso.Titulo_Paso,
        Descripcion: paso.Descripcion,
        DiasEstimados: paso.DiasEstimados,
        Archivo: paso.Archivo,
        AceptaArchivo: paso.AceptaArchivo,
      });
      selectParent(buttonDelete, "Paso");
    });
    pasoCount = newPaso.pasoCount;
  });
});

buttonSaveProtocol.addEventListener("click", (e) => {
  var pasoguardado = []; //Se define un arreglo en el que se guardaran los pasos
  //Se instancian variables en la que se almacena el valor de un elemento html con el id correspondiente
  var ProtocoloT = document.querySelector("#Tprotocolo");
  var ProtocoloD = document.querySelector("#Dprotocolo");
  var ProtocoloF = document.querySelector("#formU");
  var arreglo = document.querySelectorAll(".Paso:not(.default)"); //Se instancia una variable en la que se almacenan los elementos html con la clase css correspondiente
  arreglo.forEach(
    (
      paso //se recorre el arreglo para obtener los valores
    ) => {
      //console.log(paso);
      //Se instancian las variables que obtendran los valores de la clase dentro del elemento html paso
      let titulo = paso.querySelector(".Titulo");
      let descripcion = paso.querySelector(".Descripcion");
      let DiasEstimados = paso.querySelector(".DiasEstimados");
      let AceptaArchivo = paso.querySelector(".AceptaArchivo");
      let AceptaArchivoName = paso.querySelector('input[type="file"]').id;
      AceptaArchivo = AceptaArchivo.checked ? 1 : 0;

      // var Archivo = o.querySelector(".Archivo");
      let classList = paso.classList;
      classList.forEach((item) => {
        if (item.includes("pasoCargado")) {
          console.log(item.split("-", 2)[1]);
          pasoguardado.push({
            ID: item.split("-", 2)[1],

            Titulo_Paso: titulo.value,
            Titulo_PasoID: titulo.id,

            Descripcion: descripcion.value,
            DescripcionID: descripcion.id,

            DiasEstimados: DiasEstimados.value,
            DiasEstimadosID: DiasEstimados.id,

            AceptaArchivo: AceptaArchivo,
            AceptaArchivoName: AceptaArchivoName,
          });
        }
        if (item.includes("pasoNuevo")) {
          pasoguardado.push({
            Titulo_Paso: titulo.value,
            Titulo_PasoID: titulo.id,

            Descripcion: descripcion.value,
            DescripcionID: descripcion.id,

            DiasEstimados: DiasEstimados.value,
            DiasEstimadosID: DiasEstimados.id,

            AceptaArchivo: AceptaArchivo,
            AceptaArchivoName: AceptaArchivoName,
          });
        }
      });

      //Inserta los valores con push dentro del arreglo dinamicamente
    }
  );
  var ContenidoEliminado = [];
  var formData = new FormData();
  formData.append("ID", protocolo.ID);
  formData.append("Titulo", ProtocoloT.value);
  formData.append("TituloID", ProtocoloT.id);
  formData.append("Descripcion", ProtocoloD.value);
  formData.append("DescripcionID", ProtocoloD.id);
  formData.append("ID_Formulario", ProtocoloF.value);
  formData.append("Pasos", JSON.stringify(pasoguardado));
  formData.append("pasosEliminados", JSON.stringify(pasosEliminados));
  formData.append("ArchivosEliminados", JSON.stringify(archivosEliminados));
  document
    .querySelectorAll("input[type='file']:not(input[disabled])")
    .forEach((element) => {
      formData.append(`${element.id}`, element.files[0]);
    });

  console.log(JSON.stringify(pasoguardado));

  //Se almacenan todos los valores conseguidos dentro de un objeto de JS
  var ProtocoloTodo = {
    Titulo: ProtocoloT.value,
    TituloID: ProtocoloT.id,
    Descripcion: ProtocoloD.value,
    DescripcionID: ProtocoloD.id,
    ID_Formulario: ProtocoloF.value,
    Pasos: JSON.stringify(pasoguardado),
  };
  loadingScreen.fire();
  fetch(
    "/petco/protocolo/guardarEditar",
    {
      method: "POST",
      body: formData,
    }
    //Se envia el objeto a la ruta determinada con el metodo posto dentro del body request
  )
    .then((res) => res.json())
    .then((res) => handleResponse(res))
    .then((res) => renderMessages(document, res.errors, res.globalError));
});

buttonAddStep.addEventListener("click", (e) => {
  let newPaso = addPaso(document, pasoCount);
  newPaso.newPaso.classList.add("pasoNuevo");
  let buttonDelete = newPaso.newPaso.querySelector(".eliminarButtonPaso");

  buttonDelete.addEventListener("click", () => {
    selectParent(buttonDelete, "Paso");
  });
  pasoCount = newPaso.pasoCount;
  pasoCount = newPaso.pasoCount;
});
