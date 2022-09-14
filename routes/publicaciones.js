const express = require("express");
const router = express.Router();

const PublicacionesController = require("../controllers/publicacionController");

router.get("/prueba", PublicacionesController.prueba);
router.get("/crear", PublicacionesController.crearPublicacion);
router.post("/check", PublicacionesController.checkImage);
router.post("/crear", PublicacionesController.crearPublicacionGuardar);

module.exports = router;
