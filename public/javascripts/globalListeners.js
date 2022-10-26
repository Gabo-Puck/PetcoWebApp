import { addNotificacion } from "/javascripts/notificacionesUtils.js"; //Importamos la función para inicilizar el socket

export function notificacionNueva() {
  socket.on("notificacion-nueva", (notificacion) => {
    console.log("Nueva notificacion", notificacion);
    addNotificacion(notificacion);
    const notificacionesSinLeerCountSpan = document.querySelector(
      "#notificacionesSinLeerCount"
    );
    if (countNotificacionesNoLeidas > 0 && countNotificacionesNoLeidas <= 99) {
      notificacionesSinLeerCountSpan.classList.remove("d-none");
      notificacionesSinLeerCountSpan.textContent = countNotificacionesNoLeidas;
    }
    if (countNotificacionesNoLeidas > 99) {
      notificacionesSinLeerCountSpan.classList.remove("d-none");
      notificacionesSinLeerCountSpan.textContent = "+99";
    }
  });
}
