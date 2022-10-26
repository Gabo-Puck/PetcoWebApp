export function addNotificacion(descripcion, fecha, origen) {
  const notificacionTemplate = document.querySelector(".notificacionTemplate");
  const notificacionesContainer = document.querySelector(
    "#notificacionesContainer"
  );
  let newNotificacion = notificacionTemplate.cloneNode(true);
  newNotificacion.classList.remove("d-none");
  newNotificacion.href = origen;
  newNotificacion.querySelector(".descripcionNotificacion").textContent =
    descripcion;
  let fechaFormat = new Date(fecha);
  fechaFormat = getFormatedDate(fechaFormat);
  newNotificacion.querySelector(".fechaNotificacion").textContent = fechaFormat;
  notificacionesContainer.appendChild(newNotificacion);
}

export function retrieveNotificaciones() {
  fetch("/petco/notificaciones")
    .then((res) => res.json())
    .then((notificaciones) => {
      notificaciones.forEach((notificacion) => {
        addNotificacion(
          notificacion.Descripcion,
          notificacion.Fecha_Generacion,
          notificacion.Origen
        );
      });
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
