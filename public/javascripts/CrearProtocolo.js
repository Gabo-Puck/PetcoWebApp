import {
  removeItemOnce,
  loadingScreen,
  selectParent,
} from "/javascripts/FormulariosFunctions.js";

const buttonAddStep = document.querySelector(
  //Se define el boton de añadir un paso
  ".AddStep"
);

const buttonSaveProtocol = document.querySelector(
  //Se define el boton de salvar un protocolo
  ".agregar"
);

function autoSizeTextarea(textarea) {
  textarea.setAttribute(
    "style",
    "height:" + textarea.scrollHeight + "px;overflow-y:hidden;"
  );

  textarea.addEventListener(
    "input",
    (e) => {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    },
    false
  );
}
$(window).on("load", () => {
  pasos.forEach((paso) => {
    let newPaso = addPaso(
      document,
      paso.Titulo_Paso,
      paso.Descripcion,
      paso.DiasEstimados,
      paso.Archivo
    );
    newPaso.querySelectorAll("input,textarea").forEach((input) => {
      input.disabled = true;
    });
    newPaso.classList.add("default");
    newPaso.querySelector(".eliminarButtonPaso").remove();
  });
});

var pasoCount = 0;
function addPaso(
  document,
  Titulo = "",
  Descripcion = "",
  DiasEstimados = "",
  Archivo = ""
) {
  var newPaso = paso.cloneNode(true);
  newPaso.querySelector(".Titulo").id = `input${pasoCount}`;
  newPaso.querySelector(".Titulo").value = Titulo;
  pasoCount++;
  newPaso.querySelector(".Descripcion").id = `input${pasoCount}`;
  newPaso.querySelector(".Descripcion").value = Descripcion;
  pasoCount++;

  newPaso.querySelector(".DiasEstimados").id = `input${pasoCount}`;
  newPaso.querySelector(".DiasEstimados").value = DiasEstimados;

  pasoCount++;
  newPaso.querySelector(".Archivo").id = `input${pasoCount}`;
  newPaso.querySelector(".Archivo").value = "";
  pasoCount++;

  document
    .querySelector(".Enviar")
    .insertBefore(newPaso, document.querySelector(".AddStep")); //Clona los elementos
  autoSizeTextarea(newPaso.querySelector(".Descripcion"));
  autoSizeTextarea(newPaso.querySelector(".Titulo"));

  let buttonDelete = newPaso.querySelector(".eliminarButtonPaso");

  buttonDelete.addEventListener("click", () => {
    selectParent(buttonDelete, "Paso");
  });

  return newPaso;
}

buttonSaveProtocol.addEventListener("click", (e) => {
  var pasoguardado = []; //Se define un arreglo en el que se guardaran los pasos
  //Se instancian variables en la que se almacena el valor de un elemento html con el id correspondiente
  var ProtocoloT = document.querySelector("#Tprotocolo");
  var ProtocoloD = document.querySelector("#Dprotocolo");
  var ProtocoloF = document.querySelector("#formU");

  var arreglo = document.querySelectorAll(".Paso:not(.default)"); //Se instancia una variable en la que se almacenan los elementos html con la clase css correspondiente
  arreglo.forEach(
    (
      o //se recorre el arreglo para obtener los valores
    ) => {
      //console.log(o);
      //Se instancian las variables que obtendran los valores de la clase dentro del elemento html paso
      let titulo = o.querySelector(".Titulo");
      let descripcion = o.querySelector(".Descripcion");
      let DiasEstimados = o.querySelector(".DiasEstimados");
      let AceptaArchivo = o.querySelector(".AceptaArchivo");
      let AceptaArchivoName = o.querySelector('input[type="file"]').id;
      AceptaArchivo = AceptaArchivo.checked ? 1 : 0;
      // var Archivo = o.querySelector(".Archivo");

      //Inserta los valores con push dentro del arreglo dinamicamente
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
  );
  var formData = new FormData();
  formData.append("Titulo", ProtocoloT.value);
  formData.append("TituloID", ProtocoloT.id);
  formData.append("Descripcion", ProtocoloD.value);
  formData.append("DescripcionID", ProtocoloD.id);
  formData.append("ID_Formulario", ProtocoloF.value);
  formData.append("Pasos", JSON.stringify(pasoguardado));
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
    "/petco/protocolo/guardar",
    {
      method: "POST",
      body: formData,
    }
    //Se envia el objeto a la ruta determinada con el metodo posto dentro del body request
  )
    .then((res) => res.json())
    .then((res) => handleResponse(res))
    .then((res) => renderMessages(res.errors, res.globalError));
});

function handleResponse(res) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      loadingScreen.close();
      if (res == "ok") {
        Swal.fire({
          title: "Listo!",
          text: "Se ha guardado tu protocolo correctamente!",
          icon: "success",
          confirmButtonText: "Siguiente",
        }).then((sweetResult) => {
          if (sweetResult.isConfirmed) {
            window.location = "petco/dashboard";
          }
        });
      }
      if (res.globalError) {
        Swal.fire({
          title: "Atención!",
          text: res.globalError.gloabalMsg,
          icon: "warning",
          confirmButtonText: "Entendido",
        });
      }
      resolve(res);
    }, 1100);
  });
}
function renderMessages(errors, globalError) {
  console.log(errors);
  let inputsForms = document
    .querySelector("form")
    .querySelectorAll(
      "input:not(input:disabled):not(input[type='checkbox']),textarea:not(textarea:disabled)"
    );
  let inputsPasos = document
    .querySelector(".pasos")
    .querySelectorAll(
      "input:not(input:disabled):not(input[type='checkbox']),textarea:not(textarea:disabled)"
    );
  let inputs = [...inputsPasos, ...inputsForms];
  document.querySelectorAll(".invalid-feedback").forEach((node) => {
    node.remove();
  });
  document.querySelectorAll(".valid-feedback").forEach((node) => {
    node.remove();
  });
  document.querySelectorAll(".is-invalid").forEach((node) => {
    node.classList.remove("is-invalid");
  });
  document.querySelectorAll(".is-valid").forEach((node) => {
    node.classList.remove("is-valid");
  });
  if (errors) {
    errors.forEach((element) => {
      let input = document.querySelector(`#${element.formID}`);
      let newMessage = document.createElement("div");
      newMessage.innerText = element.msg;
      newMessage.classList.add("d-block", "invalid-feedback");
      insertAfter(input, newMessage);
      // removeItemOnce(inputs, input);
    });
  }
  inputs.forEach((input) => {
    let feedback = input.nextElementSibling;
    let newMessage = document.createElement("div");
    newMessage.innerText = "Bien!";
    newMessage.classList.add("d-block", "valid-feedback");
    if (feedback) {
      if (!feedback.classList.contains("invalid-feedback")) {
        insertAfter(input, newMessage);
      }
    } else {
      insertAfter(input, newMessage);
    }
  });
}

buttonAddStep.addEventListener("click", (e) => {
  addPaso(document);
});

function insertAfter(referenceNode, newNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
