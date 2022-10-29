var express = require("express");
var router = express.Router();

var registro_Login = require("../controllers/LoginController");

router.get("/", registro_Login.session);

router.post("/CheckLogin", registro_Login.CheckDB);

router.get("/recuperarContrasena", registro_Login.recuperarContrasena);
router.get("/generarEmail/:correo", registro_Login.requestPassChange);
router.get("/editarContrasena/:correo", registro_Login.editarContrasenaGet);
router.post("/editarContrasena", registro_Login.editarContrasenaPost);

module.exports = router;
