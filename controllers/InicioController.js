var Intereses = require("../models/Intereses");
var Especie = require("../models/Especie");

exports.Inicio = (req, res, next) => {
  if (req.session.Logged) {
    //Revisa si el usuario esta logeado en la pagina

    Intereses.query()
      .where("intereses.ID_Usuario", "=", req.session.IdSession)
      .then((Result) => {
        console.log(Result);

        if (Result.length < 3) {
          //Revisa que el usuario tenga 3 intereses
          console.log(Result);
          console.log(req.baseUrl.concat("login"));
          console.log(req.hostname.concat("/login"));

          res.redirect(req.baseUrl + "/intereses");
          // res.redirect("./login");
        } else {
          // res.render("feed.ejs"); //El usuario esta logeado y tiene los intereses correspondientes
          res.redirect(req.baseUrl + "/feed");
        }
      })
      .catch((err) => next(err));
  } else {
    res.redirect("../login");
  }
};

exports.feed = (req, res, next) => {
  res.render("feed.ejs");
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

  // res.redirect("/inicio");
  res.redirect(req.baseUrl + "/feed");
};

fetch(url)
  .then((response) => response.json())
  .then(response);
