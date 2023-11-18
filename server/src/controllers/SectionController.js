const Section = require("../models/SectionModel");

const getAllSections = async (req, res) => {
  const sections = await Section.find();
  return res.status(200).json(sections);
};

module.exports = {
    getAllSections,
};
