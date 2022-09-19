const express = require("express");
const router = express.Router();

var formulariosRouter = require("./formulariosRouter");
var indexRouter = require("./index");
var ProtocoloRouter = require("./protocolos");
var dashboard = require("./DashboardRoutes");
var publicacionget = require("./PublicacionGetRouter");
var videochat = require("./videollamada");

router.use("/inicio", indexRouter);
router.use("/formulario", formulariosRouter);
router.use("/protocolo", ProtocoloRouter);
router.use("/dashboard", dashboard);
router.use("/publicacion", publicacionget);

module.exports = router;
