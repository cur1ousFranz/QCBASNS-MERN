const { isValidObjectId, default: mongoose } = require("mongoose");
const AdviserModel = require("../models/AdviserModel");
const extractUserID = require("../utils/ExtractUserId");
const AttendanceModel = require("../models/AttendanceModel");
const SemesterModel = require("../models/SemesterModel");
const StudentModel = require("../models/StudentModel");
const { messageBody } = require("../constants/MessageBody");
const { sendSms } = require("../utils/SendSMS");

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
  const { semester_id } = req.body;

  if (!isValidObjectId(semester_id)) {
    return res.status(404).json({ error: "No such semester" });
  }
  const userId = extractUserID(req);
  const adviser = await AdviserModel.findOne({ user_id: userId });

  const studentsList = [];
  const semester = await SemesterModel.findById(semester_id);
  for (const student of semester.students) {
    const stud = await StudentModel.findById(student.student_id);
    studentsList.push({
      student_id: stud._id,
      school_id: stud.school_id,
      full_name: `${stud.last_name}, ${stud.first_name} ${
        stud.middle_name !== "N/A" ? stud.middle_name : ""
      } ${stud.suffix !== "N/A" ? stud.suffix : ""}`,
      gender: stud.gender,
      time_in_am: "",
      time_out_am: "",
      time_in_pm: "",
      time_out_pm: "",
    });
  }

  const createdAttendance = await AttendanceModel.create({
    semester_id,
    adviser_id: adviser._id,
    status: true,
    is_timein_am: true,
    is_timeout_am: false,
    is_timein_pm: false,
    is_timeout_pm: false,
    students: studentsList,
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
  // TIME_IN_AM
  if (attendance.is_timein_am) {
    if (!student.time_in_am) {
      const time = new Date();
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
    } else {
      return res.status(400).json({
        error: "time_in_am",
        message: "You already have Time In (AM).",
      });
    }
  }
  // TIME_OUT_AM
  if (attendance.is_timeout_am) {
    if (!student.time_in_am) {
      return res.status(400).json({
        error: "time_in_am",
        message: "You don't have Time In (AM) record.",
      });
    }
    if (!student.time_out_am) {
      const time = new Date();
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
    } else {
      return res.status(400).json({
        error: "time_out_am",
        message: "You already have Time Out (AM).",
      });
    }
  }
  // TIME_IN_PM
  if (attendance.is_timein_pm) {
    if (!student.time_in_pm) {
      const time = new Date();
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
    } else {
      return res.status(400).json({
        error: "time_in_pm",
        message: "You already have Time In (PM).",
      });
    }
  }
  // TIME_OUT_PM
  if (attendance.is_timeout_pm) {
    if (!student.time_in_pm) {
      return res.status(400).json({
        error: "time_in_pm",
        message: "You don't have Time In (PM) record.",
      });
    }
    if (!student.time_out_pm) {
      const time = new Date();
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
    } else {
      return res.status(400).json({
        error: "time_out_pm",
        message: "You already have Time Out (AM).",
      });
    }
  }

  const latestAttendance = await AttendanceModel.aggregate([
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
        _id: new mongoose.Types.ObjectId(attendance._id),
        semester_id: new mongoose.Types.ObjectId(semester_id),
        adviser_id: new mongoose.Types.ObjectId(attendance.adviser_id),
      },
    },
    {
      $limit: 1, // Limit the result to one document
    },
  ]);

  return res.status(200).json(latestAttendance[0]);
};

const getStudentInAttendance = (AttendanceStudents, student_id) => {
  for (const student of AttendanceStudents) {
    if (student.student_id.equals(new mongoose.Types.ObjectId(student_id))) {
      return student;
    }
  }
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
  getAllSemesterAttendances,
  createAttendance,
  updateAttendance,
  createStudentAttendance,
};
