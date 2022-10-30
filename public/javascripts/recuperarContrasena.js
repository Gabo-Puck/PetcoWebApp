import { loadingScreen } from "/javascripts/FormulariosFunctions.js";
const correoFieldText = document.getElementsByName("correo")[0];
const enviarButton = document.getElementById("enviar");

enviarButton.addEventListener("click", (e) => {
  e.preventDefault();
  if (correoFieldText.value != "") {
    loadingScreen.fire();
    setTimeout(() => {
      sendEmail();
    }, 400);
  } else {
    sendNegativeFeedback("Introduce un correo");
  }
});

function sendEmail() {
  fetch(`/login/generarEmail/${correoFieldText.value}`)
    .then((res) => res.json())
    .then((res) => {
      loadingScreen.close();
      if (res == "ok") {
        //do stuff when correct
        Swal.fire({
          title: "Listo!",
          text: `Se ha mandado un correo a '${correoFieldText.value}' con las instrucciones para cambiar tu contraseña`,
          icon: "success",
          allowOutsideClick: false,

          confirmButtonText: "Entendido",
        }).then((sweetResult) => {
          if (sweetResult.isConfirmed) {
            window.location = "/login";
          }
        });
        return;
      }
      if (res.error) {
        sendNegativeFeedback(res.error);
        return;
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function sendNegativeFeedback(message) {
  let feedback = correoFieldText.parentElement.querySelector(".feedback");
  feedback.textContent = message;
  feedback.classList.add("invalid-feedback");
  feedback.classList.remove("valid-feedback");

  correoFieldText.classList.remove("is-invalid");
  correoFieldText.classList.add("is-invalid");
}

function sendPositiveFeedback(message) {
  let feedback = correoFieldText.parentElement.querySelector(".feedback");
  feedback.textContent = message;
  feedback.classList.remove("invalid-feedback");
  feedback.classList.add("valid-feedback");
  correoFieldText.classList.add("is-valid");
  correoFieldText.classList.remove("is-invalid");
}
