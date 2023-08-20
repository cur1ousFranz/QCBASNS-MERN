const Track = require("../models/TrackModel");

const getAllTracks = async (req, res) => {
  const tracks = await Track.find();
  return res.status(200).json(tracks);
};

module.exports = {
  getAllTracks,
};
