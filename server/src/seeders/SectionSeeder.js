require("dotenv").config();
const Section = require("../models/SectionModel");
const mongoose = require("mongoose");

const sections = [
    // GRADE 11
  {
    section: "Ayala",
    grade: 11
  },
  {
    section: "Cojuangco",
    grade: 11
  },
  {
    section: "Gokongwei",
    grade: 11
  },
  {
    section: "Sy",
    grade: 11
  },
  {
    section: "Tan",
    grade: 11
  },
  {
    section: "Zobel",
    grade: 11
  },
  {
    section: "Aquinas",
    grade: 11
  },
  {
    section: "Confucius",
    grade: 11
  },
  {
    section: "Gandhi",
    grade: 11
  },
  {
    section: "Hobbes",
    grade: 11
  },
  {
    section: "Kant",
    grade: 11
  },
  {
    section: "Lao tzu",
    grade: 11
  },
  {
    section: "Mencius",
    grade: 11
  },
  {
    section: "Plato",
    grade: 11
  },
  {
    section: "Rousseau",
    grade: 11
  },
  {
    section: "Socrates",
    grade: 11
  },
  {
    section: "Thales",
    grade: 11
  },
  {
    section: "Electrons",
    grade: 11
  },
  {
    section: "Neutrons",
    grade: 11
  },
  {
    section: "Protons",
    grade: 11
  },
  {
    section: "Da vinci",
    grade: 11
  },
  {
    section: "Olympus",
    grade: 11
  },
  {
    section: "Ampere",
    grade: 11
  },
  {
    section: "Blue marlins",
    grade: 11
  },
  {
    section: "Canapes",
    grade: 11
  },
  {
    section: "Carbon arc",
    grade: 11
  },
  {
    section: "Chevy",
    grade: 11
  },
  {
    section: "Electric arc",
    grade: 11
  },
  {
    section: "Ferrari",
    grade: 11
  },
  {
    section: "Gloss",
    grade: 11
  },
  {
    section: "Intel",
    grade: 11
  },
  {
    section: "Petit fours",
    grade: 11
  },
  {
    section: "Ryzen",
    grade: 11
  },
  {
    section: "Strix",
    grade: 11
  },
    //   GRADE 12
  {
    section: "Accounting",
    grade: 12
  },
  {
    section: "Bookkeeping",
    grade: 12
  },
  {
    section: "Chs_marx",
    grade: 12
  },
  {
    section: "Economics",
    grade: 12
  },
  {
    section: "Entrepreneurship",
    grade: 12
  },
  {
    section: "Finance",
    grade: 12
  },
  {
    section: "Management",
    grade: 12
  },
  {
    section: "Marketing",
    grade: 12
  },
  {
    section: "Chs_socrates",
    grade: 12
  },
  {
    section: "Comte",
    grade: 12
  },
  {
    section: "Durkheim",
    grade: 12
  },
  {
    section: "Freud",
    grade: 12
  },
  {
    section: "Weber",
    grade: 12
  },
  {
    section: "Andromeda",
    grade: 12
  },
  {
    section: "Hypergalaxy",
    grade: 12
  },
  {
    section: "Milkyway",
    grade: 12
  },
  {
    section: "G-12 Merton",
    grade: 12
  },
  {
    section: "Herodotus",
    grade: 12
  },
  {
    section: "Smith",
    grade: 12
  },
  {
    section: "Malthus",
    grade: 12
  },
  {
    section: "Piaget",
    grade: 12
  },
  {
    section: "Marx",
    grade: 12
  },
  {
    section: "Mozart",
    grade: 12
  },
  {
    section: "Skylark",
    grade: 12
  },
  {
    section: "Spartacus",
    grade: 12
  },
  {
    section: "Auto - chassis",
    grade: 12
  },
  {
    section: "Bon Appetit",
    grade: 12
  },
  {
    section: "Hors d'eouvres",
    grade: 12
  },
  {
    section: "Linux, lo'real",
    grade: 12
  },
  {
    section: "Macintosh",
    grade: 12
  },
  {
    section: "Metal arc",
    grade: 12
  },
  {
    section: "Microsoft",
    grade: 12
  },
  {
    section: "Pasteur",
    grade: 12
  },
  {
    section: "Piston",
    grade: 12
  },
  {
    section: "Plasma arc",
    grade: 12
  },
  {
    section: "Sparks",
    grade: 12
  },
  {
    section: "Tungsten",
    grade: 12
  },
  {
    section: "Arc",
    grade: 12
  },
  {
    section: "Voltage",
    grade: 12
  },
];

async function seedSections() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });

    // Drop all data first to avoid duplication
    await Section.deleteMany();

    for (const section of sections) {
      const sec = new Section(section);
      await sec.save();
    }
    console.log("Sections data seed successfully.");
  } catch (error) {
    console.error(`Error seeding data: ${error}`);
  } finally {
    mongoose.disconnect();
  }
}

module.exports = {
  seedSections,
};
