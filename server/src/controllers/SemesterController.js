const { isValidObjectId } = require("mongoose");
const Adviser = require("../models/AdviserModel");
const Semester = require("../models/SemesterModel");
const extractUserID = require("../utils/ExtractUserId");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const Student = require("../models/StudentModel");
const AttendanceModel = require("../models/AttendanceModel");

const getAllSemester = async (req, res) => {
  const userId = extractUserID(req);
  try {
    const adviser = await Adviser.findOne({ user_id: userId });
    const semesters = await Semester.find({ adviser_id: adviser._id }).sort({
      createdAt: -1,
    });
    return res.status(200).json(semesters);
  } catch (error) {
    return res.status(400).json({ error: "Something went wrong!" });
  }
};

const getSemester = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(404).json({ error: "No such semeester" });
  }
  const userId = extractUserID(req);
  const adviser = await Adviser.findOne({ user_id: userId });
  const semester = await Semester.findOne({ _id: id, adviser_id: adviser._id });
  return res.status(200).json(semester);
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
    timein_am,
    timeout_am,
    timein_pm,
    timeout_pm
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
  if (!timein_am) errorFields.push("timein_am");
  if (!timeout_am) errorFields.push("timeout_am");
  if (!timein_pm) errorFields.push("timein_pm");
  if (!timeout_pm) errorFields.push("timeout_pm");
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
    timein_am,
    timeout_am,
    timein_pm,
    timeout_pm
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

    // Insert the student in Active attendance if there is
    const attendance = await AttendanceModel.find({
      semester_id: id,
      status: true,
    });
    if (attendance) {
      const student = await Student.findById({ _id: student_id });
      const students = attendance[0].students;
      const newStudents = [
        ...students,
        {
          student_id: student._id,
          school_id: student.school_id,
          full_name: `${student.last_name}, ${student.first_name} ${
            student.middle_name !== "N/A" ? student.middle_name[0].toUpperCase() + "." : ""
          } ${student.suffix !== "N/A" ? student.suffix : ""}`,
          gender: student.gender,
          time_in_am: "",
          time_out_am: "",
          time_in_pm: "",
          time_out_pm: "",
        },
      ];

      await AttendanceModel.findByIdAndUpdate(
        { _id: attendance[0]._id },
        { students: newStudents }
      );
    }

    return res.status(200).json(semester);
  } catch (error) {
    return res.status(400).json(error);
  }
};

const addExistingStudentsToSemester = async (req, res) => {
  const { id } = req.params;
  const { students } = req.body;

  if (!isValidObjectId(id)) {
    return res.status(404).json({ error: "No such semeester" });
  }

  try {
    for (const studentId of students) {
      const sem = await Semester.findById({ _id: id });
      const existingStudents = sem.students;
      const newStudents = [
        ...existingStudents,
        { student_id: new ObjectId(studentId) },
      ];
      await Semester.findByIdAndUpdate({ _id: id }, { students: newStudents });

      // Insert the student in Active attendance if there is
      const attendance = await AttendanceModel.find({
        semester_id: id,
        status: true,
      });
      if (attendance[0]) {
        const student = await Student.findById({ _id: studentId });
        const students = attendance[0].students;
        const newStudents = [
          ...students,
          {
            student_id: student._id,
            school_id: student.school_id,
            full_name: `${student.last_name}, ${student.first_name} ${
              student.middle_name !== "N/A" ? student.middle_name[0].toUpperCase() + "." : ""
            } ${student.suffix !== "N/A" ? student.suffix : ""}`,
            gender: student.gender,
            time_in_am: "",
            time_out_am: "",
            time_in_pm: "",
            time_out_pm: "",
          },
        ];

        await AttendanceModel.findByIdAndUpdate(
          { _id: attendance[0]._id },
          { students: newStudents }
        );
      }
    }

    const semester = await Semester.findById({ _id: id });
    const semesterStudents = semester.students;
    const studentList = [];
    for (const student of semesterStudents) {
      const result = await Student.findById({ _id: student.student_id });
      studentList.push(result);
    }
    return res.status(200).json(studentList);
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
  getSemester,
  createSemester,
  updateSemester,
  getSemesterStudents,
  addStudentToSemester,
  addExistingStudentsToSemester,
};
