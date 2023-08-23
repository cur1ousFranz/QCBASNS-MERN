const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const semesterSchema = new Schema(
  {
    adviser_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    semester: {
      type: String,
      required: true,
    },
    track: {
      type: String,
      required: true,
    },
    strand: {
      type: String,
      required: true,
    },
    grade_level: {
      type: String,
      required: true,
    },
    section: {
      type: String,
      required: true,
    },
    students: {
      type: [
        {
          student_id: { type: mongoose.Schema.Types.ObjectId, required: true },
        },
      ],
    },
    start_year: {
      type: String,
      required: true,
    },
    end_year: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Semester", semesterSchema);
