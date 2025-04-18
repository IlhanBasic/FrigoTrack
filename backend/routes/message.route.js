import express from "express";
import {
  createMessage,
  getAllMessages,
  getMessageById,
  getAllMessagesBettwenTwoUsers
} from "../controllers/message.controller.js";
import { verifyAdmin, verifyToken } from "../middleware/auth.middleware.js";
const router = express.Router();
router.post("/",verifyToken, createMessage);
router.get("/",verifyToken,verifyAdmin, getAllMessages);
router.get("/between",verifyToken, getAllMessagesBettwenTwoUsers);
router.get("/:id",verifyToken, getMessageById);
export default router;
