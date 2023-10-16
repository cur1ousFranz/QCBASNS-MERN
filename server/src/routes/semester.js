const express = require("express");
const {
  getAllSemester,
  getSemester,
  createSemester,
  updateSemester,
  getSemesterStudents,
  addStudentToSemester,
  addExistingStudentsToSemester,
  removeStudentToSemester
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
router.put("/api/v1/semester/:id/existing", addExistingStudentsToSemester);
router.post("/api/v1/semester/:id", addStudentToSemester);
router.delete("/api/v1/semester/:id/student/:studentId", removeStudentToSemester)

module.exports = router;
