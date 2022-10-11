var express = require("express");
var router = express.Router();

var registro_controller = require("../controllers/registroController");

/// Registro Routes ///
router.get("/", registro_controller.registro_list);
router.get("/Esme", registro_controller.registro_esme);
router.get("/pormunicipio", registro_controller.registro_municipio);
router.get("/crear", registro_controller.registro_crear_get);
router.get("/editar/:registroID", registro_controller.registro_edit_get);
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
