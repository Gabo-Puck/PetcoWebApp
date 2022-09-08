const express = require("express");
const router = express.Router();

const PublicacionesController = require("../controllers/publicacionController");

router.get("/prueba", PublicacionesController.prueba);
router.get("/crear", PublicacionesController.crearPublicacion);

module.exports = router;
