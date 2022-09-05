const express = require("express");
const router = express.Router();

const PublicacionesController = require("../controllers/publicacionController");

router.get("/prueba", PublicacionesController.prueba);

module.exports = router;
