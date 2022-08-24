var express = require("express");
var router = express.Router();

var vacunas_controller = require("../controllers/vacunasController");

router.get("/vacunas", vacunas_controller.vacunas_list);
router.get("/vacunas=:id", vacunas_controller.vacunas_details);
router.get("/especies", vacunas_controller.especie_list);
router.get("/especies=:id", vacunas_controller.especie_details);
router.get("/vacunas_especies", vacunas_controller.vacunas_especie);

module.exports = router;
