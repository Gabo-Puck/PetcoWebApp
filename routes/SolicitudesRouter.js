const express = require("express");
const router = express.Router();

const solicitudesController = require("../controllers/SolicitudesController");

router.get(
  "/ver/:PublicacionID",
  solicitudesController.getListaSolicitudesPublicacion
);
router.get(
  "/obtener/solicitudesMascota/:MascotaID",
  solicitudesController.getListaSolicitudesMascota
);

router.get(
  "/obtener/respuestasSolicitud/:SolicitudID",
  solicitudesController.getRespuestasSolicitudMascota
);
router.get(
  "/aceptar/:SolicitudID&:MascotaID",
  solicitudesController.aceptarSolicitud
);
router.get(
  "/denegar/:SolicitudID&:MascotaID",
  solicitudesController.denegarSolicitud
);

module.exports = router;
