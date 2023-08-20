const express = require("express");
const { getAllTracks } = require("../controllers/TrackController");
const router = express.Router();


router.get("/api/v1/track", getAllTracks);

module.exports = router;