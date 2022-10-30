import { loadingScreen } from "/javascripts/FormulariosFunctions.js";

export function handleResponse(res, url, message) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      loadingScreen.close();
      if (res == "ok") {
        Swal.fire({
          title: "Listo!",
          text: message,
          icon: "success",
          confirmButtonText: "Siguiente",
        }).then((sweetResult) => {
          if (sweetResult.isConfirmed) {
            window.location = url;
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
      if (res.errors && !res.globalError) {
        Swal.fire({
          title: "Atención!",
          text: "Hay un campo erroneo. Cambialo para poder crear la publicación",
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
