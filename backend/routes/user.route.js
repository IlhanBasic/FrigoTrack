import express from "express";
import {
  createUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getLoggedInUser,
  deleteAllUser,
  logoutUser,
  getUserByUsername,
} from "../controllers/user.controller.js";
import { verifyAdmin, verifyToken } from "../middleware/auth.middleware.js";
const router = express.Router();
router.get("/me", getLoggedInUser);
router.get("/logout", verifyToken, logoutUser);
router.post("/register", verifyToken, verifyAdmin, createUser);
router.post("/login", loginUser);
router.get("/",verifyToken, getAllUsers);
router.get("/:username", verifyToken, getUserByUsername);
router.get("/:id", verifyToken, getUserById);
router.put("/:id", verifyToken, verifyAdmin, updateUser);
router.delete("/:id", verifyAdmin, verifyAdmin, deleteUser);
router.delete("/", verifyAdmin, verifyAdmin, deleteAllUser);
export default router;
