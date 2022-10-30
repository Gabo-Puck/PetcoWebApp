const Estado = require("../models/Estado");

const renderRegistroMiddleware = (req, res, next) => {
  if (res.stuff) {
    console.log("si hay estados");
  } else console.log("no hay estados");
  res.render("HacerRegistro", {
    title: "Crear moderador",
    EstadosMunicipios: res.stuff,
    errors: res.errors,
    RegistroPrevio: null,
    urlVerificarReq: "/registro/verify",
    urlGrabarReq: "/registro/crear",
    isModerador: true,
  });
};
const getAllEstados = (req, res, next) => {
  Estado.query()
    .withGraphFetched("municipios")
    .then((Estados) => {
      res.stuff = Estados;
      next();
    })
    .catch((err) => next(err));
};
exports.crearModeradorGet = [getAllEstados, renderRegistroMiddleware];
