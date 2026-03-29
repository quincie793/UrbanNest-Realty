import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types";
import {prisma} from "../lib/prisma";

// GET /favorites
export const getFavorites = async (req: AuthenticatedRequest, res: Response) => {
  const userId = Number(req.user?.id); // assume auth middleware sets req.user
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: { property: { include: { images: true } } },
    });
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch favorites" });
  }
};

// POST /favorites
export const addFavorite = async (req: AuthenticatedRequest, res: Response) => {
  const userId = Number(req.user?.id);
  const { propertyId } = req.body;

  try {
    const favorite = await prisma.favorite.create({
      data: { userId, propertyId },
    });
    res.json(favorite);
  } catch (err) {
    res.status(500).json({ error: "Failed to add favorite" });
  }
};

// DELETE /favorites/:id
export const removeFavorite = async (req: AuthenticatedRequest, res: Response) => {
  const userId = Number(req.user?.id);
  const propertyId = Number(req.params.id);

  try {
    await prisma.favorite.deleteMany({
      where: { userId, propertyId },
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove favorite" });
  }
};