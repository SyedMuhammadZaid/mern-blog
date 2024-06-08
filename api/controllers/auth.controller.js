import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export const signUp = async (req, res) => {
  const { userName, email, password } = req.body;

  if (
    !userName ||
    !email ||
    !password ||
    userName == "" ||
    email == "" ||
    password == ""
  ) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);
  
  const newUser = new User({
    userName,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.status(200).json({ message: "User is created" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
