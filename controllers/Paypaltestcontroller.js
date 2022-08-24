
var Formulario = require("../models/Formulario");
const paypal = require('paypal-rest-sdk'); //Se inicializa el uso de la api

paypal.configure({ //Configuracion de la api
  'mode': 'sandbox', //Se establece que modo se usa, sandbox (prueba) o live (produccion)
  'client_id': 'AYL9M1NxDLdbFrVbI6gzwbjtOzC_PRhxP6vn65xWqmaqZA8uKDv6mmKvkKqEBIqUe2cNWBXCezt-CG85', //ID del cliente
  'client_secret': 'EP0JlIun8tIoxFQjUjho4CfyPdF-6A042JxLl4EjyjZQIH3g50DuopJcLynP4z4mTDjuxACCye40Hi-p' //Secreto del cliente (un codigo)
});

//Metodo get que renderiza la pagina
exports.Main = (req, res) => {
  res.render("Paypal.ejs")
};



//Metodo post que ejecuta el pago
exports.Pago = (req, res) => {
  req.session.DonationValue =req.body.donation;
  console.log(req.session);

  const create_payment_json = {
    "intent": "sale",
    "payer": {
      "payment_method": "paypal"
    },
    "redirect_urls": {
      "return_url": "http://localhost:3000/paypaltest/success",
      "cancel_url": "http://localhost:3000/paypaltest/cancel"
    },
    "transactions": [{
      "item_list": {
        "items": [{
          "name": "Donation",
          "sku": "001",
          "price": req.body.donation,
          "currency": "MXN",
          "quantity": 1
        }]
      },
      "amount": {
        "currency": "MXN",
        "total": req.body.donation
      },
      "description": "Thanks for helping!"
    }]
  };

  paypal.payment.create(create_payment_json, function (error, payment) { //Crea y administra el error de la transaccion
    if (error) {
      throw error;
    } else {
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === 'approval_url') {
          res.redirect(payment.links[i].href);
        }
      }
    }
  });

};

//Metodo get que se ejecuta cuando el pago fue exitoso
exports.exito = (req, res) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;

  const execute_payment_json = {
    "payer_id": payerId,
    "transactions": [{
      "amount": {
        "currency": "MXN",
        "total": req.session.DonationValue
      }
    }]
  };

  paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
    if (error) {
      console.log(error.response);
      throw error;
    } else {
      console.log(JSON.stringify(payment));
      res.send('Success');
    }
  });

}

exports.fallo = (req, res) =>{
  res.send('Cancelled');
}