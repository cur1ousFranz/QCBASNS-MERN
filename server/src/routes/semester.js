const express = require("express");
const { createSemester } = require("../controllers/SemesterController");
const requireAuth = require("../middleware/RequiredAuth");
const router = express.Router();

// middleware
router.use(requireAuth);
router.post("/api/v1/semester", createSemester);

module.exports = router;
