const express = require("express");
const router = express.Router();

var registroRouter = require("./registro");
var formulariosRouter = require("./formulariosRouter");
var loginRouter = require("./login");

router.get("/formulario", formulariosRouter);
router.get("/login", loginRouter);
router.get("/registro", registroRouter);

module.exports = router;
