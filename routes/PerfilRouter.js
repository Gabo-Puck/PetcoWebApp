var express = require("express");
var router = express.Router();

var PerfilRouter = require("../controllers/PerfilController.js");

router.get("/usuario/:idUsuario", PerfilRouter.pagina);
router.post("/donarperfilP", PerfilRouter.pay);
router.post("/cambiarpfp", PerfilRouter.cambiarpfp);

router.get("/successP", PerfilRouter.paysuccess);
router.get("/cancelP", PerfilRouter.paycancel);
router.get("/Adonaciones/:bandera", PerfilRouter.fetchDonation);
router.get("/Block/:idB", PerfilRouter.bloquear);
router.get("/Dusuario/:idUsuario", PerfilRouter.DonacionesUser);

module.exports = router;
