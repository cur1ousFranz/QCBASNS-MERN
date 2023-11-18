const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const sectionSchema = new Schema(
  {
    section: { type: String, required: true},
    grade: { type: Number, required: true}
  },
  { timestamps: true }
);

module.exports = mongoose.model("Section", sectionSchema);
