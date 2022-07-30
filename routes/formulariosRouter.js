const express = require("express");
const router = express.Router();

const formularioController = require("../controllers/formularioController");

router.get("/", formularioController.formularioList);
router.get("/preguntas", formularioController.formularioPreguntas);
router.get("/opcionesPreg", formularioController.preguntasOpciones);
router.get("/crear", formularioController.crearFormulario);
router.get("/Solicitud", formularioController.verSolicitud);

module.exports = router;
