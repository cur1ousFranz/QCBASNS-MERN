import mongoose from "mongoose";

const Schema = mongoose.Schema;

const adviserSchema = new Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    middle_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    suffix: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    birthdate: {
      type: String,
      required: true,
    },
    contact_number: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Adviser", adviserSchema);
