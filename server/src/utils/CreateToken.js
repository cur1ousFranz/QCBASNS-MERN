require('dotenv').config();
const jwt = require("jsonwebtoken");

const createToken = (user_id) => {
  return jwt.sign({ _id: user_id }, process.env.SECRET_KEY);
};

module.exports = createToken;
