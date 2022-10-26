const Metas = require("../models/Metas");
const { sendNotificacion } = require("./NotificacionesController");

Metas.query()
  .withGraphJoined("[MetasDonaciones,Mascota]")
  .findById(34)
  .then((Meta) => {
    // console.log(Meta);
    let acumulado = 0;
    let cantidad = Meta.Cantidad;
    Meta.MetasDonaciones.forEach((donaciones) => {
      acumulado += donaciones.Cantidad;
    });
    // acumulado += 700;
    // console.log("Acumulado:", acumulado);
    if (acumulado >= cantidad) {
      Meta.$query()
        .patch({ Completado: 1 })
        .then(() => {
          let descripcion = `¡Felicidades! la meta de la mascota: "${Meta.Mascota.Nombre} se ha completado"`;
          let origen = "aqui va la url de las metas";
          let usuario = Meta.MetasDonaciones[0].ID_Organizacion;
          sendNotificacion(descripcion, origen, usuario);
        });
    }
  });
