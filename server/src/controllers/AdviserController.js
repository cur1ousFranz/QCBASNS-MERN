import { ADVISER } from "../constants/Roles";
import User from "../models/UserModel";
import Adviser from "../models/AdviserModel";
import { createToken } from "../utils/CreateToken";

export const signUp = async (req, res) => {
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
  if (!suffix) errorFields.push("suffix");
  if (!gender) errorFields.push("gender");
  if (!birthdate) errorFields.push("birthdate");
  if (!contact_number) errorFields.push("contact_number");
  if (errorFields.length > 0) {
    res.status(400).json({ error: errorMessage, errorFields });
  }

  try {
    const user = await User.signUp(email, password, ADVISER);
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
    res.status(200).json({ email, token, id: adviser._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

