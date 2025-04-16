import express from "express";
import {
  createMessage,
  getAllMessages,
  getMessageById,
  getAllMessagesBettwenTwoUsers
} from "../controllers/message.controller.js";
const router = express.Router();
router.post("/", createMessage);
router.get("/", getAllMessages);
router.get("/between", getAllMessagesBettwenTwoUsers);
router.get("/:id", getMessageById);
export default router;
