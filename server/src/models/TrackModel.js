const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const trackSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    strand:
      {
        type: [
          {
            strand_name: { type: String },
          },
        ],
      },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Track", trackSchema);
