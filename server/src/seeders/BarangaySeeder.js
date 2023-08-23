require("dotenv").config();
const Barangay = require("../models/BarangayModel");
const mongoose = require("mongoose");

const barangays = [
  {
    name: "Apopong"
  },
  {
    name: "Baluan"
  },
  {
    name: "Batomelong"
  },
  {
    name: "Buayan"
  },
  {
    name: "Bula"
  },
  {
    name: "Calumpang"
  },
  {
    name: "City Heights"
  },
  {
    name: "Conel"
  },
  {
    name: "Dadiangas East"
  },
  {
    name: "Dadiangas North"
  },
  {
    name: "Dadiangas South"
  },
  {
    name: "Dadiangas West"
  },
  {
    name: "Fatima"
  },
  {
    name: "Katangawan"
  },
  {
    name: "Labangal"
  },
  {
    name: "Lagao (1st & 3rd)"
  },
  {
    name: "Ligaya"
  },
  {
    name: "Mabuhay"
  },
  {
    name: "Olympog"
  },
  {
    name: "San Isidro (Lagao 2nd)"
  },
  {
    name: "San Jose"
  },
  {
    name: "Siguel"
  },
  {
    name: "Sinawal"
  },
  {
    name: "Tambler"
  },
  {
    name: "Tinagacan"
  },
  {
    name: "Upper Labay"
  },
];

async function seedBarangays() {
    try {
      await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });
      for (const barangay of barangays) {
        const bgy = new Barangay(barangay);
        await bgy.save();
      }
      console.log("Barangays data seed successfully.");
    } catch (error) {
      console.error(`Error seeding data: ${error}`);
    } finally {
      mongoose.disconnect();
    }
  }
  
  module.exports = {
      seedBarangays
  }
