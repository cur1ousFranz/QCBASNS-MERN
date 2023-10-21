const express = require("express");
const {
  createAdviser,
  getAdviser,
  getAdviserSubjectTeachers,
} = require("../controllers/AdviserController");
const router = express.Router();

router.get("/api/v1/adviser", getAdviser);
router.post("/api/v1/adviser", createAdviser);
router.get("/api/v1/adviser/subject/teacher", getAdviserSubjectTeachers);

module.exports = router;
