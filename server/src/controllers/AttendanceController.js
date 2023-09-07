const { isValidObjectId, default: mongoose } = require("mongoose");
const AdviserModel = require("../models/AdviserModel");
const extractUserID = require("../utils/ExtractUserId");
const AttendanceModel = require("../models/AttendanceModel");

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
        createdAt: -1, // Sort by createdAt in descending order (-1)
      },
    },
  ]);

  return res.status(200).json(attendances);
};

const createAttendance = async (req, res) => {
  const { semester_id, students } = req.body;

  const errorFields = [];
  const errorMessage = "Please fill in all fields";
  if (!semester_id) errorFields.push("semester_id");
  if (!students) errorFields.push("students");

  if (errorFields.length > 0) {
    return res.status(400).json({ error: errorMessage, errorFields });
  }

  if (!isValidObjectId(semester_id)) {
    return res.status(404).json({ error: "No such semester" });
  }
  const userId = extractUserID(req);
  const adviser = await AdviserModel.findOne({ user_id: userId });

  const createdAttendance = await AttendanceModel.create({
    semester_id,
    adviser_id: adviser._id,
    status: true,
  });

  const attendance = await AttendanceModel.aggregate([
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
        _id: new mongoose.Types.ObjectId(createdAttendance._id),
        semester_id: new mongoose.Types.ObjectId(semester_id),
        adviser_id: new mongoose.Types.ObjectId(adviser._id),
      },
    },
    {
      $limit: 1, // Limit the result to one document
    },
  ]);

  return res.status(200).json(attendance[0]);
};

const updateAttendance = async (req, res) => {
  const { id } = req.params;
  const updated = req.body;

  if (!isValidObjectId(id)) {
    return res.status(404).json({ error: "No such attendance" });
  }

  await AttendanceModel.findByIdAndUpdate({ _id: id }, { ...updated });
  const updatedAttendance = await AttendanceModel.findById(id);

  const attendance = await AttendanceModel.aggregate([
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
        _id: new mongoose.Types.ObjectId(updatedAttendance._id),
        semester_id: new mongoose.Types.ObjectId(updatedAttendance.semester_id),
        adviser_id: new mongoose.Types.ObjectId(updatedAttendance.adviser_id),
      },
    },
    {
      $limit: 1, // Limit the result to one document
    },
  ]);
  
  return res.status(200).json(attendance[0]);
};

module.exports = {
  getAllSemesterAttendances,
  createAttendance,
  updateAttendance
};
