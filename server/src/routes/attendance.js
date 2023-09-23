const express = require("express");
const {
  getAllSemesterAttendances,
  createAttendance,
  updateAttendance,
  createStudentAttendance,
  getAllAttendances
} = require("../controllers/AttendanceController");
const router = express.Router();

router.get("/api/v1/attendance", getAllAttendances);
router.get("/api/v1/attendance/semester/:id", getAllSemesterAttendances);
router.post("/api/v1/attendance", createAttendance);
router.put("/api/v1/attendance/:id", updateAttendance);
router.put("/api/v1/attendance/:id/student/:studentId", createStudentAttendance);

module.exports = router;
