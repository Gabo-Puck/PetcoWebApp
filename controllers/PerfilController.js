var Registro = require("../models/Registro");
var Usuario = require("../models/Usuario");
var Municipio = require("../models/Municipio");
var objection = require("objection");
const Publicacion = require("../models/Publicacion");

//Configuracion de paypal
const paypal = require("paypal-rest-sdk");
const Donaciones = require("../models/Donaciones");
const Like = require("../models/Like");
const Publicacion_Guardada = require("../models/Publicacion_Guardada");
const Reporte_Publicacion = require("../models/Reporte_Publicacion");

paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id:
    "AYL9M1NxDLdbFrVbI6gzwbjtOzC_PRhxP6vn65xWqmaqZA8uKDv6mmKvkKqEBIqUe2cNWBXCezt-CG85",
  client_secret:
    "EP0JlIun8tIoxFQjUjho4CfyPdF-6A042JxLl4EjyjZQIH3g50DuopJcLynP4z4mTDjuxACCye40Hi-p",
});
let idOrganizacion;
let idr;
let correopago = "";
let aporte = 3;
let today = new Date();
let date =
  today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
let time =
  today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
let dateTime = date + " " + time;

console.log(dateTime);

exports.pagina = (req, res, next) => {
  idOrganizacion = req.params.idUsuario;
  Usuario.query()
    .withGraphJoined("UsuarioRegistro")
    .where("usuario.ID", "=", req.params.idUsuario)
    .then((result) => {
      if (result === undefined) {
        res.redirect("/login");
      } else {
        idu = result[0].UsuarioRegistro.ID;
        Publicacion.query()
          .where("publicacion.ID_Usuario", "=", req.params.idUsuario)
          .withGraphJoined("Mascota.MascotasPublicacion")
          .withGraphJoined("Mascota.MascotasEstado")
          .withGraphJoined("Mascota.MascotasImagenes")
          .then((resultado) => {
            let mascotasUsuario = new Array();
            let contador = 0;

            for (let i = 0; i < resultado.length; i++) {
              for (let j = 0; j < resultado[i].Mascota.length; j++) {
                console.log(resultado[i].Mascota[j]);
                mascotasUsuario[contador] = resultado[i].Mascota[j];
                contador++;
              }
            }

            console.log(
              "🚀 ~ file: PerfilController.js ~ line 26 ~ .then ~ mascotasUsuario",
              mascotasUsuario
            );
            mascotasUsuario.reverse();

            res.render("perfil.ejs", {
              user: result,
              idUsuarioPublicacion: req.params.idUsuario,
              MascotaRender: mascotasUsuario,
              Tipo: req.session.Tipo,
            });
          });
      }
    });
};

// exports.fetchPaypalDonation = (req, res, next) => {
//     aporte=req.params.Cantidad;
//     console.log("🚀 ~ file: PerfilController.js ~ line 80 ~ aporte", aporte)
//     idOrganizacion= req.params.idDonante;
//     console.log("🚀 ~ file: PerfilController.js ~ line 82 ~ idOrganizacion", idOrganizacion)
//     res.json("Se hizo el Json");

// }

exports.pay = (req, res) => {
  console.log(req.body);
  aporte = req.body.cantidad;
  console.log("🚀 ~ file: PerfilController.js ~ line 102 ~ aporte", aporte);

  Registro.query()
    .withGraphJoined("RegistroUsuario")
    .where("RegistroUsuario.FK_Registro", "=", idu)
    .then((query) => {
      //id organizacion
      correopago = query[0].Correo;
      console.log(query[0].Correo);

      const create_payment_json = {
        intent: "sale",

        payer: {
          payment_method: "paypal",
        },

        redirect_urls: {
          return_url: "http://localhost:3000/petco/perfil/successP",
          cancel_url: "http://localhost:3000/petco/perfil/cancelP",
        },
        transactions: [
          {
            item_list: {
              items: [
                {
                  name: "Aportacion a meta",
                  sku: "001",
                  price: aporte,
                  currency: "MXN",
                  quantity: 1,
                },
              ],
            },
            amount: {
              currency: "MXN",
              total: aporte,
            },
            payee: { email: query[0].Correo },
          },
        ],
      };

      paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
          throw error;
        } else {
          for (let i = 0; i < payment.links.length; i++) {
            if (payment.links[i].rel === "approval_url") {
              res.redirect(payment.links[i].href);
            }
          }
        }
      });
    });
};

exports.paysuccess = (req, res) => {
  Donaciones.query()
    .insert({
      ID_Organizacion: parseInt(idOrganizacion),
      ID_Usuario: req.session.IdSession,
      Cantidad: aporte,
      Fecha: dateTime,
    })
    .then((registroCreado) => {
      Usuario.query()
        .withGraphFetched("UsuarioRegistro")
        .findOne({ "usuario.ID": req.session.IdSession })
        .then((usuarioFind) => {
          let descripcion = `¡${usuarioFind.UsuarioRegistro.Nombre} te ha donado ${aporte}!`;
          let origen = "aquí va la url de donde se ven las donaciones";
          sendNotificacion(descripcion, origen, idOrganizacion, req.app.io);
        });
      console.log(registroCreado);
    });

  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;

  const execute_payment_json = {
    payer_id: payerId,
    transactions: [
      {
        amount: {
          currency: "MXN",
          total: aporte,
        },
      },
    ],
  };

  paypal.payment.execute(
    paymentId,
    execute_payment_json,
    function (error, payment) {
      if (error) {
        console.log(error.response);
        throw error;
      } else {
        console.log(JSON.stringify(payment));
        res.send("Success");
      }
    }
  );
};

exports.paycancel = (req, res) => {
  res.send("Cancelled");
};
