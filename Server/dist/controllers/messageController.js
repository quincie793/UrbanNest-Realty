"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserMessages = exports.replyMessage = exports.getMessages = exports.createMessage = void 0;
/// <reference path="../types/express.d.ts" />
require("../types");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// CREATE MESSAGE (user sends inquiry)
const createMessage = async (req, res) => {
    try {
        const { content, propertyId } = req.body;
        const user = req.user;
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const data = {
            content,
            userId: user.id,
        };
        if (propertyId !== undefined && propertyId !== null && propertyId !== '' && !isNaN(Number(propertyId))) {
            data.propertyId = Number(propertyId);
        }
        const message = await prisma.message.create({
            data,
        });
        res.status(201).json(message);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};
exports.createMessage = createMessage;
// ADMIN: GET ALL MESSAGES
const getMessages = async (req, res) => {
    try {
        const messages = await prisma.message.findMany({
            include: {
                user: true,
                property: true,
                replies: true, // include replies
            },
            orderBy: { createdAt: "desc" },
        });
        res.json(messages);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getMessages = getMessages;
// ADMIN: REPLY TO A MESSAGE
const replyMessage = async (req, res) => {
    try {
        const { messageId, content } = req.body;
        if (!messageId || !content || isNaN(Number(messageId))) {
            return res
                .status(400)
                .json({ error: "Valid message ID and content are required" });
        }
        const reply = await prisma.messageReply.create({
            data: {
                messageId: Number(messageId),
                content,
            },
        });
        res.status(201).json(reply);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};
exports.replyMessage = replyMessage;
// USER: get messages (with admin replies)
const getUserMessages = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const messages = await prisma.message.findMany({
            where: { userId: user.id },
            include: {
                property: true,
                replies: true, // include admin replies
            },
            orderBy: { createdAt: "desc" },
        });
        res.json(messages);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getUserMessages = getUserMessages;
