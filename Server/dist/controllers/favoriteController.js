"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFavorite = exports.addFavorite = exports.getFavorites = void 0;
const prisma_1 = require("../lib/prisma");
// GET /favorites
const getFavorites = async (req, res) => {
    const userId = Number(req.user?.id); // assume auth middleware sets req.user
    try {
        const favorites = await prisma_1.prisma.favorite.findMany({
            where: { userId },
            include: { property: { include: { images: true } } },
        });
        res.json(favorites);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch favorites" });
    }
};
exports.getFavorites = getFavorites;
// POST /favorites
const addFavorite = async (req, res) => {
    const userId = Number(req.user?.id);
    const { propertyId } = req.body;
    try {
        const favorite = await prisma_1.prisma.favorite.create({
            data: { userId, propertyId },
        });
        res.json(favorite);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to add favorite" });
    }
};
exports.addFavorite = addFavorite;
// DELETE /favorites/:id
const removeFavorite = async (req, res) => {
    const userId = Number(req.user?.id);
    const propertyId = Number(req.params.id);
    try {
        await prisma_1.prisma.favorite.deleteMany({
            where: { userId, propertyId },
        });
        res.json({ success: true });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to remove favorite" });
    }
};
exports.removeFavorite = removeFavorite;
