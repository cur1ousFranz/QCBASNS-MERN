const jwt = require("jsonwebtoken");

const extractUserID = (req) => {
  const { authorization } = req.headers;
  const token = authorization.split(" ")[1];
  const { _id: user_id } = jwt.verify(token, process.env.SECRET_KEY);
  return user_id;
};

module.exports = extractUserID;
