import { errorHandler } from "../utils/errorHandler.js";
import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";

export const test = (req, res) => {
  res.json({ message: "api created" });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update the user"));
  }
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(
        errorHandler(400, "Password length must be atleast 6 characters")
      );
    }
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }
  if (req.body.userName) {
    if (req.body.userName.length < 7 || req.body.userName.length > 20) {
      return next(
        errorHandler(400, "userName must be between 7 and 20 characters")
      );
    }
    if (req.body.userName.includes(" ")) {
      return next(errorHandler(400, "userName cannot contain spaces"));
    }
    if (req.body.userName !== req.body.userName.toLowerCase()) {
      return next(errorHandler(400, "userName must be in lowercase"));
    }
    if (!req.body.userName.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        errorHandler(400, "userName can only contain letters and numbers")
      );
    }
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          userName: req.body.userName,
          email: req.body.email,
          password: req.body.password,
          profilePicture: req.body.profilePicture,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update the user"));
  }
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json("User has been deleted successfully");
  } catch (error) {
    next(error);
  }
};

export const signOut = (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json("User has been signed out");
  } catch (error) {
    next(error);
  }
};
