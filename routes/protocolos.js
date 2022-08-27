const express = require("express");
const router = express.Router();

const ProtocoloController = require("../controllers/ProtocoloController");

router.post("/guardar", ProtocoloController.ProtocoloCrear);
router.post("/guardarEditar", ProtocoloController.ProtocoloEditarPost);

router.get("/editar/:idProtocolo", ProtocoloController.ProtocoloEditarGet);
router.get("/", ProtocoloController.list);
router.get("/reviso", ProtocoloController.reviso);

module.exports = router;
