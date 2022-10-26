var express = require("express");
var router = express.Router();

var registro_Login = require("../controllers/PublicacionGetController");
var PublicacionesController = require("../controllers/publicacionController");

router.get("/prueba", PublicacionesController.prueba);
router.get("/crear", PublicacionesController.crearPublicacion);
router.post("/check", PublicacionesController.checkImage);
router.post("/crear", PublicacionesController.crearPublicacionGuardar);
router.get("/adopciones/:idPublicacion", registro_Login.query);
router.get("/meta/:idMascota", registro_Login.donacionMetas);
router.get("/likes/:idP/:idU/:accion", registro_Login.likes);
router.post("/donarmeta", registro_Login.pay);
router.get("/success", registro_Login.paysuccess);
router.get("/cancel", registro_Login.paycancel);
router.get("/Psaved/:idP/:idU/:accion", registro_Login.psaveds);
router.get("/Reporte/:motivo/:peso/:usuarioreporta/:usuarioreportado/:publicacion", registro_Login.reportar);
router.get("/ReporteUsuario/:motivo/:peso/:usuarioreportado", registro_Login.reportarUsuario);


//outer.post("/CheckLogin", registro_Login.CheckDB);

module.exports = router;
