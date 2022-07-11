const express = require("express");
const route = express.Router();

route.get("/631", function (request, response) {
  response.send("suben");
});

module.exports = route;
