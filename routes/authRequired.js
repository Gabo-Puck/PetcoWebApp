const express = require("express");
const router = express.Router();

var formulariosRouter = require("./formulariosRouter");
var indexRouter = require("./index");
var ProtocoloRouter = require("./protocolos");
var dashboard = require("./DashboardRoutes");
var publicacionget = require("./PublicacionGetRouter");
var perfilget = require("./PerfilRouter");
var videochat = require("./videollamada");
var proceso = require("./ProcesoAdopcionesRouter");
var solicitudes = require("./SolicitudesRouter");
router.use("/inicio", indexRouter);
router.use("/formulario", formulariosRouter);
router.use("/protocolo", ProtocoloRouter);
router.use("/dashboard", dashboard);
router.use("/publicacion", publicacionget);
router.use("/perfil", perfilget);
router.use("/proceso", proceso);
router.use("/solicitudes", solicitudes);

module.exports = router;
