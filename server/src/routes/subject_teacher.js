const express = require("express");
const {
  getSubjectTeacher,
  createSubjectTeacher,
} = require("../controllers/SubjectTeacherController");
const router = express.Router();
const requireAuth = require("../middleware/RequiredAuth");

router.use(requireAuth);
router.get("/api/v1/subject/teacher", getSubjectTeacher);
router.post("/api/v1/subject/teacher", createSubjectTeacher);

module.exports = router;
