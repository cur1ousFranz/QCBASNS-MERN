const { ADVISER } = require("../constants/Roles");
const User = require("../models/UserModel");
const Adviser = require("../models/AdviserModel");
const createToken = require("../utils/CreateToken");

const createAdviser = async (req, res) => {
  const {
    email,
    password,
    first_name,
    middle_name,
    last_name,
    suffix = "",
    gender,
    birthdate,
    contact_number,
  } = req.body;

  const errorFields = [];
  const errorMessage = "Please fill in all fields";
  if (!first_name) errorFields.push("first_name");
  if (!middle_name) errorFields.push("middle_name");
  if (!last_name) errorFields.push("last_name");
  if (!gender) errorFields.push("gender");
  if (!birthdate) errorFields.push("birthdate");
  if (!contact_number) errorFields.push("contact_number");
  if (!email) errorFields.push("email");
  if (!password) errorFields.push("password");
  if (errorFields.length > 0) {
    return res.status(400).json({ error: errorMessage, errorFields });
  }

  try {
    const user = await User.signup(email, password, ADVISER);
    const adviser = await Adviser.create({
      user_id: user._id,
      first_name,
      middle_name,
      last_name,
      suffix,
      gender,
      birthdate,
      contact_number,
    });

    const token = createToken(user._id);
    return res.status(200).json({ email, token, id: adviser._id });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createAdviser,
};
