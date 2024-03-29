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
router.post("/editar", formularioController.formulario_edit_post);
router.post(
  "/responderFormulario",
  formularioController.responder_formulario_post
);
router.get("/editar/:idFormulario", formularioController.formulario_edit_get);
router.get("/ver/:idFormulario", formularioController.formulario_ver);
router.get("/preguntaTemplate", formularioController.formTest2);
router.get("/eliminar/:idFormulario", formularioController.EliminarForm);
router.get(
  "/responder/m=:idMascota",
  formularioController.responder_formulario_get
);

module.exports = router;
