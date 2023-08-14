const User = require("../models/UserModel");
const Adviser = require("../models/AdviserModel");
const createToken = require("../utils/CreateToken");

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const adviser = await Adviser.find({ user_id: user._id });
    const token = createToken(user._id);
    return res.status(200).json({ email, token, id: adviser._id });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = {
  login,
};