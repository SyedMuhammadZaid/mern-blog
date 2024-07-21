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
    let data = await commentModel.find({ postId }).sort({updatedAt: -1});
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
