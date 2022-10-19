var express = require("express");
var router = express.Router();

var registro_controller = require("../controllers/registroController");

/// Registro Routes ///
router.get("/Esme", registro_controller.registro_esme);
router.get("/pormunicipio", registro_controller.registro_municipio);
router.get("/crear", registro_controller.registro_crear_get);
router.get("/lista_pendientes", registro_controller.registros_pendientes_list);
router.get("/editar/:registroID", registro_controller.registro_edit_get);
router.get("/getEstado/:registroID", registro_controller.registro_estado);
router.post("/aprobar/:registroID", registro_controller.registro_aprobar);
router.post("/devolver/:registroID", registro_controller.registro_devolver);
router.post(
  "/verifyEditar/:registroID",
  registro_controller.registro_verify_editar
);
router.post(
  "/editarPatch/:registroID",
  registro_controller.registro_editar_patch
);
// router.get("/:id", registro_controller.registro_details);
router.post("/crear", registro_controller.registro_crear_post);
router.post("/verify", registro_controller.registro_verify);
router.get("/info", registro_controller.registro_redirect);

module.exports = router;
