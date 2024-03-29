var express = require("express");
var router = express.Router();

var BusquedaRouter = require("../controllers/BusquedaController.js");


//router.get("/coincidencias/:search/:orden", BusquedaRouter.pagina);
router.get("/coincidencias/:especie/:tamano/:castrado/:salud/:edad/:search/:orden/:clasificacion", BusquedaRouter.pagina);

router.post("/ingreso", BusquedaRouter.form);


module.exports = router;

