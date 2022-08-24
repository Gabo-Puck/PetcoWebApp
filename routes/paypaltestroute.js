const express = require("express");
const router = express.Router();

const Pcontroller = require("../controllers/Paypaltestcontroller");

router.get("/", Pcontroller.Main);

router.post("/pay", Pcontroller.Pago);

router.get("/success", Pcontroller.exito);

router.get("/cancel", Pcontroller.fallo);


module.exports = router;
