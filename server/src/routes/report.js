const express = require("express");

const requireAuth = require("../middleware/RequiredAuth");
const {
  getAllSemester,
  getAllSemesterAttendances,
} = require("../controllers/ReportController");
const router = express.Router();

// middleware
router.use(requireAuth);
router.get("/api/v1/report/semester", getAllSemester);
router.get("/api/v1/report/attendance/semester/:id", getAllSemesterAttendances);

module.exports = router;
