const Notificaciones = require("../models/Notificaciones");
const Usuario = require("../models/Usuario");

exports.sendNotificacion = (Descripcion, Origen, ID_Usuario, io) => {
  return new Promise((resolve, reject) => {
    console.log(Date.now());
    let dateNow = new Date(Date.now());
    let date = dateNow.toLocaleDateString("es-MX");
    let time = dateNow.toLocaleTimeString("es-MX");
    let date2 = date.split("/");
    let time2 = time.split(":");
    var dateFormatted = new Date(
      date2[2],
      date2[1] - 1,
      date2[0],
      time2[0],
      time2[1],
      time2[2]
    );
    var dateGeneracion =
      dateFormatted.getFullYear() +
      "-" +
      (dateFormatted.getMonth() + 1) +
      "-" +
      dateFormatted.getDate();
    var timeGeneracion =
      dateFormatted.getHours() +
      ":" +
      dateFormatted.getMinutes() +
      ":" +
      dateFormatted.getSeconds();
    var Fecha_Generacion = dateGeneracion + " " + timeGeneracion;
    console.log(`${date} ${time}`);
    console.log(`${Fecha_Generacion}`);
    if (Descripcion.length > 175) {
      Descripcion = Descripcion.slice(0, 170).concat("...");
      console.log(Descripcion);
    }
    Notificaciones.query()
      .insertAndFetch({
        Fecha_Generacion: Fecha_Generacion,
        Descripcion: Descripcion,
        Origen: Origen,
        ID_Usuario: ID_Usuario,
      })
      .then((notificacion) => {
        console.log(ID_Usuario);
        io.to(Number(ID_Usuario)).emit("notificacion-nueva", notificacion);
        resolve();
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.retrieveNotificaciones = (req, res, next) => {
  Notificaciones.query()
    .where("notificaciones.ID_Usuario", "=", req.session.IdSession)
    .then((notificacionesUsuario) => {
      res.json(notificacionesUsuario);
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

exports.patchLeidoNotificaciones = (req, res, next) => {
  let promisesNotificaciones = [];
  req.body.idNotificaciones.forEach((id) => {
    promisesNotificaciones.push(
      Notificaciones.query().findById(id).patch({ Leido: 1 })
    );
  });
  Promise.all(promisesNotificaciones)
    .then(() => res.json("ok"))
    .catch((err) => {
      console.log(err);
      next(err);
    });
};
