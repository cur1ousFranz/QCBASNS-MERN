const express = require("express");
const {
  getAllSemester,
  getSemester,
  createSemester,
  updateSemester,
  getSemesterStudents,
  addStudentToSemester
} = require("../controllers/SemesterController");
const requireAuth = require("../middleware/RequiredAuth");
const router = express.Router();

// middleware
router.use(requireAuth);
router.get("/api/v1/semester", getAllSemester);
router.get("/api/v1/semester/:id", getSemester);
router.get("/api/v1/semester/:id/student", getSemesterStudents);
router.post("/api/v1/semester", createSemester);
router.put("/api/v1/semester/:id", updateSemester);
router.post("/api/v1/semester/:id", addStudentToSemester);

module.exports = router;
