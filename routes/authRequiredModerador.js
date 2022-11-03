var express = require("express");
var router = express.Router();

var Moderador_Controller = require("../controllers/ModeradorController");
var Moderador_Controller2 = require("../controllers/registroController");

router.get("/crearModerador", Moderador_Controller.crearModeradorGet);
// Usuario reportes
router.get(
  "/verReportesUsuarios",
  Moderador_Controller.verUsuariosReportadosGet
);
router.get(
  "/registros_pendientes",
  Moderador_Controller2.registros_pendientes_list
);
router.get(
  "/verUsuarioReportes/:idUsuario",
  Moderador_Controller.verReportesUsuarioGet
);
router.get(
  "/obtenerReportesUsuario/:idUsuario/:opcion",
  Moderador_Controller.obtenerReportesUsuario
);

router.post(
  "/validarReportesUsuario",
  Moderador_Controller.validarReportesUsuario
);
router.post(
  "/invalidarReportesUsuario",
  Moderador_Controller.invalidarReportesUsuario
);

router.post("/eliminarUsuario", Moderador_Controller.eliminarUsuario);

//Usuario reportes

//Publicacion reportes
router.get("/verReportes", Moderador_Controller.verPublicacionesReportadasGet);
router.get(
  "/verPublicacionReportes/:idPublicacion",
  Moderador_Controller.verReportesPublicacionGet
);

router.get(
  "/obtenerReportesPublicacion/:idPublicacion/:opcion",
  Moderador_Controller.obtenerReportesPublicacion
);

router.post(
  "/validarReportesPublicacion",
  Moderador_Controller.validarReportes
);
router.post(
  "/invalidarReportesPublicacion",
  Moderador_Controller.invalidarReportes
);

router.post("/activarPublicacion", Moderador_Controller.activarPublicacion);
router.post("/eliminarPublicacion", Moderador_Controller.desactivarPublicacion);
//Publicacion reportes

module.exports = router;
