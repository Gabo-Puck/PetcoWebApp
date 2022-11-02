var express = require("express");
var router = express.Router();

var feed_start = require("../controllers/InicioController");

/* GET home page. */
router.get("/", feed_start.Inicio);

router.get("/intereses", feed_start.SeleccionarIntereses);

router.get("/feed", feed_start.feed);

router.post("/CrearI", feed_start.CrearIntereses);

router.get("/cerrarsession", feed_start.CerrarSession);

router.get("/PublicacionesGuardadas", feed_start.Pguardadas);

router.get("/CurrentUser", feed_start.SessionInfo);




//router.post("/CheckLogin", registro_Login.CheckDB);

module.exports = router;
