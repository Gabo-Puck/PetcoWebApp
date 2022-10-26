var express = require("express");
var router = express.Router();

var registro_Login = require("../controllers/LoginController");

router.get("/", registro_Login.session);

router.post("/CheckLogin", registro_Login.CheckDB);

router.get("/recuperarContrasena", registro_Login.recuperarContrasena);

module.exports = router;
