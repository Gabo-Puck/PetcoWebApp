var Intereses = require("../models/Intereses");
var Especie = require("../models/Especie");
var Mascota = require("../models/Mascota");
const Publicacion = require("../models/Publicacion");
const Publicacion_Guardada = require("../models/Publicacion_Guardada");
const Usuario = require("../models/Usuario");
const Usuario_Bloqueado = require("../models/Usuario_Bloqueado");
const { getDownloadURL, ref } = require("firebase/storage");

exports.Inicio = (req, res, next) => {
  console.log(req.session);

  if (req.session.Logged) {
    //Revisa si el usuario esta logeado en la pagina

    let prueba = new Array();
    Usuario_Bloqueado.query()
      .then((usuariosB) => {
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
                    .andWhere(
                      "publicacion.ID_Usuario",
                      "!=",
                      req.session.IdSession
                    )
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
                    .orderBy("numberOfReports")
                    .orderBy("numberOfLikes", "desc")
                    .orderBy("Reportes_Peso")
                    .withGraphJoined("Mascota.MascotasPublicacion")
                    .withGraphJoined("Mascota.MascotasEstado")
                    .withGraphJoined("Mascota.MascotasImagenes")
                    .then((resultado) => {
                      //console.log('Separador ------------------------');
                      //console.log(resultado);

                      let contador = 0;

                      for (let i = 0; i < resultado.length; i++) {
                        for (let j = 0; j < resultado[i].Mascota.length; j++) {
                          if (
                            resultado[i].Mascota[j].ID_Especie ==
                              Result[0].ID_Especie ||
                            resultado[i].Mascota[j].ID_Especie ==
                              Result[1].ID_Especie ||
                            resultado[i].Mascota[j].ID_Especie ==
                              Result[2].ID_Especie
                          ) {
                            //Query para checar publicaciones con usuarios bloqueados

                            prueba[contador] = resultado[i].Mascota[j];
                            contador++;
                          }
                        }
                        //console.log('Aqui acaba una publicacion y sus mascotas')
                      }

                      //Filtrado de publicaciones bloqueadas
                      for (let i = 0; i < prueba.length; i++) {
                        for (let k = 0; k < usuariosB.length; k++) {
                         
                          if (
                            (prueba[i].MascotasPublicacion.ID_Usuario ==
                              usuariosB[k].ID_Usuario &&
                              usuariosB[k].ID_Bloqueado ==
                                req.session.IdSession) ||
                            (prueba[i].MascotasPublicacion.ID_Usuario ==
                              usuariosB[k].ID_Bloqueado &&
                              usuariosB[k].ID_Usuario == req.session.IdSession)
                          ) {
                            prueba.splice(i, 1);
                            i = 0;
                            console.log("ESTO MIDE MASCOTAS FILTRADAS " + prueba.length)
                            if(prueba.length == 1)
                            {
                              break;
                            }
                          }
                        }
                      }

                      prueba.forEach((mascota) => {});
                      let promises = [];
                      for (let index = 0; index < prueba.length; index++) {
                        const mascota = prueba[index];
                        for (
                          let indexImagen = 0;
                          indexImagen < mascota.MascotasImagenes.length;
                          indexImagen++
                        ) {
                          const imagenRuta =
                            mascota.MascotasImagenes[indexImagen];
                          promises.push(
                            createPromisesImagenesMascotas(
                              mascota,
                              imagenRuta.Ruta,
                              req.app.storageFirebase,
                              indexImagen
                            )
                          );
                        }
                      }
                      Promise.all(promises).then(() => {
                        console.log(prueba);
                        res.render("feed.ejs", {
                          MascotaRender: prueba,
                          Tipo: req.session.Tipo,
                        });
                      });

                      //console.log(prueba);
                    });

                  //id organizacion
                  //  console.log(MascotaP);
                  //console.log(req.session.IdSession);
                });
            }
          }); //Aqui xd
      })
      .catch((err) => next(err));
  } else {
    res.redirect("../login");
  }
};

