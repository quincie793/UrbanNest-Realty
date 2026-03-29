"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const messageController_1 = require("../controllers/messageController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const isAdmin_1 = require("../middlewares/isAdmin");
const router = (0, express_1.Router)();
// USER sends message
router.post("/", authMiddleware_1.authMiddleware, messageController_1.createMessage);
// ADMIN views all messages
router.get("/admin", authMiddleware_1.authMiddleware, isAdmin_1.isAdmin, messageController_1.getMessages);
// ADMIN replies to a message
router.post("/reply", authMiddleware_1.authMiddleware, isAdmin_1.isAdmin, messageController_1.replyMessage);
// USER: get their messages + replies
router.get("/", authMiddleware_1.authMiddleware, messageController_1.getUserMessages);
exports.default = router;
