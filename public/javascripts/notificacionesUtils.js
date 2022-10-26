export function addNotificacion(notificacion) {
  const notificacionTemplate = document.querySelector(".notificacionTemplate");
  const notificacionesContainer = document.querySelector(
    "#notificacionesContainer"
  );

  let newNotificacion = notificacionTemplate.cloneNode(true);
  newNotificacion.classList.remove("d-none");
  newNotificacion.href = notificacion.Origen;
  newNotificacion.querySelector(".descripcionNotificacion").textContent =
    notificacion.Descripcion;
  let fechaFormat = new Date(notificacion.Fecha_Generacion);
  fechaFormat = getFormatedDate(fechaFormat);
  newNotificacion.querySelector(".fechaNotificacion").textContent = fechaFormat;
  let first = notificacionesContainer.firstChild;
  if (first) {
    notificacionesContainer.insertBefore(newNotificacion, first);
  } else {
    notificacionesContainer.appendChild(newNotificacion);
  }
  if (notificacion.Leido == 0) {
    idNotificacionesNoLeidas.push(notificacion.ID);
    countNotificacionesNoLeidas++;
  }
}

export function retrieveNotificaciones() {
  fetch("/petco/notificaciones")
    .then((res) => res.json())
    .then((notificaciones) => {
      const notificacionesSinLeerCountSpan = document.querySelector(
        "#notificacionesSinLeerCount"
      );

      notificaciones.forEach((notificacion) => {
        addNotificacion(notificacion);
      });
      if (
        countNotificacionesNoLeidas > 0 &&
        countNotificacionesNoLeidas <= 99
      ) {
        notificacionesSinLeerCountSpan.classList.remove("d-none");
        notificacionesSinLeerCountSpan.textContent =
          countNotificacionesNoLeidas;
      }
      if (countNotificacionesNoLeidas > 99) {
        notificacionesSinLeerCountSpan.classList.remove("d-none");
        notificacionesSinLeerCountSpan.textContent = "+99";
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function getFormatedDate(dateToFormat) {
  let date =
    dateToFormat.getFullYear() +
    "-" +
    (dateToFormat.getMonth() + 1) +
    "-" +
    dateToFormat.getDate();
  let time =
    dateToFormat.getHours() +
    ":" +
    dateToFormat.getMinutes() +
    ":" +
    dateToFormat.getSeconds();
  let dateTime = date + " " + time;
  return dateTime;
}
