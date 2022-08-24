var express = require("express");
var router = express.Router();
var Registro = require("../models/Registro");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/registro=:id", function (request, response) {
  console.log(request.params.id);
  Registro.query()
    .findById(request.params.id)
    .then((Registros) => response.json(Registros));
});

module.exports = router;
