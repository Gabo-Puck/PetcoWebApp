const express = require("express");
const router = express.Router();

const notificacionesController = require("../controllers/NotificacionesController");

router.get("/", notificacionesController.retrieveNotificaciones);
router.post("/leido", notificacionesController.patchLeidoNotificaciones);

module.exports = router;
