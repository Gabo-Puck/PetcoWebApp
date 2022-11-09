var express = require("express");
var router = express.Router();

var BusquedaRouter = require("../controllers/BusquedaController.js");


router.get("/coincidencias/:search/:orden", BusquedaRouter.pagina);
router.post("/ingreso", BusquedaRouter.form);


module.exports = router;

