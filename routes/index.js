var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  if (req.session.Logged)
  {
    console.log(req.session.IdSession);
    
    res.render('feed.ejs');
  }
  else
  {
    res.redirect('/login');
  }
});

module.exports = router;
