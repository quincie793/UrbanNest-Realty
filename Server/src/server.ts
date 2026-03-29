import { Router } from "express";
import { prisma } from "../src/lib/prisma";
import path  from "path";
import express from "express";
const router = Router();

/* GET ALL PROPERTIES */
router.get("/", async (req, res) => {
  try {
    const properties = await prisma.property.findMany();
    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch properties" });
  }
});

/* GET PROPERTY BY ID */
router.get("/:id", async (req, res) => {
  try {
    const property = await prisma.property.findUnique({
      where: { id: Number(req.params.id) },
    });

    res.json(property);
  } catch (error) {
    res.status(500).json({ error: "Property not found" });
  }
});

/* CREATE PROPERTY */
router.post("/", async (req, res) => {
  try {
    const property = await prisma.property.create({
      data: req.body,
    });

    res.json(property);
  } catch (error) {
    res.status(500).json({ error: "Failed to create property" });
  }
});

// serve uploaded files from the router base path
router.use("/uploads", express.static(path.join(__dirname, "../uploads")));

export default router;