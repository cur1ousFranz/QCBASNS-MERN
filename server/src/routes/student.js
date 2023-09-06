const express = require("express");

const requireAuth = require("../middleware/RequiredAuth");
const { createStudent, updateStudent, getAllStudents } = require("../controllers/StudentController");
const router = express.Router();

router.use(requireAuth);

router.get("/api/v1/student", getAllStudents);
router.post("/api/v1/student", createStudent);
router.put("/api/v1/student/:id", updateStudent);

module.exports = router;
