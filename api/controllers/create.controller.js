import { errorHandler } from "../utils/errorHandler.js";
import postSchema from "../models/post.model.js";

export const create = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to create a post"));
  }
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, "Please provide all required fields"));
  }
  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "");

  let newPost = new postSchema({
    ...req.body,
    slug,
    userId: req.user.id,
  });

  try {
    await newPost.save();
    res.status(201).json({ newPost, message: "Post Created" });
  } catch (error) {
    next(error)
  }
};
