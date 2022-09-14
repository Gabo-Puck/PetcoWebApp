var Registro = require("../models/Registro");
var Usuario = require("../models/Usuario");
var Municipio = require("../models/Municipio");
var objection = require("objection");
const Mascota = require("../models/Mascota");
const Publicacion = require("../models/Publicacion");
const Metas = require("../models/Metas");

//Configuracion de paypal
const paypal = require('paypal-rest-sdk');
const Donaciones = require("../models/Donaciones");

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AYL9M1NxDLdbFrVbI6gzwbjtOzC_PRhxP6vn65xWqmaqZA8uKDv6mmKvkKqEBIqUe2cNWBXCezt-CG85',
    'client_secret': 'EP0JlIun8tIoxFQjUjho4CfyPdF-6A042JxLl4EjyjZQIH3g50DuopJcLynP4z4mTDjuxACCye40Hi-p'
});

exports.query = (req, res) => {
    

    Metas.query()
        .withGraphJoined('MetasDonaciones')
        .then((result) => {
            //console.log(result[0].MetasDonaciones);
        });

    Mascota.query()
        .withGraphJoined('MascotasPublicacion')
        .withGraphJoined('MascotasCastrado')
        .withGraphJoined('MascotasTamano')
        .withGraphJoined('MascotasEspecie')
        .withGraphJoined('MascotasVacunas')
        .withGraphJoined('MascotasSalud')
        .withGraphJoined('MascotasEstado')
        .withGraphJoined('MascotasImagenes')
        .withGraphJoined('MascotasMetas.MetasDonaciones')
        .where('Mascota.ID_Publicacion', '=', req.params.idPublicacion)
        //.findByIds({'MascotasPublicacion.ID':req.params.idPublicacion})
        .then((MascotaP) => {

            console.log(MascotaP[0].MascotasMetas.MetasDonaciones.length);
            res.render("publicacion.ejs", {
                MascotaRender: MascotaP,
            });

        });



}

//Controlar publicaciones
var aporte;
var meta;
var mensaje;
var idOrganizacion;
var correopago="";
exports.donacionMetas = (req, res) => {     

    //sacar correo pago
   
    Mascota.query()
    .withGraphJoined('MascotasPublicacion')
    .withGraphJoined('MascotasImagenes')
    .withGraphJoined('MascotasMetas.MetasDonaciones')
    .where('Mascota.ID_Publicacion', '=', req.params.idMascota)
    .then((MascotaP) => {
        //id organizacion
        idOrganizacion= MascotaP[0].MascotasPublicacion.ID_Usuario;
        //console.log(MascotaP);
        meta = req.params.idMascota;
        res.render("donacionMascota.ejs", {
            MascotaRender: MascotaP, 
        });

    });  

    

}

exports.pay = (req, res) => {
    console.log(req.body)
    aporte= req.body.aporte;
    mensaje =req.body.mensaje;
    

    Registro.query()
    .withGraphJoined('RegistroUsuario')
    .where('RegistroUsuario.FK_Registro', "=",idOrganizacion )
    .then((query) => {
        //id organizacion
        correopago =query[0].Correo;
        console.log(query[0].Correo);

    
    
    const create_payment_json = {
        "intent": "sale",
       

        "payer": {
            "payment_method": "paypal"
        },
         
        "redirect_urls": {
            "return_url": "http://localhost:3000/publicacion/success",
            "cancel_url": "http://localhost:3000/publicacion/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "Aportacion a meta",
                    "sku": "001",
                    "price": aporte,
                    "currency": "MXN",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "MXN",
                "total": aporte
            },
            "payee":{"email":query[0].Correo},

        }]
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
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


});  
}

exports.paysuccess = (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;

    const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "MXN",
                "total": aporte
            },
            
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


    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;    
    console.log(dateTime)

    Donaciones.query()
    .insert({
        ID_Organizacion: idOrganizacion,
        ID_Usuario: req.session.IdSession,
        ID_Meta: meta,
        Cantidad: aporte,
        Fecha: dateTime,
        Mensaje: mensaje
    })
    .then((registroCreado) => {
        console.log(registroCreado);
    });
}
exports.paycancel = (req, res) => {
    res.send('Cancelled')
}
