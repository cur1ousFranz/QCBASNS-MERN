const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const studentSchema = new Schema(
  {
    school_id: {
      type: String,
      required: true,
    },
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
    },
    parent: {
      type: {
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
        },
        gender: {
          type: String,
          required: true,
        },
        contact_number: {
          type: String,
          required: true,
        },
        relationship: {
          type: String,
          required: true,
        },
      },
    },
    address: {
      type: {
        village: { type: String },
        street: { type: String },
        barangay: { type: String },
        city: { type: String },
      },
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Students", studentSchema);
