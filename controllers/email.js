const nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "petcoorg5@gmail.com",
    pass: "mibaqlrqumnprusc",
  },
});

// transporter.sendMail();
exports.sendMail = (req, res, next) => {
  let message = {
    from: "petcoorg5@gmail.com",
    to: res.registroPatch.Correo,
    subject: res.subjectCorreo,
    html: res.htmlCorreo,
  };
  transporter
    .sendMail(message)
    .then((m) => {
      res.json("ok");
    })
    .catch((err) => {
      console.log(err);
      res.json("not ok");
    });
};

// let message = {
//   from: "petcoorg5@gmail.com",
//   to: "gesqueda66@gmail.com",
//   subject: "Prueba Petco",
//   text: "Hola!",
// };
// transporter.sendMail(message, function (err, info) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(info);
//   }
// });

// module.exports = transporter;
