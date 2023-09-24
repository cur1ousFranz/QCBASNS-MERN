const express = require("express");

const requireAuth = require("../middleware/RequiredAuth");
const {
  createStudent,
  updateStudent,
  getAllStudents,
  getStudent
} = require("../controllers/StudentController");
const router = express.Router();

router.use(requireAuth);

router.get("/api/v1/student", getAllStudents);
router.post("/api/v1/student", createStudent);
router.get("/api/v1/student/:id", getStudent);
router.put("/api/v1/student/:id", updateStudent);

module.exports = router;
