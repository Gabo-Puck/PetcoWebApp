
var express = require("express");
var router = express.Router();

var feed_start = require("../controllers/InicioController");

/* GET home page. */
router.get("/",feed_start.Inicio);

router.get("/intereses", feed_start.SeleccionarIntereses);

router.post("/CrearI", feed_start.CrearIntereses);

//router.post("/CheckLogin", registro_Login.CheckDB); 

module.exports = router;

