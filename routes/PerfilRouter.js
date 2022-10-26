var express = require("express");
var router = express.Router();

var PerfilRouter = require("../controllers/PerfilController.js");


router.get("/usuario/:idUsuario",PerfilRouter.pagina);
router.post("/donarperfilP", PerfilRouter.pay);

router.get("/successP", PerfilRouter.paysuccess);
router.get("/cancelP", PerfilRouter.paycancel);


module.exports = router;

