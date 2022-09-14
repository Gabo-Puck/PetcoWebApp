var Intereses = require("../models/Intereses");
var Especie = require("../models/Especie");

var objection = require("objection");
const { name } = require("ejs");

exports.Inicio = (req, res, next) => {
  if (req.session.Logged) {
    //Revisa si el usuario esta logeado en la pagina

    Intereses.query()
      .where("Intereses.ID_Usuario", "=", req.session.IdSession)
      .then((Result) => {
        if (Result.length < 3) {
          //Revisa que el usuario tenga 3 intereses
          console.log(Result);
          res.redirect("/inicio/intereses");
        } else {
          res.render("feed.ejs"); //El usuario esta logeado y tiene los intereses correspondientes
        }
      })
      .catch((err) => next(err));
  } else {
    res.redirect("/login");
  }
};

exports.SeleccionarIntereses = (req, res, next) => {
  Especie.query()
    .then((Result) => {
      res.render("SeleccionarIntereses.ejs", {
        Animales: Result,
      });

      console.log(Result);
    })
    .catch((error) => next(error));
};

exports.CrearIntereses = (req, res, next) => {
  var array = req.body.Escogidos;
  console.log(array.length);
  console.log(array[1]);
  console.log(array);
  console.log(req.session.IdSession);

  for (var i = 0; i < 3; i++) {
    Intereses.query()
      .insert({
        ID_Usuario: req.session.IdSession,
        ID_Especie: array[i],
      })
      .then((registroCreado) => {})
      .catch((err) => next(err));
  }

  res.redirect("/inicio");
};
