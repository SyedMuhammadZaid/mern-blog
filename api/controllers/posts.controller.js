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
    next(error);
  }
};

export const get = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order == "asc" ? 1 : -1;

    const posts = await postSchema
      .find({
        ...(req.query.userId && { userId: req.query.userId }),
        ...(req.query.category && { category: req.query.category }),
        ...(req.query.slug && { slug: req.query.slug }),
        ...(req.query.postId && { _id: req.query.postId }),
        ...(req.query.searchTerm && {
          $or: [
            { title: { $regex: new RegExp(req.query.searchTerm, "i") } },
            { content: { $regex: new RegExp(req.query.searchTerm, "i") } },
          ],
        }),
      })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await postSchema.countDocuments();

    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastsMonthPosts = await postSchema.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      posts,
      totalPosts,
      lastsMonthPosts,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to delete a post"));
  }
  try {
    await postSchema.findByIdAndDelete(req.params.postId);
    res.status(200).json("Post has been deleted");
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update a post"));
  }
  try {
    let updatedUPost = await postSchema.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title,
          category: req.body.category,
          content: req.body.content,
          image: req.body.image,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedUPost);
    
  } catch (error) {
    next(error);
  }
};
