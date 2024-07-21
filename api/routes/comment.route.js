import express from "express";
import { commentLikes, getComment, postComment } from "../controllers/comment.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/post", verifyToken, postComment);
router.get("/get/:postId", verifyToken, getComment);
router.put("/likes/:commentId", verifyToken, commentLikes)

export default router;
