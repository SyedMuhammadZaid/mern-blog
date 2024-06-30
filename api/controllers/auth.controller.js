import User from "../models/user.model.js";
import { errorHandler } from "../utils/errorHandler.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

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
  console.log(email,password)
  if (!email || !password || email == "" || password == "") {
    next(errorHandler(400, "All fields are required"));
    return;
  }

  try {
    let emailValid = await User.findOne({ email });
    if (!emailValid) {
      next(errorHandler(404, "Email not found"));
      return;
    }
    const passwordValid = bcryptjs.compareSync(password, emailValid.password);
    if (!passwordValid) {
      next(errorHandler(400, "Incorrect Password"));
      return;
    }

    const { password: pass, ...rest } = emailValid._doc;
    rest["success"] = true;
    const token = jwt.sign({ id: emailValid._id }, process.env.JWT_SECRET);
    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};


export const google = async (req, res, next) => {
  const { name, email, googlePhotoUrl } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      const { password: pass, ...rest } = user._doc;
      rest["success"] = true;
      let token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    }
    else{
      let genPass = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      let encryptedPassword = bcryptjs.hashSync(genPass, 10);
      let user = new User({
        userName: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
        email: email,
        password: encryptedPassword,
        profilePicture: googlePhotoUrl
      })
      await user.save();
      let token = bcryptjs.sign({id: user._id}, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      rest["success"] = true;
      res.status(200).cookie('access_token',token,{httpOnly: true}).json(rest);
    }
  } catch (error) {
    next(error)
  }
};
