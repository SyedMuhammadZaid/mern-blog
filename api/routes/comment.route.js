import express from "express";
import { commentEdit, commentLikes, deleteComment, getComment, getComments, postComment } from "../controllers/comment.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/post", verifyToken, postComment);
router.get("/get/:postId", verifyToken, getComment);
router.put("/likes/:commentId", verifyToken, commentLikes);
router.put("/edit/:commentId", verifyToken, commentEdit);
router.delete("/delete/:commentId", verifyToken, deleteComment);
router.get("/get",verifyToken ,getComments);
export default router;
