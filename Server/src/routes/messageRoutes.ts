import { Router } from "express";
import {
  createMessage,
  getMessages,
  replyMessage,getUserMessages
} from "../controllers/messageController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { isAdmin } from "../middlewares/isAdmin";

const router = Router();

// USER sends message
router.post("/", authMiddleware, createMessage);

// ADMIN views all messages
router.get("/admin", authMiddleware, isAdmin, getMessages);

// ADMIN replies to a message
router.post("/reply", authMiddleware, isAdmin, replyMessage);

// USER: get their messages + replies
router.get("/", authMiddleware, getUserMessages);
export default router;