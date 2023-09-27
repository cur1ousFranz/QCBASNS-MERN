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
          suffix: { type: String },
          gender: { type: String },
          time_in_am: { type: String },
          time_out_am: { type: String },
          time_in_pm: { type: String },
          time_out_pm: { type: String },
        },
      ],
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
