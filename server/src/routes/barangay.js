const express = require("express");
const { getAllBarangays } = require("../controllers/BarangayController");
const router = express.Router();

router.get("/api/v1/barangay", getAllBarangays);

module.exports = router;
