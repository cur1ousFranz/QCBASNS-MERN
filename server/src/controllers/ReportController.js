const { isValidObjectId, default: mongoose } = require("mongoose");
const AdviserModel = require("../models/AdviserModel");
const AttendanceModel = require("../models/AttendanceModel");
const SemesterModel = require("../models/SemesterModel");
const extractUserID = require("../utils/ExtractUserId");

const getAllSemester = async (req, res) => {
  const userId = extractUserID(req);

  try {
    const adviser = await AdviserModel.findOne({ user_id: userId });
    const semesters = await SemesterModel.find({ adviser_id: adviser._id });
    return res.status(200).json(semesters);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const getAllSemesterAttendances = async (req, res) => {
  const { id: semester_id } = req.params;

  if (!isValidObjectId(semester_id)) {
    return res.status(404).json({ error: "No such semester" });
  }

  const userId = extractUserID(req);
  const adviser = await AdviserModel.findOne({ user_id: userId });

  const attendances = await AttendanceModel.aggregate([
    {
      $lookup: {
        from: "semesters",
        localField: "semester_id",
        foreignField: "_id",
        as: "semester",
      },
    },
    {
      $unwind: "$semester", // Unwind the array created by $lookup (optional)
    },
    {
      $match: {
        semester_id: new mongoose.Types.ObjectId(semester_id),
        adviser_id: new mongoose.Types.ObjectId(adviser._id),
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
  ]);

  return res.status(200).json(attendances);
};

module.exports = {
  getAllSemester,
  getAllSemesterAttendances,
};
