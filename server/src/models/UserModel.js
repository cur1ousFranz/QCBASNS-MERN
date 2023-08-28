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

userSchema.statics.login = async function (email, password) {
  if (!email || !password) throw Error("Please fill in all fields.");
  if (!validator.isEmail(email)) throw Error("Email is invalid.");

  const user = await this.findOne({ email });
  if (!user) throw Error("Invalid credentials");
  const match = await bcrypt.compare(password, user.password);
  if (!match) throw Error("Invalid credentials");

  return user;
};

module.exports = mongoose.model("User", userSchema);
