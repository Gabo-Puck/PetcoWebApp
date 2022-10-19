var express = require("express");
var router = express.Router();

var videollamadaController = require("../controllers/VideollamadaController");

var myConnection = (req, res, next) => {
  res.render("videochatRoom");
};

router.get("/:ROOM_ID", videollamadaController.getUserData);
// router.get("/", videollamadaController.getUserData);

module.exports = router;
