const { isValidObjectId, default: mongoose } = require("mongoose");
const AdviserModel = require("../models/AdviserModel");
const extractUserID = require("../utils/ExtractUserId");
const AttendanceModel = require("../models/AttendanceModel");
const SemesterModel = require("../models/SemesterModel");
const StudentModel = require("../models/StudentModel");
const User = require("../models/UserModel");
const { messageBody } = require("../constants/MessageBody");
const { sendSms } = require("../utils/SendSMS");
const SubjectTeacherModel = require("../models/SubjectTeacherModel");
const { ADVISER, SUBJECT_TEACHER } = require("../constants/Roles");

const getAllAttendances = async (req, res) => {
  const attendances = await AttendanceModel.find();
  return res.status(200).json(attendances);
};

const getAttendance = async (req, res) => {
  const { id: attendanceId } = req.params;
  if (!isValidObjectId(attendanceId)) {
    return res.status(404).json({ error: "No such attendance" });
  }
  try {
    const attendance = await AttendanceModel.findById({ _id: attendanceId });
    return res.status(200).json(attendance);
  } catch (error) {
    return res.status(400).json({ error: "Something went wrong" });
  }
};

const getAllAdviserAttendances = async (req, res) => {
  const { adviserId } = req.params;
  if (!isValidObjectId(adviserId)) {
    return res.status(404).json({ error: "No such attendance" });
  }
  try {
    const attendances = await AttendanceModel.find({ adviser_id: adviserId });
    return res.status(200).json(attendances);
  } catch (error) {
    return res.status(400).json({ error: "Something went wrong" });
  }
};

const getAllSemesterAttendances = async (req, res) => {
  const { id: semester_id } = req.params;
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10;

  if (!isValidObjectId(semester_id)) {
    return res.status(404).json({ error: "No such semester" });
  }

  const userId = extractUserID(req);
  const user = await User.findOne({ _id: userId });

  let adviserId = "";

  if (user.role === ADVISER) {
    const adviser = await AdviserModel.findOne({ user_id: userId });
    adviserId = adviser._id;
  }

  if (user.role === SUBJECT_TEACHER) {
    const subj_teacher = await SubjectTeacherModel.findOne({ user_id: userId });
    adviserId = subj_teacher.adviser_id;
  }

  const totalAttendances = await AttendanceModel.countDocuments({
    adviser_id: adviserId,
    semester_id,
  });

  const totalPages = Math.ceil(totalAttendances / perPage);
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
        adviser_id: new mongoose.Types.ObjectId(adviserId),
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $skip: (page - 1) * perPage,
    },
    {
      $limit: perPage,
    },
  ]);

  return res.status(200).json({
    attendances,
    totalPages,
    currentPage: page,
  });
};

const createAttendance = async (req, res) => {
  const { semester_id } = req.body;
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10;

  if (!isValidObjectId(semester_id)) {
    return res.status(404).json({ error: "No such semester" });
  }

  const userId = extractUserID(req);
  const user = await User.findOne({ _id: userId });
  let adviserId = "";
  
  if (user.role === ADVISER) {
    const adviser = await AdviserModel.findOne({ user_id: userId });
    adviserId = adviser._id;
  }

  if (user.role === SUBJECT_TEACHER) {
    const subj_teacher = await SubjectTeacherModel.findOne({ user_id: userId });
    adviserId = subj_teacher.adviser_id;
  }

  const totalAttendances = await AttendanceModel.countDocuments({
    adviser_id: adviserId,
    semester_id,
  });
  const totalPages = Math.ceil(totalAttendances / perPage);

  const studentsList = [];
  const semester = await SemesterModel.findById(semester_id);
  for (const student of semester.students) {
    const stud = await StudentModel.findById(student.student_id);
    studentsList.push({
      student_id: stud._id,
      school_id: stud.school_id,
      full_name: `${stud.last_name}, ${stud.first_name} ${
        stud.middle_name !== "N/A"
          ? stud.middle_name[0].toUpperCase() + "."
          : ""
      }`,
      suffix: stud.suffix,
      gender: stud.gender,
      time_in_am: "",
      time_out_am: "",
      time_in_pm: "",
      time_out_pm: "",
    });
  }

  await AttendanceModel.create({
    semester_id,
    adviser_id: adviserId,
    status: true,
    students: studentsList,
  });

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
        adviser_id: new mongoose.Types.ObjectId(adviserId),
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $skip: (page - 1) * perPage,
    },
    {
      $limit: perPage,
    },
  ]);

  return res.status(200).json({
    attendances,
    totalPages,
    currentPage: page,
  });
};

const updateAttendance = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!isValidObjectId(id)) {
    return res.status(404).json({ error: "No such attendance" });
  }
  try {
    await AttendanceModel.findByIdAndUpdate({ _id: id }, { status });
    return res.status(200).json({ message: "Success" });
  } catch (error) {
    return res.status(400).json({ error: "Something went wrong" });
  }
};

