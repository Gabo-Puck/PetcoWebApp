const Notificaciones = require("../models/Notificaciones");
const { getDateFormated } = require("./NotificacionesController");

Date.prototype.substractMonths = function (months) {
  var date = new Date(this.valueOf());
  date.setMonth(date.getMonth() - months);
  return date;
};

exports.deleteNotificacionesMeses = (fecha_exec) => {
  let fecha = getDateFormated(fecha_exec);
  let date2 = new Date(fecha);
  date2 = date2.substractMonths(2);
  console.log(date2);
  Notificaciones.query()
    .where("Fecha_Generacion", "<", date2)
    .then((notificacionesBorrar) => {
      console.log(
        `Notificaciones a borrar a partir de la fecha: ${date2.toLocaleDateString(
          "es-MX"
        )} ${date2.toLocaleTimeString("es-MX")}`
      );
      console.log(`Fecha de ejecución ${fecha}`);
      console.log(notificacionesBorrar);
      let promises = [];
      notificacionesBorrar.forEach((notificacion) => {
        promises.push(promisesBorrarNotificacion(notificacion));
      });
      Promise.all(promises).then(() => {
        console.log(`${notificacionesBorrar.length} notificaciones borradas`);
      });
    });
};

function promisesBorrarNotificacion(notificacion) {
  return new Promise((resolve, reject) => {
    resolve(notificacion.$query().delete());
  });
}
