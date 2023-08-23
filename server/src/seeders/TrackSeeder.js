require("dotenv").config();
const Track = require("../models/TrackModel");
const mongoose = require("mongoose");

const tracks = [
  {
    name: "TVL (Technical Vocational Livelihood)",
    strand: [
      {
        strand_name: "Home Economics",
      },
      {
        strand_name: "Agri-Fishiries Arts",
      },
      {
        strand_name: "Industrial Arts",
      },
      {
        strand_name: "ICT",
      },
    ],
  },
  {
    name: "Academic Track",
    strand: [
      {
        strand_name: "HUMSS",
      },
      {
        strand_name: "STEM",
      },
      {
        strand_name: "ABM",
      },
      {
        strand_name: "ARTS AND DESIGN",
      },
      {
        strand_name: "SPORTS",
      },
    ],
  },
  {
    name: "Arts and Design",
    strand: [],
  },
  {
    name: "Sports",
    strand: [],
  },
];

async function seedTracks() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });

    for (const trackData of tracks) {
      const track = new Track(trackData);
      await track.save();
    }

    console.log("Tracks data seed successfully.");
  } catch (error) {
    console.error(`Error seeding data: ${error}`);
  } finally {
    mongoose.disconnect();
  }
}

module.exports = {
    seedTracks
}