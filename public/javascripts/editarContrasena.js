import { loadingScreen } from "/javascripts/FormulariosFunctions.js";
const contrasenaFieldText = document.getElementsByName("Contrasena")[0];
const contrasenaVerFieldText = document.getElementsByName("ContrasenaVer")[0];
const enviarButton = document.getElementById("enviar");

enviarButton.addEventListener("click", (e) => {
  e.preventDefault();
  let isValid = true;
  if (contrasenaFieldText.value == "") {
    isValid = false;
    sendNegativeFeedback(
      "Introduce una contraseña valida",
      contrasenaFieldText
    );
  } else {
    sendPositiveFeedback("Bien!", contrasenaFieldText);
  }
  if (contrasenaVerFieldText.value == "") {
    isValid = false;
    sendNegativeFeedback(
      "Introduce una contraseña valida",
      contrasenaVerFieldText
    );
  } else {
    sendPositiveFeedback("Bien!", contrasenaVerFieldText);
  }

  if (isValid) {
    loadingScreen.fire();
    setTimeout(() => {
      cambiarContrasena();
    }, 400);
  }
});

function cambiarContrasena() {
  let body = {
    Contrasena: contrasenaFieldText.value,
    ContrasenaVer: contrasenaVerFieldText.value,
    id: id,
  };
  fetch(`/login/editarContrasena`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .then((res) => {
      loadingScreen.close();
      if (res == "ok") {
        //do stuff when correct
        Swal.fire({
          title: "Listo!",
          text: `Se ha cambiado correctamente tu contraseña`,
          icon: "success",
          allowOutsideClick: false,

          confirmButtonText: "Entendido",
        }).then((sweetResult) => {
          if (sweetResult.isConfirmed) {
            window.location = "/login";
          }
        });
      }
      if (res.error) {
        sendPositiveFeedback("Bien!", contrasenaFieldText);
        sendPositiveFeedback("Bien!", contrasenaVerFieldText);
        res.error.forEach((error) => {
          let item = document.getElementsByName(`${error.param}`)[0];
          sendNegativeFeedback(error.msg, item);
        });
        return;
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function sendNegativeFeedback(message, campo) {
  let feedback = campo.parentElement.querySelector(".feedback");
  feedback.textContent = message;
  feedback.classList.add("invalid-feedback");
  feedback.classList.remove("valid-feedback");

  campo.classList.remove("is-invalid");
  campo.classList.add("is-invalid");
}

function sendPositiveFeedback(message, campo) {
  let feedback = campo.parentElement.querySelector(".feedback");
  feedback.textContent = message;
  feedback.classList.remove("invalid-feedback");
  feedback.classList.add("valid-feedback");
  campo.classList.add("is-valid");
  campo.classList.remove("is-invalid");
}
