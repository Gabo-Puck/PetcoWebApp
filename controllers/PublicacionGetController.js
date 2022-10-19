var Registro = require("../models/Registro");
var Usuario = require("../models/Usuario");
var Municipio = require("../models/Municipio");
var objection = require("objection");
const Mascota = require("../models/Mascota");
const Publicacion = require("../models/Publicacion");
const Metas = require("../models/Metas");
const Comentario = require("../models/Comentario");

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

exports.query = (req, res) => {

  Like.query()
    .where('like.ID_Publicacion', '=', req.params.idPublicacion)

    .then((LikesP) => {


      Comentario.query()
        .withGraphJoined('ComentariosPublicacion')
        .withGraphJoined('ComentariosUsuario.UsuarioRegistro')
        .where('comentario.ID_Publicacion', '=', req.params.idPublicacion)
        .orderBy('Fecha_Envio', "desc")
        .then((result) => {

          Mascota.query()
            .withGraphJoined("MP.PublicacionUsuario.[UsuarioRegistro]")
            .withGraphJoined("MascotasCastrado")
            .withGraphJoined("MascotasTamano")
            .withGraphJoined("MascotasEspecie")
            .withGraphJoined("MascotasVacunas")
            .withGraphJoined("MascotasSalud")
            .withGraphJoined("MascotasEstado")
            .withGraphJoined("MascotasImagenes")
            .withGraphJoined("MascotasMetas.MetasDonaciones")
            .where("mascota.ID_Publicacion", "=", req.params.idPublicacion)
            .then((MascotaP) => {

              Registro.query()
                .withGraphJoined('RegistroUsuario')
                .where('RegistroUsuario.ID', '=', req.session.IdSession)
                .then((resultados) => {
                  res.render("publicacion.ejs", {
                    MascotaRender: MascotaP,
                    usuario: resultados,
                    comentarios: result,
                    likesp: LikesP,
                  });

                })
            });

        })

    })


};

exports.likes = (req, res) => {

  if (req.params.accion == 0) {

    Like.query()
      .where('like.ID_Publicacion', '=', req.params.idP)
      .andWhere('like.ID_Usuario', '=', req.params.idU)
      .then((resp) => {
        console.log(resp);
        console.log(req.params)
        res.json(resp);

      })
  }


  if (req.params.accion == 1) {

    Like.query()
      .insert({
        ID_Publicacion: req.params.idP,
        ID_Usuario: req.params.idU,
      })
      .then((resp) => { })

    res.json("Se agrego");

  }

  if (req.params.accion == 2) {
    Like.query()
      .delete()
      .where('like.ID_Publicacion', '=', req.params.idP)
      .andWhere('like.ID_Usuario', '=', req.params.idU)
      .then();
    res.json("Se Borro");

  }

}

exports.psaveds = (req, res) => {
  //Buscar coincidencias
  if (req.params.accion == 0) {
    Publicacion_Guardada.query()
      .where('publicacion_guardada.ID_Publicacion', '=', req.params.idP)
      .andWhere('publicacion_guardada.ID_Usuario', '=', req.params.idU)
      .then((resp) => {
        console.log(resp);
        console.log(req.params)
        res.json(resp);
      })
  }

  if (req.params.accion == 1) {

    Publicacion_Guardada.query()
      .insert({
        ID_Publicacion: req.params.idP,
        ID_Usuario: req.params.idU,
      })
      .then((resp) => { })

    res.json("Se agrego");

  }

  if (req.params.accion == 2) {
    Publicacion_Guardada.query()
      .delete()
      .where('publicacion_guardada.ID_Publicacion', '=', req.params.idP)
      .andWhere('publicacion_guardada.ID_Usuario', '=', req.params.idU)
      .then();
    res.json("Se Borro");
  }
}

exports.reportar = (req, res) => {
  console.log(req.params);
  Reporte_Publicacion.query()
    .insert({
      razon: req.params.motivo,
      ID_Usuario_Reporta: req.params.usuarioreporta,
      ID_Usuario_Reportado: req.params.usuarioreportado,
      ID_Publicacion: req.params.publicacion

    })
    .then((resp) => { })

  Publicacion.query()
    .findOne({ ID: req.params.publicacion })
    .then((PublicacionFind) => {
    
      PublicacionFind.$query()
        .patch({ Reportes_Peso: parseInt(PublicacionFind.Reportes_Peso) + parseInt(req.params.peso) })
        .then(() => {

          if (PublicacionFind.Reportes_Peso >= 50)
          {
           
            PublicacionFind.$query()
            .patch({ Activo: 0 })
            .then(() => {})
            
          }

        });

    });

  // Publicacion.query()
  //   .where('publicacion.ID', "=", req.params.publicacion)
  //   .then((PublicacionObtenida) => { 

  //     //Actualizar Peso
  //     Publicacion.query()
  //     .where('publicacion.ID', "=", req.params.publicacion)
  //     .patch({
  //       Reportes_Peso: parseInt(PublicacionObtenida[0].Reportes_Peso) + parseInt(req.params.peso),
  //     })
  //     .then((PublicacionActualizada) => {

  //       if(PublicacionActualizada[0].Reportes_Peso)
  //       {}

  //     })

  //   })

  res.json("Se realizo el fetch");

}

//Controlar publicaciones
var aporte;
var meta;
var mensaje;
var idOrganizacion;
var correopago = "";
exports.donacionMetas = (req, res) => {
  //sacar correo pago

  Mascota.query()
    .withGraphJoined("MascotasPublicacion")
    .withGraphJoined("MascotasImagenes")
    .withGraphJoined("MascotasMetas.MetasDonaciones")
    .where("mascota.ID", "=", req.params.idMascota)
    .then((MascotaP) => {
      //id organizacion
      idOrganizacion = MascotaP[0].MascotasPublicacion.ID_Usuario;
      //console.log(MascotaP);
      meta = MascotaP[0].MascotasMetas.ID;
      res.render("donacionMascota.ejs", {
        MascotaRender: MascotaP,
      });
    });
};

exports.pay = (req, res) => {
  console.log(req.body);
  aporte = req.body.aporte;
  mensaje = req.body.mensaje;

  Registro.query()
    .withGraphJoined("RegistroUsuario")
    .where("RegistroUsuario.FK_Registro", "=", idOrganizacion)
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
          return_url: "http://localhost:3000/publicacion/success",
          cancel_url: "http://localhost:3000/publicacion/cancel",
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

  var today = new Date();
  var date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date + " " + time;
  console.log(dateTime);

  Donaciones.query()
    .insert({
      ID_Organizacion: idOrganizacion,
      ID_Usuario: req.session.IdSession,
      ID_Meta: meta,
      Cantidad: aporte,
      Fecha: dateTime,
      Mensaje: mensaje,
    })
    .then((registroCreado) => {
      console.log(registroCreado);
    });
};
exports.paycancel = (req, res) => {
  res.send("Cancelled");
};
