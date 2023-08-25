const { isValidObjectId } = require("mongoose");
const Adviser = require("../models/AdviserModel");
const Semester = require("../models/SemesterModel");
const extractUserID = require("../utils/ExtractUserId");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const Student = require("../models/StudentModel");

const getAllSemester = async (req, res) => {
  const userId = extractUserID(req);
  const adviser = await Adviser.findOne({ user_id: userId });
  const semesters = await Semester.find({ adviser_id: adviser._id }).sort({ createdAt: -1});
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
    active,
  } = req.body;

  const errorFields = [];
  const errorMessage = "Please fill in all fields";
  if (!semester) errorFields.push("semester");
  if (!track) errorFields.push("track");
  if (!grade_level) errorFields.push("grade_level");
  if (!section) errorFields.push("section");
  if (!start_year) errorFields.push("school_year");
  if (!end_year) errorFields.push("school_year");
  if (!active) errorFields.push("active");
  if (errorFields.length > 0) {
    return res.status(400).json({ error: errorMessage, errorFields });
  }
  const userId = extractUserID(req);
  const adviser = await Adviser.findOne({ user_id: userId });
  const newSemester = {
    adviser_id: adviser._id,
    semester,
    track,
    strand,
    grade_level,
    section,
    students: [],
    start_year,
    end_year,
    active,
  };
  const result = await Semester.create(newSemester);
  return res.status(200).json(result);
};

const updateSemester = async (req, res) => {
  const updated = req.body;
  const userId = extractUserID(req);
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(404).json({ error: "No such semeester" });
  }

  const adviser = await Adviser.findOne({ user_id: userId });
  await Semester.findByIdAndUpdate(
    { adviser_id: adviser._id, _id: id },
    { ...updated }
  );

  const semester = await Semester.findById({ _id: id });

  if (!semester) {
    return res.status(400).json({ error: "Cannot find semester" });
  }

  return res.status(200).json(semester);
};

const addStudentToSemester = async (req, res) => {
  const { student_id } = req.body;
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(404).json({ error: "No such semeester" });
  }

  try {
    const sem = await Semester.findById({ _id: id });
    const students = sem.students;

    const newStudents = [...students, { student_id: new ObjectId(student_id) }];
    await Semester.findByIdAndUpdate({ _id: id }, { students: newStudents });
    const semester = await Semester.findById({ _id: id });

    return res.status(200).json(semester);
  } catch (error) {
    return res.status(400).json(error);
  }
};

const getSemesterStudents = async (req, res) => {
  const { id } = req.params;

  const semester = await Semester.findById(id);
  const students = semester.students;
  const studentList = [];
  for (const student of students) {
    const result = await Student.findById({ _id: student.student_id });
    studentList.push(result);
  }
  return res.status(200).json(studentList);
};

module.exports = {
  getAllSemester,
  createSemester,
  updateSemester,
  getSemesterStudents,
  addStudentToSemester,
};
