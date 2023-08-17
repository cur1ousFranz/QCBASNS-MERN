const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Authorization token is required" });
  }

  // Split [Bearer token]
  let token = authorization.split(" ")[1];

  try {
    const decodeToken = jwt.decode(token, { complete: true });

    if (decodeToken.payload.exp <= Date.now() / 1000) {
      return res.status(401).json({ error: "Session Expired" });
    }

    const { _id } = jwt.verify(token, process.env.SECRET_KEY);

    req.user = await User.findOne({ _id }).select("_id");
    next();
  } catch (error) {
    return res.status(401).json({ error: "Request is not authorized" });
  }
};

module.exports = requireAuth;
