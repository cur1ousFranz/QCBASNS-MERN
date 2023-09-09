const express = require("express");
const {
  createAdviser,
  getAdviser,
} = require("../controllers/AdviserController");
const router = express.Router();

router.get("/api/v1/adviser", getAdviser);
router.post("/api/v1/adviser", createAdviser);

module.exports = router;
