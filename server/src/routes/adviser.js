const express = require("express");
const { createAdviser } = require("../controllers/AdviserController");
const router = express.Router();

router.post("/api/v1/adviser", createAdviser);

module.exports = router;
