var Intereses = require("../models/Intereses");
var Especie = require("../models/Especie");
var Mascota = require("../models/Mascota");
const Publicacion = require("../models/Publicacion");
const Publicacion_Guardada = require("../models/Publicacion_Guardada");

exports.Inicio = (req, res, next) => {
  console.log(req.session);

  if (req.session.Logged) {
    //Revisa si el usuario esta logeado en la pagina

    let prueba = new Array();

    Intereses.query()
      .where("intereses.ID_Usuario", "=", req.session.IdSession)
      .then((Result) => {
        //console.log(Result);

        if (Result.length < 3) {
          //Revisa que el usuario tenga 3 intereses
          res.redirect(req.baseUrl + "/intereses");
        } else {
          //El usuario esta logeado y tiene los intereses correspondientes
          Intereses.query()
            .where("intereses.ID_Usuario", "=", req.session.IdSession)
            .then((Result) => {
              console.log(Result);

              Publicacion.query()
                .where("publicacion.Activo", "=", 1)
                .withGraphJoined("Mascota.MascotasPublicacion")
                .withGraphJoined("Mascota.MascotasEstado")
                .withGraphJoined("Mascota.MascotasImagenes")
                .select(
                  "publicacion.*",
                  Publicacion.relatedQuery("PublicacionLike")
                    .count()
                    .as("numberOfLikes")
                )
                .select(
                  "publicacion.*",
                  Publicacion.relatedQuery("PublicacionReporte")
                    .count()
                    .as("numberOfReports")
                )
                .orderByRaw("numberOfReports")
                .orderBy("numberOfLikes", "desc")
                .orderByRaw("Reportes_Peso")
                .then((resultado) => {
                  //console.log('Separador ------------------------');
                  //console.log(resultado);

                  let contador = 0;

                  for (let i = 0; i < resultado.length; i++) {
                    for (let j = 0; j < resultado[i].Mascota.length; j++) {

                      if (resultado[i].Mascota[j].ID_Especie == Result[0].ID_Especie || resultado[i].Mascota[j].ID_Especie == Result[1].ID_Especie || resultado[i].Mascota[j].ID_Especie == Result[2].ID_Especie) {
                        //console.log(resultado[i].Mascota[j].Nombre);
                        prueba[contador] = resultado[i].Mascota[j];
                        contador++;
                      }
                    }
                    //console.log('Aqui acaba una publicacion y sus mascotas')
                  }

                  res.render("feed.ejs", {
                    MascotaRender: prueba,
                    Tipo: req.session.Tipo,
                  });
                  //console.log(prueba);
                });

              //id organizacion
              //  console.log(MascotaP);
              //console.log(req.session.IdSession);
            });
        }
      })
      .catch((err) => next(err));
  } else {
    res.redirect("../login");
  }
};

exports.feed = (req, res, next) => {
  res.render("feed.ejs", { Tipo: req.session.Tipo });
  console.log(req.session);
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
  let arrayPromise = [];
  for (var i = 0; i < 3; i++) {
    arrayPromise.push(
      Intereses.query()
        .insert({
          ID_Usuario: req.session.IdSession,
          ID_Especie: array[i],
        })
        .catch((err) => next(err))
    );
  }
  Promise.all(arrayPromise).then((prom) => {
    res.redirect("/petco/inicio");
  });

  // res.redirect("/inicio");
};

exports.CerrarSession = (req, res, next) => {
  console.log("owo");

  req.session.destroy(() => {
    res.redirect("/");
  });
};

exports.Pguardadas = (req, res, next) => {
  let prueba = new Array();


  
  Publicacion.query()
    .where("publicacion.Activo", "=", 1)
    .withGraphJoined("Mascota.MascotasPublicacion")
    .withGraphJoined("Mascota.MascotasEstado")
    .withGraphJoined("Mascota.MascotasImagenes")
    .select(
      "publicacion.*",
      Publicacion.relatedQuery("PublicacionLike").count().as("numberOfLikes")
    )
    .select(
      "publicacion.*",
      Publicacion.relatedQuery("PublicacionReporte")
        .count()
        .as("numberOfReports")
    )
    .withGraphFetched('PublicacionGuardada')
    .orderByRaw('numberOfReports')
    .orderBy('numberOfLikes', 'desc')
    .orderByRaw('Reportes_Peso')
    .then((resultado) => {
      //console.log('Separador ------------------------');
      //console.log(resultado);

      let contador = 0;

      for (let i = 0; i < resultado.length; i++) {
        for (let j = 0; j < resultado[i].PublicacionGuardada.length; j++) {

          for (let k = 0; k < resultado[i].Mascota.length; k++) {

            if (resultado[i].PublicacionGuardada[j].ID_Usuario == req.session.IdSession) {
              console.log(resultado[i].Mascota[j].Nombre);
              prueba[contador] = resultado[i].Mascota[k];
              contador++;
            }

          }

        }
        //console.log('Aqui acaba una publicacion y sus mascotas')
      }

      res.render("feed.ejs", {
        MascotaRender: prueba,
        Tipo: req.session.Tipo,
      });
      //console.log(prueba);
    });

  // Publicacion.query()
  // .withGraphJoined('PublicacionGuardada')
  // .then((result) => {
  //   res.json(result);
  // })  

}


