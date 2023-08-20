const AdviserModel = require("../models/AdviserModel");
const SemesterModel = require("../models/SemesterModel");
const extractUserID = require("../utils/ExtractUserId");

const getAllSemester = async (req, res) => {
  const semesters = await SemesterModel.find().sort('createdAt');
  return res.status(200).json(semesters);
};

const createSemester = async (req, res) => {
  const {
    semester,
    track,
    strand,
    grade_level,
    section,
    start_year,
    end_year,
  } = req.body;

  const errorFields = [];
  const errorMessage = "Please fill in all fields";
  if (!semester) errorFields.push("semester");
  if (!track) errorFields.push("track");
  if (!grade_level) errorFields.push("grade_level");
  if (!section) errorFields.push("section");
  if (!start_year) errorFields.push("school_year");
  if (!end_year) errorFields.push("school_year");
  if (errorFields.length > 0) {
    return res.status(400).json({ error: errorMessage, errorFields });
  }
  const userId = extractUserID(req);
  const adviser = await AdviserModel.findOne({ user_id: userId });
  const newSemester = {
    adviser_id: adviser._id,
    semester,
    track,
    strand,
    grade_level,
    section,
    start_year,
    end_year,
  };
  const result = await SemesterModel.create(newSemester);
  return res.status(200).json(result);
};

module.exports = {
  getAllSemester,
  createSemester,
};
