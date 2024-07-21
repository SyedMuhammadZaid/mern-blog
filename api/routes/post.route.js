import express from "express";
import { create, deletePost, get, updatePost } from "../controllers/posts.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.post('/create',verifyToken, create);
router.get('/get', get);
router.delete('/delete/:postId/:userId',verifyToken, deletePost);
router.put("/update/:postId/:userId", verifyToken, updatePost)

export default router