const { isValidObjectId } = require("mongoose");
const Adviser = require("../models/AdviserModel");
const Semester = require("../models/SemesterModel");
const extractUserID = require("../utils/ExtractUserId");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const Student = require("../models/StudentModel");
const AttendanceModel = require("../models/AttendanceModel");
const User = require("../models/UserModel");
const SubjectTeacher = require("../models/SubjectTeacherModel")
const { ADVISER, SUBJECT_TEACHER } = require("../constants/Roles");


const getAllSemester = async (req, res) => {
  const userId = extractUserID(req);
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 7;
  const user = await User.findOne({ _id: userId });
  try {
    let adviserId = "";

    if (user.role === ADVISER) {
      const adviser = await Adviser.findOne({ user_id: userId });
      adviserId = adviser._id;
    }

    if (user.role === SUBJECT_TEACHER) {
      const subj_teacher = await SubjectTeacher.findOne({ user_id: userId });
      adviserId = subj_teacher.adviser_id;
    }

    const totalSemesters = await Semester.countDocuments({
      adviser_id: adviserId,
    });

    const totalPages = Math.ceil(totalSemesters / perPage);

    const semesters = await Semester.find({ adviser_id: adviserId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage);

    return res.status(200).json({
      semesters,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    return res.status(400).json({ error: error.errorMessage});
  }
};

const getSemester = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(404).json({ error: "No such semeester" });
  }
  const userId = extractUserID(req);
  const user = await User.findOne({ _id: userId });
  let adviserId = "";

  if (user.role === ADVISER) {
    const adviser = await Adviser.findOne({ user_id: userId });
    adviserId = adviser._id;
  }

  if (user.role === SUBJECT_TEACHER) {
    const subj_teacher = await SubjectTeacher.findOne({ user_id: userId });
    adviserId = subj_teacher.adviser_id;
  }

  const semester = await Semester.findOne({ _id: id, adviser_id: adviserId });
  return res.status(200).json(semester);
};

const createSemester = async (req, res) => {
  const {
    semester,
    track,
    strand,
    grade_level,
    section,
    start_month = "N/A",
    end_month = "N/A",
    start_year,
    end_year,
    active,
    timein_am,
    timeout_am,
    timein_pm,
    timeout_pm,
  } = req.body;
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10;

  const errorFields = [];
  const errorMessage = "Please fill in all fields";
  if (!semester) errorFields.push("semester");
  if (!track) errorFields.push("track");
  if (!grade_level) errorFields.push("grade_level");
  if (!section) errorFields.push("section");
  // if (!start_month) errorFields.push("start_month");
  // if (!end_month) errorFields.push("end_month");
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

  try {
    const userId = extractUserID(req);
    const adviser = await Adviser.findOne({ user_id: userId });

    // Set the latest Semester of adviser to inactive
    const lastActiveSemester = await Semester.findOne({
      adviser_id: adviser._id,
      active: true,
    });
    if (lastActiveSemester)
      await Semester.findByIdAndUpdate(
        { _id: lastActiveSemester._id, adviser_id: adviser._id },
        { active: false }
      );

    const newSemester = {
      adviser_id: adviser._id,
      semester,
      track,
      strand,
      grade_level,
      section,
      students: [],
      start_month,
      end_month,
      start_year,
      end_year,
      active,
      timein_am,
      timeout_am,
      timein_pm,
      timeout_pm,
    };
    await Semester.create(newSemester);

    const totalSemesters = await Semester.countDocuments({
      adviser_id: adviser._id,
    });

    const totalPages = Math.ceil(totalSemesters / perPage);
    const semesters = await Semester.find({ adviser_id: adviser._id })
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage);

    return res.status(200).json({
      semesters,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const updateSemester = async (req, res) => {
  const updated = req.body;
  const userId = extractUserID(req);
  const { id } = req.params;
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10;

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

  const totalSemesters = await Semester.countDocuments({
    adviser_id: adviser._id,
  });

  const totalPages = Math.ceil(totalSemesters / perPage);
  const semesters = await Semester.find({ adviser_id: adviser._id })
    .sort({ createdAt: -1 })
    .skip((page - 1) * perPage)
    .limit(perPage);

  return res.status(200).json({
    semesters,
    totalPages,
    currentPage: page,
  });
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
    if (attendance.length) {
      const student = await Student.findById({ _id: student_id });
      const students = attendance[0].students;
      const newStudents = [
        ...students,
        {
          student_id: student._id,
          school_id: student.school_id,
          full_name: `${student.last_name}, ${student.first_name} ${
            student.middle_name !== "N/A"
              ? student.middle_name[0].toUpperCase() + "."
              : ""
          }`,
          suffix: student.suffix !== "N/A" ? student.suffix : "",
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
              student.middle_name !== "N/A"
                ? student.middle_name[0].toUpperCase() + "."
                : ""
            }`,
            suffix: student.suffix !== "N/A" ? student.suffix : "",
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

const removeStudentToSemester = async (req, res) => {
  const { id: semesterId, studentId } = req.params;
  if (!isValidObjectId(semesterId)) {
    return res.status(404).json({ error: "No such semeester" });
  }
  if (!isValidObjectId(studentId)) {
    return res.status(404).json({ error: "No such student" });
  }

  try {
    const semester = await Semester.findById({ _id: semesterId });
    const semesterStudents = semester.students;
    const updatedStudents = semesterStudents.filter((student) => {
      if (student.student_id.toString() !== studentId) {
        return student;
      }
    });
    await Semester.findByIdAndUpdate(
      { _id: semesterId },
      { students: updatedStudents }
    );

    // Remove the student in Active attendance if there is
    const attendance = await AttendanceModel.find({
      semester_id: semesterId,
      status: true,
    });
    if (attendance[0]) {
      const currentStudents = attendance[0].students;
      const newStudents = currentStudents.filter(
        (student) => student.student_id.toString() !== studentId
      );
      await AttendanceModel.findByIdAndUpdate(
        { _id: attendance[0]._id },
        { students: newStudents }
      );
    }

    const updatedSemester = await Semester.findById({ _id: semesterId });
    const updatedSemesterStudents = updatedSemester.students;
    const studentList = [];
    for (const student of updatedSemesterStudents) {
      const result = await Student.findById({ _id: student.student_id });
      studentList.push(result);
    }
    return res.status(200).json(studentList);
  } catch (error) {
    return res.status(500).json(error);
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
  removeStudentToSemester,
};
