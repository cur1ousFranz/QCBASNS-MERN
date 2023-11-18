const express = require("express");
const { getAllSections } = require("../controllers/SectionController");
const router = express.Router();


router.get("/api/v1/section", getAllSections);

module.exports = router;