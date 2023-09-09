const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const attendanceSchema = new Schema(
  {
    semester_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Semester",
      required: true,
    },
    adviser_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Adviser",
      required: true,
    },
    students: {
      type: [
        {
          student_id: { type: mongoose.Schema.Types.ObjectId },
          school_id: { type: String },
          full_name: { type: String },
          time_in: { type: String },
          time_out: { type: String },
        },
      ],
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
    },
    is_timein: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
