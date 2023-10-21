const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const subjectTeacher = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    adviser_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SubjectTeacher", subjectTeacher);
