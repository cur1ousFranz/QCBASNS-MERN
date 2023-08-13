import jwt from "jsonwebtoken";

export const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET_KEY, { expiresIn: "3h" });
};


