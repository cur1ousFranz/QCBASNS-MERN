const express = require("express");
const { getAllSemester, createSemester } = require("../controllers/SemesterController");
const requireAuth = require("../middleware/RequiredAuth");
const router = express.Router();

// middleware
router.use(requireAuth);
router.get("/api/v1/semester", getAllSemester);
router.post("/api/v1/semester", createSemester);

module.exports = router;
