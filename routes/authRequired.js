const express = require("express");
const router = express.Router();

var formulariosRouter = require("./formulariosRouter");

router.use("/formulario", formulariosRouter);

module.exports = router;
