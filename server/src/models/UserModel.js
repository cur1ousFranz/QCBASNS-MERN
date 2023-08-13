const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const Schema = mongoose.Schema;

const userSchema = Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.statics.signup = async function (email, password, role) {
  if (!email) throw Error("Email is required.");
  if (!password) throw Error("Password is required.");
  if (!validator.isEmail(email)) throw Error("Email is invalid.");
  const exist = await this.findOne({ email });
  if (exist) throw Error("Email already exist.");

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const user = await this.create({ email, password: hash, role });
  return user;
};

module.exports = mongoose.model("User", userSchema);
