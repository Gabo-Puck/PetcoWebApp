import {
  removeItemOnce,
  loadingScreen,
  retrieveParent,
} from "/javascripts/FormulariosFunctions.js";

export function addPaso(
  document,
  pasoCount,

  Titulo = "",
  Descripcion = "",
  DiasEstimados = 1,
  Archivo = "",
  AceptaArchivo = 0
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

  newPaso.querySelector(".AceptaArchivo").checked =
    AceptaArchivo == 0 ? false : true;

  document
    .querySelector(".Enviar")
    .insertBefore(newPaso, document.querySelector(".AddStep")); //Clona los elementos
  autoSizeTextarea(newPaso.querySelector(".Descripcion"));
  autoSizeTextarea(newPaso.querySelector(".Titulo"));

  // let buttonDelete = newPaso.querySelector(".eliminarButtonPaso");

  // buttonDelete.addEventListener("click", () => {
  //   eliminadosPasos.push({
  //     Titulo_Paso: Titulo,
  //     Descripcion: Descripcion,
  //     DiasEstimados: DiasEstimados,
  //     Archivo: Archivo,
  //     AceptaArchivo: AceptaArchivo,
  //   });
  //   selectParent(buttonDelete, "Paso");
  // });

  return { newPaso: newPaso, pasoCount: pasoCount };
}

export function handleResponse(res) {
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
            window.location = "ok";
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

export function renderMessages(document, errors, globalError) {
  console.log(errors);
  let inputs = document
    .querySelector("form")
    .querySelectorAll(
      "input:not(input:disabled):not(input[type='checkbox']),textarea:not(textarea:disabled)"
    );

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

export function autoSizeTextarea(textarea) {
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

export function insertAfter(referenceNode, newNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
