import jwt from "jsonwebtoken";

export const createToken = (user_id) => {
  return jwt.sign({ _id: user_id }, process.env.SECRET_KEY, { expiresIn: "3h" });
};


