const Barangay = require("../models/BarangayModel");

const getAllBarangays = async (req, res) => {
  const barangays = await Barangay.find();
  return res.status(200).json(barangays);
};

module.exports = {
  getAllBarangays,
};
