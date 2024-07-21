import express from "express";
import { deleteUser, getUser, getUsers, signOut, test, updateUser, userDelete } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/test", test);
router.put("/update/:userId", verifyToken, updateUser);
router.delete("/delete/:userId", verifyToken, deleteUser);
router.post("/signout", signOut)
router.get("/getUsers" , verifyToken, getUsers);
router.delete("/delete/:userIdToDelete/:userId", verifyToken, userDelete);
router.get("/getUser/:userId", getUser)

export default router;
