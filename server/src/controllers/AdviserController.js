const { ADVISER } = require("../constants/Roles");
const User = require("../models/UserModel");
const Adviser = require("../models/AdviserModel");
const createToken = require("../utils/CreateToken");
const validator = require("validator");
const bcrypt = require("bcrypt");
const extractUserID = require("../utils/ExtractUserId");
const SubjectTeacher = require("../models/SubjectTeacherModel");

const getAdviser = async (req, res) => {
  const userId = extractUserID(req);
  const adviser = await Adviser.findOne({ user_id: userId });
  return res.status(200).json(adviser);
};

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
  const errorMessage = [];
  if (!first_name) errorFields.push("first_name");
  if (!last_name) errorFields.push("last_name");
  if (!gender) errorFields.push("gender");
  if (!birthdate) errorFields.push("birthdate");
  if (!contact_number) errorFields.push("contact_number");
  if (!email) errorFields.push("email");
  if (!password) errorFields.push("password");

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

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const user = await User.create({ email, password: hash, role: ADVISER });

    // const user = await User.signup(email, password, ADVISER);
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
    return res.status(200).json({ email, token, id: adviser._id, role: user.role });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const getAdviserSubjectTeachers = async (req, res) => {
  const userId = extractUserID(req);
  const adviser = await Adviser.findOne({ user_id: userId });
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10;

  if (!adviser) return res.stats(404).json({ error: "No such adviser" });

  try {
    const subjectTeachers = await SubjectTeacher.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user", // Unwind the array created by $lookup (optional)
      },
      {
        $match: {
          adviser_id: adviser._id,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $project: {
          "user.password": 0, // Exclude the 'password' field
        },
      },
      {
        $skip: (page - 1) * perPage,
      },
      {
        $limit: perPage,
      },
    ]);
    return res.status(200).json(subjectTeachers);
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports = {
  createAdviser,
  getAdviser,
  getAdviserSubjectTeachers,
};
