const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const barangaySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Barangay", barangaySchema);
