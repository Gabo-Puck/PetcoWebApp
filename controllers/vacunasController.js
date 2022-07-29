var Vacunas = require("../models/Vacunas");
var Especie = require("../models/Especie");
var Vacunas_Especie = require("../models/Vacunas_Especie");

exports.vacunas_list = (req, res) => {
  Vacunas.query().then((Vacunas_result) => res.json(Vacunas_result));
};

exports.vacunas_details = (req, res) => {
  Vacunas.query()
    .findById(req.params.id)
    .then((Vacuna) => res.json(Vacuna));
};

exports.especie_list = (req, res) => {
  Especie.query().then((Especies) => res.json(Especies));
};

exports.especie_details = (req, res) => {
  Especie.query()
    .findById(req.params.id)
    .then((Especie_resultado) => res.json(Especie_resultado));
};

exports.vacunas_especie = (req, res) => {
  // res.send("Not implemented yet");
  Especie.query()
    // .withGraphFetched("Vacunas")
    .joinRelated("Vacunas")
    .where("Vacunas.Nombre_Vacuna", "=", "No Vacuna")
    .andWhere("Especie.ID", "=", 7)
    .then((results) => {
      console.log(results);
      console.log(results.length);
      res.json(results);
    });
};
