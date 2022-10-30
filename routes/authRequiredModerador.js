var express = require("express");
var router = express.Router();

var Moderador_Controller = require("../controllers/ModeradorController");

router.get("/", Moderador_Controller.crearModeradorGet);

module.exports = router;