const createPromisesImagenesMascotas = (mascota, path, storage, index) => {
  return new Promise((resolve, reject) => {
    let fullPath = path;
    let fragmentedPath = fullPath.split("/");
    let fileName = fragmentedPath.pop();
    let referencePath = fullPath.replace(fileName, "");
    let storageRef = ref(storage);
    fragmentedPath.forEach((route) => {
      storageRef = ref(storageRef, route);
    });
    storageRef = ref(storageRef, fileName);
    getDownloadURL(storageRef)
      .then((url) => {
        mascota.MascotasImagenes[index].Ruta = url;
        resolve("ok");
      })
      .catch((error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        resolve("xd");
        switch (error.code) {
          case "storage/object-not-found":
            // File doesn't exist
            break;
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            break;
          case "storage/canceled":
            // User canceled the upload
            break;

          // ...

          case "storage/unknown":
            // Unknown error occurred, inspect the server response
            break;
        }
      });
    // getDownloadURL()
  });
};

exports.createPromisesImagenesMascotas = createPromisesImagenesMascotas;

exports.feed = (req, res, next) => {
  res.render("feed.ejs", { Tipo: req.session.Tipo });

  console.log(req.session);
};

exports.SessionInfo = (req, res, next) => {
  Usuario.query()
    .where("usuario.ID", "=", req.session.IdSession)
    .then((result) => {
      res.json(result);
    });
};

exports.SeleccionarIntereses = (req, res, next) => {
  Especie.query()
    .then((Result) => {
      console.log(req.session);
      res.render("SeleccionarIntereses.ejs", {
        Animales: Result,
        TUser: req.session.Tipo,
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

  Usuario_Bloqueado.query().then((usuariosB) => {
    Publicacion.query()
      .where("publicacion.Activo", "=", 1)
      .andWhere("publicacion.ID_Usuario", "!=", req.session.IdSession)
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
      .orderBy("numberOfReports")
      .orderBy("numberOfLikes", "desc")
      .orderBy("Reportes_Peso")
      .withGraphFetched("PublicacionGuardada")
      .withGraphJoined("Mascota.MascotasPublicacion")
      .withGraphJoined("Mascota.MascotasEstado")
      .withGraphJoined("Mascota.MascotasImagenes")
      .then((resultado) => {
        //console.log('Separador ------------------------');
        //console.log(resultado);

        let contador = 0;

        for (let i = 0; i < resultado.length; i++) {
          for (let j = 0; j < resultado[i].PublicacionGuardada.length; j++) {
            for (let k = 0; k < resultado[i].Mascota.length; k++) {
              if (
                resultado[i].PublicacionGuardada[j].ID_Usuario ==
                req.session.IdSession
              ) {
                console.log(resultado[i].Mascota[j].Nombre);
                prueba[contador] = resultado[i].Mascota[k];
                contador++;
              }
            }
          }
          //console.log('Aqui acaba una publicacion y sus mascotas')
        }

        //Filtrado de Bloqueo
        for (let i = 0; i < prueba.length; i++) {
          for (let k = 0; k < usuariosB.length; k++) {
          
            if (
              (prueba[i].MascotasPublicacion.ID_Usuario ==
                usuariosB[k].ID_Usuario &&
                usuariosB[k].ID_Bloqueado == req.session.IdSession) ||
              (prueba[i].MascotasPublicacion.ID_Usuario ==
                usuariosB[k].ID_Bloqueado &&
                usuariosB[k].ID_Usuario == req.session.IdSession)
            ) {
              prueba.splice(i, 1);
              i = 0;
              console.log("ESTO MIDE MASCOTAS FILTRADAS " + prueba.length)
              if(prueba.length == 1)
              {
                break;
              }
            }
          }
        }

        res.render("feed.ejs", {
          MascotaRender: prueba,
          Tipo: req.session.Tipo,
        });
        //console.log(prueba);
      });
  });

  // Publicacion.query()
  // .withGraphJoined('PublicacionGuardada')
  // .then((result) => {
  //   res.json(result);
  // })
};
