import { loadingScreen } from "/javascripts/FormulariosFunctions.js";

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

export function insertAfter(referenceNode, newNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
