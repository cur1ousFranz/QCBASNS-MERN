const { SUBJECT_TEACHER } = require("../constants/Roles");
const User = require("../models/UserModel");
const SubjectTeacher = require("../models/SubjectTeacherModel");
const Adviser = require("../models/AdviserModel");
const validator = require("validator");
const bcrypt = require("bcrypt");
const extractUserID = require("../utils/ExtractUserId");

const getSubjectTeacher = async (req, res) => {
  const userId = extractUserID(req);
  const subTeacher = await SubjectTeacher.findOne({ user_id: userId });
  return res.status(200).json(subTeacher);
}

const createSubjectTeacher = async (req, res) => {
  const { email, password, subject } = req.body;

  const errorFields = [];
  const errorMessage = [];
  if (!email) errorFields.push("email");
  if (!password) errorFields.push("password");
  if (!subject) errorFields.push("subject");

  if (!validator.isEmail(email)) {
    errorFields.push("email");
    errorMessage.push("Email is invalid.");
  }

  if (errorFields.length > 0) {
    return res.status(400).json({ error: errorMessage, errorFields });
  }

  try {
    const exist = await User.findOne({ email });
    if (exist) {
      errorFields.push("email");
      errorMessage.push("Email is already exist.");
    }

    if (errorFields.length > 0) {
      return res.status(400).json({ error: errorMessage, errorFields });
    }

    const userId = extractUserID(req);
    const adviser = await Adviser.findOne({ user_id: userId });
    if(!adviser) {
        return res.status(404).json({ error: "No adviser found."})
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const user = await User.create({
      email,
      password: hash,
      role: SUBJECT_TEACHER,
    });

    await SubjectTeacher.create({
      user_id: user._id,
      adviser_id: adviser._id,
      subject,
    });

    return res.status(200).json({ message: "Success" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getSubjectTeacher,
  createSubjectTeacher,
};
