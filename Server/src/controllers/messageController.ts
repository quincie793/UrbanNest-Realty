import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// CREATE MESSAGE (user sends inquiry)
export const createMessage = async (req: Request, res: Response) => {
  try {
    const { content, propertyId } = req.body;
    const user = (req as any).user;

    const data: any = {
      content,
      userId: user.id,
    };

    if (propertyId !== undefined && propertyId !== null && propertyId !== '') {
      data.propertyId = Number(propertyId);
    }

    const message = await prisma.message.create({
      data,
    });

    res.status(201).json(message);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// ADMIN: GET ALL MESSAGES
export const getMessages = async (req: Request, res: Response) => {
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ADMIN: REPLY TO A MESSAGE
export const replyMessage = async (req: Request, res: Response) => {
  try {
    const { messageId, content } = req.body;

    if (!messageId || !content) {
      return res
        .status(400)
        .json({ error: "Message ID and content are required" });
    }

    const reply = await prisma.messageReply.create({
      data: {
        messageId: Number(messageId),
        content,
      },
    });

    res.status(201).json(reply);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
// USER: get messages (with admin replies)
export const getUserMessages = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const messages = await prisma.message.findMany({
      where: { userId: user.id },
      include: { 
        property: true,
       replies: true, // include admin replies
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(messages);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};