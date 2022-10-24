const express = require("express");
const router = express.Router();


const dashBcontroller = require("../controllers/DashboardController");

router.get("/", dashBcontroller.formDashboard);



module.exports = router;
