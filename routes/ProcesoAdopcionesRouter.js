const express = require("express");
const router = express.Router();

const ProcesoAdopcionesController = require("../controllers/ProcesoAdopcionController");

router.get("/ver/:MascotaID", ProcesoAdopcionesController.getProceso);

module.exports = router;
