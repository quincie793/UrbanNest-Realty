import { Router } from "express";
import { upload } from "../middlewares/upload";
import {
  getProperties,
  getPropertyById,
  createProperty,
  deleteProperty,
  updateProperty,
} from "../controllers/propertyController";

import { authMiddleware } from "../middlewares/authMiddleware";
import { isAdmin } from "../middlewares/isAdmin";

const router = Router();

// PUBLIC
router.get("/", getProperties);
router.get("/:id", getPropertyById);

// ADMIN
router.post(
  "/admin",
  authMiddleware,
  isAdmin,
  upload.array("images"),
  createProperty
);
router.put(
  "/admin/:id",
  authMiddleware,
  isAdmin,
  upload.array("images"),
  updateProperty
);
router.delete("/admin/:id", authMiddleware, isAdmin, deleteProperty);

export default router;