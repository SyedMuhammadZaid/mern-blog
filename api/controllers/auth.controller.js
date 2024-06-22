import User from "../models/user.model.js";
import { errorHandler } from "../utils/errorHandler.js";
import UserModel from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from 'jsonwebtoken'

export const signUp = async (req, res, next) => {
  const { userName, email, password } = req.body;

  if (
    !userName ||
    !email ||
    !password ||
    userName == "" ||
    email == "" ||
    password == ""
  ) {
    next(errorHandler(400, "All fields are required"));
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
    res.status(200).json({ success: true, message: "User is created" });
  } catch (error) {
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password || email == "" || password == "") {
    next(errorHandler(400, "All fields are required"));
    return;
  }

  try {
    let emailValid = await UserModel.findOne({ email });
    if(!emailValid){
      next(errorHandler(404, 'Email not found'));
      return
    }
    const passwordValid = bcryptjs.compareSync(password, emailValid.password);
    if(!passwordValid){
      next(errorHandler(400, 'Incorrect Password'));
      return
    }

    const {password:pass, ...rest} = emailValid._doc;
    rest['success'] = true;
    const token = jwt.sign({id: emailValid._id} , process.env.JWT_SECRET);
    res.status(200).cookie('access_token', token, {
      httpOnly: true,
    })
    .json(rest)

  } catch (error) {
    next(NativeError)
  }
};
