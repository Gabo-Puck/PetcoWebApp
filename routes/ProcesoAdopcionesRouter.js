const express = require("express");
const router = express.Router();

const ProcesoAdopcionesController = require("../controllers/ProcesoAdopcionController");

router.get("/ver/:MascotaID", ProcesoAdopcionesController.getProceso);
router.post("/abortar", ProcesoAdopcionesController.abortarProceso);
router.post("/subirArchivo", ProcesoAdopcionesController.uploadFile);
router.post("/recibirFeedback", ProcesoAdopcionesController.patchReputacion);

module.exports = router;
