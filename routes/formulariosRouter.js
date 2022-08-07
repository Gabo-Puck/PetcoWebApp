const express = require("express");
const router = express.Router();

const formularioController = require("../controllers/formularioController");

router.get("/", formularioController.formularioList);
router.get("/preguntas", formularioController.formularioPreguntas);
router.get("/opcionesPreg", formularioController.preguntasOpciones);
router.get("/crear", formularioController.crearFormulario);
router.get("/Solicitud", formularioController.verSolicitud);
router.post("/verify", formularioController.verifyFormulario);
router.post("/crear", formularioController.formulario_crear_post);
router.get("/info", formularioController.formDashboard);
router.get("/editar", formularioController.formulario_edit_get);
router.post("/editar", formularioController.formulario_edit_post);
router.get("/preguntaTemplate", formularioController.formTest2);

module.exports = router;
