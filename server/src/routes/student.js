const express = require("express");

const requireAuth = require("../middleware/RequiredAuth");
const { createStudent } = require("../controllers/StudentController");
const router = express.Router();

router.use(requireAuth);

router.post("/api/v1/student", createStudent);

module.exports = router;