const createStudentAttendance = async (req, res) => {
  const { id, studentId: student_id } = req.params;
  const { semester_id } = req.body;

  if (!isValidObjectId(id)) {
    return res.status(404).json({ error: "No such attendance" });
  }
  if (!isValidObjectId(student_id)) {
    return res.status(404).json({ error: "No such student" });
  }
  if (!isValidObjectId(semester_id)) {
    return res.status(404).json({ error: "No such semester" });
  }

  const attendance = await AttendanceModel.findById({ _id: id });
  const adviser = await AdviserModel.findById({ _id: attendance.adviser_id });
  const semester = await SemesterModel.findById({ _id: semester_id });
  const AttendanceStudents = attendance.students;
  const SemesterStudents = semester.students;

  // Return error if student not exist in Semester
  let existInSemester = false;
  for (const student of SemesterStudents) {
    if (student.student_id.equals(new mongoose.Types.ObjectId(student_id))) {
      existInSemester = true;
    }
  }
  if (!existInSemester) {
    return res
      .status(400)
      .json({ error: "student", message: "Student not exist in Semester." });
  }

  const student = getStudentInAttendance(AttendanceStudents, student_id);
  const currentStudent = await StudentModel.findOne({
    _id: student_id,
  });

  const time = new Date();
  // TIME IN AM
  if (!student.time_in_am) {
    await AttendanceModel.findOneAndUpdate(
      {
        _id: attendance._id,
        "students.student_id": student_id,
      },
      {
        $set: {
          "students.$.time_in_am": time,
        },
      }
    );
    sendSMS(true, currentStudent, student, time, semester, adviser);
  }

  // TIME OUT AM
  if (student.time_in_am && !student.time_out_am) {
    if (!isFiveMinutesPassed(student.time_in_am, time)) {
      return res.status(400).json({
        message: "You can scan again after 5 minutes.",
      });
    }

    await AttendanceModel.findOneAndUpdate(
      {
        _id: attendance._id,
        "students.student_id": student_id,
      },
      {
        $set: {
          "students.$.time_out_am": time,
        },
      }
    );
    sendSMS(false, currentStudent, student, time, semester, adviser);
  }

  // TIME IN PM
  if (student.time_in_am && student.time_out_am && !student.time_in_pm) {
    if (!isFiveMinutesPassed(student.time_out_am, time)) {
      return res.status(400).json({
        message: "You can scan again after 5 minutes.",
      });
    }

    await AttendanceModel.findOneAndUpdate(
      {
        _id: attendance._id,
        "students.student_id": student_id,
      },
      {
        $set: {
          "students.$.time_in_pm": time,
        },
      }
    );
    sendSMS(true, currentStudent, student, time, semester, adviser);
  }

  // TIME OUT PM
  if (
    student.time_in_am &&
    student.time_out_am &&
    student.time_in_pm &&
    !student.time_out_pm
  ) {
    if (!isFiveMinutesPassed(student.time_in_pm, time)) {
      return res.status(400).json({
        message: "You can scan again after 5 minutes.",
      });
    }

    await AttendanceModel.findOneAndUpdate(
      {
        _id: attendance._id,
        "students.student_id": student_id,
      },
      {
        $set: {
          "students.$.time_out_pm": time,
        },
      }
    );
    sendSMS(false, currentStudent, student, time, semester, adviser);
  }

  if (
    student.time_in_am &&
    student.time_out_am &&
    student.time_in_pm &&
    student.time_out_pm
  ) {
    return res.status(400).json({
      message: "Time out already exist.",
    });
  }

  const updatedAttendance = await AttendanceModel.findById({
    _id: attendance._id,
  });
  return res.status(200).json(updatedAttendance);
};

const getStudentInAttendance = (AttendanceStudents, student_id) => {
  for (const student of AttendanceStudents) {
    if (student.student_id.equals(new mongoose.Types.ObjectId(student_id))) {
      return student;
    }
  }
};

const isFiveMinutesPassed = (previousTime, time) => {
  const time1 = new Date(previousTime);
  const time2 = new Date(time);
  const timeDifference = Math.abs(time1 - time2);
  const fiveMinutesInMilliseconds = 5 * 60 * 1000;
  return timeDifference >= fiveMinutesInMilliseconds;
};

const sendSMS = (
  scanTime,
  currentStudent,
  student,
  time,
  semester,
  adviser
) => {
  sendSms(
    messageBody(
      scanTime,
      `${currentStudent.parent.first_name} ${
        currentStudent.parent.middle_name !== "N/A"
          ? currentStudent.parent.middle_name
          : ""
      }`,
      student.full_name,
      time,
      semester.section,
      adviser.last_name
    )
    // Add phone number here as 2nd parameter
  );
};

module.exports = {
  getAllAttendances,
  getAllAdviserAttendances,
  getAttendance,
  getAllSemesterAttendances,
  createAttendance,
  updateAttendance,
  createStudentAttendance,
};
