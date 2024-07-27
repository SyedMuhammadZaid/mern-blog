import { errorHandler } from "../utils/errorHandler.js";
import commentModel from "../models/comment.model.js";

export const postComment = async (req, res, next) => {
  if (req.user.id !== req.body.userId)
    return next(errorHandler(403, "Your are not authorized to post a comment"));
  try {
    const newComment = new commentModel({
      content: req.body.content,
      postId: req.body.postId,
      userId: req.body.userId,
    });
    await newComment.save();
    res.json({ status: 200, newComment, message: "Comment Added" });
  } catch (error) {
    next(error);
  }
};

export const getComment = async (req, res, next) => {
  if (!req.user.id)
    return next(errorHandler(403, "Your are not authorized to get a comment"));
  try {
    const postId = req.params.postId;
    let data = await commentModel.find({ postId }).sort({ updatedAt: -1 });
    res.json({ status: 200, data });
  } catch (error) {
    next(error);
  }
};

export const commentLikes = async (req, res, next) => {
  let { commentId } = req.params;
  try {
    let comment = await commentModel.findById(commentId);
    if (!comment) return errorHandler(403, "comment not found");
    let userLike = comment.likes.indexOf(req.user.id);
    if (userLike == -1) {
      comment.numberOfLikes += 1;
      comment.likes.push(req.user.id);
    } else {
      comment.numberOfLikes -= 1;
      comment.likes.splice(userLike, 1);
    }
    await comment.save();
    res.json({ status: 200, comment });
  } catch (error) {
    next(error);
  }
};

export const commentEdit = async (req, res, next) => {
  let { commentId } = req.params;
  try {
    let comment = await commentModel.find({ _id: commentId });
    if (!comment) return errorHandler(403, "comment not found");
    if (comment?.userId !== req.user.id && !req.user.isAdmin) {
      return errorHandler(403, "You are not authorized to edit this");
    }
    let comm = await commentModel.findByIdAndUpdate(
      commentId,
      { content: req.body.content },
      { new: true }
    );

    return res.status(200).json(comm);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  let { commentId } = req.params;
  try {
    let comment = await commentModel.find({ _id: commentId });
    if (!comment) return errorHandler(403, "comment not found");
    if (comment?.userId !== req.user.id && !req.user.isAdmin) {
      return errorHandler(403, "You are not authorized to edit this");
    }
    await commentModel.findByIdAndDelete(commentId);
    return res.status(200).json();
  } catch (error) {
    next(error);
  }
};

export const getComments = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "you are now allowed to see all comments"));
  }
  try {
    let startIndex = parseInt(req.query.startIndex) || 0;
    let limit = parseInt(req.query.limit) || 9;
    let sortDirection = req.query.sort === "desc" ? -1 : 1;
    let comments = await commentModel
      .find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
    const totalDocuments = await commentModel.countDocuments();

    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastsMonthComments = await commentModel.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    return res.json({
      status: 200,
      comments,
      totalDocuments,
      lastsMonthComments,
    });

  } catch (error) {
    next(error);
  }
};
