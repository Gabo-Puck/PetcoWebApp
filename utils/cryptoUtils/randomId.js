const crypto = require("crypto");

const randomId = () => {
  return crypto.randomBytes(8).toString("hex");
};

module.exports = { randomId };
