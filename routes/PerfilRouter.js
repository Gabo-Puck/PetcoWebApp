var express = require("express");
var router = express.Router();

var PerfilRouter = require("../controllers/PerfilController.js");


router.get("/:idUsuario",PerfilRouter.pagina);



module.exports = router;

