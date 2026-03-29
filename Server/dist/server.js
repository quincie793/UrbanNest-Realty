"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../src/lib/prisma");
const path_1 = __importDefault(require("path"));
const express_2 = __importDefault(require("express"));
const router = (0, express_1.Router)();
/* GET ALL PROPERTIES */
router.get("/", async (req, res) => {
    try {
        const properties = await prisma_1.prisma.property.findMany();
        res.json(properties);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch properties" });
    }
});
/* GET PROPERTY BY ID */
router.get("/:id", async (req, res) => {
    try {
        const property = await prisma_1.prisma.property.findUnique({
            where: { id: Number(req.params.id) },
        });
        res.json(property);
    }
    catch (error) {
        res.status(500).json({ error: "Property not found" });
    }
});
/* CREATE PROPERTY */
router.post("/", async (req, res) => {
    try {
        const property = await prisma_1.prisma.property.create({
            data: req.body,
        });
        res.json(property);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to create property" });
    }
});
// serve uploaded files from the router base path
router.use("/uploads", express_2.default.static(path_1.default.join(__dirname, "../uploads")));
exports.default = router;
