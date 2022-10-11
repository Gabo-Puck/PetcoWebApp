// const nodemailer = require("nodemailer");
// var transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: "petcoorg5@gmail.com",
//     pass: "mibaqlrqumnprusc",
//   },
// });

const Publicacion = require("../models/Publicacion");

// // let message = {
// //   from: "petcoorg5@gmail.com",
// //   to: "gesqueda66@gmail.com",
// //   subject: "Prueba Petco",
// //   text: "Hola!",
// // };
// // transporter.sendMail(message, function (err, info) {
// //   if (err) {
// //     console.log(err);
// //   } else {
// //     console.log(info);
// //   }
// // });

// module.exports = transporter;
Publicacion.query()
  .select(
    "publicacion.*",
    Publicacion.relatedQuery("PublicacionLike").count().as("numberOfLikes")
  )
  .orderBy("numberOfLikes", "desc")
  .then((resultado) => {
    console.log(
      "La primer publicacion tiene este numero de likes " +
        resultado[0].numberOfLikes
    );
    console.log("1" + resultado[0]);
  });
