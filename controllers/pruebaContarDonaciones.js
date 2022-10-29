// const Metas = require("../models/Metas");
// const { sendNotificacion } = require("./NotificacionesController");

const Registro = require("../models/Registro");
const { decrypt, encrypt } = require("../utils/cryptoUtils/randomId");
const { sendMail } = require("../controllers/email");

// Metas.query()
//   .withGraphJoined("[MetasDonaciones,Mascota]")
//   .findById(34)
//   .then((Meta) => {
//     // console.log(Meta);
//     let acumulado = 0;
//     let cantidad = Meta.Cantidad;
//     Meta.MetasDonaciones.forEach((donaciones) => {
//       acumulado += donaciones.Cantidad;
//     });
//     // acumulado += 700;
//     // console.log("Acumulado:", acumulado);
//     if (acumulado >= cantidad) {
//       Meta.$query()
//         .patch({ Completado: 1 })
//         .then(() => {
//           let descripcion = `¡Felicidades! la meta de la mascota: "${Meta.Mascota.Nombre} se ha completado"`;
//           let origen = "aqui va la url de las metas";
//           let usuario = Meta.MetasDonaciones[0].ID_Organizacion;
//           sendNotificacion(descripcion, origen, usuario);
//         });
//     }
//   });
// requestPassChange = (req, res, next) => {
// };
Registro.query()
  .withGraphJoined("RegistroUsuario")
  .findOne({ Correo: "skyshcoke@gmail.com" })
  .then((usuarioCorreo) => {
    console.log(usuarioCorreo);
    if (usuarioCorreo === undefined) {
      console.log("No correo encontrado");
    } else if (usuarioCorreo.RegistroUsuario === null) {
      console.log("No cuenta validada");
    } else {
      let idEncrypted = encrypt(usuarioCorreo.ID.toString());
      if (idEncrypted == "error") {
        console.log("error");
      } else {
        res.registroPatch.Correo = idEncrypted;
        console.log("id enc:", idEncrypted);
        let idDecrypted = decrypt(idEncrypted);
        console.log("id dec:", idDecrypted);
        console.log("link mandado");
      }
    }
  });
