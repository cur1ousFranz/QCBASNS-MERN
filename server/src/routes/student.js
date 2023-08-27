const express = require("express");

const requireAuth = require("../middleware/RequiredAuth");
const { createStudent, updateStudent } = require("../controllers/StudentController");
const router = express.Router();

router.use(requireAuth);

router.post("/api/v1/student", createStudent);
router.put("/api/v1/student/:id", updateStudent);

module.exports = router;
