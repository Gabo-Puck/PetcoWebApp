var express = require("express");
var router = express.Router();

var registro_Login = require("../controllers/PublicacionGetController");

router.get("/adopciones/:idPublicacion", registro_Login.query);
router.get("/meta/:idMascota", registro_Login.donacionMetas);
router.post("/donarmeta", registro_Login.pay);
router.get("/success", registro_Login.paysuccess);
router.get("/cancel", registro_Login.paycancel);

//outer.post("/CheckLogin", registro_Login.CheckDB);

module.exports = router; 