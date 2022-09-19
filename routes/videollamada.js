var express = require("express");
var router = express.Router();

var myConnection = (req, res, next) => {
  res.render("videochatRoom");
};

router.get("/", myConnection);

module.exports = router;
