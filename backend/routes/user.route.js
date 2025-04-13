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
  getUserByUsername
} from "../controllers/user.controller.js";
import { verifyAdmin, verifyToken } from "../middleware/auth.middleware.js";
const router = express.Router();
router.get("/me", getLoggedInUser);
router.get("/logout", logoutUser);
router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/", getAllUsers);
router.get("/:username", verifyToken, getUserByUsername);
router.get("/:id", verifyToken, getUserById);
router.put("/:id", verifyToken, updateUser);
router.delete("/:id", deleteUser);
router.delete("/", deleteAllUser);
export default router;
