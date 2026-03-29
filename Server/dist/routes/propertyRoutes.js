"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const upload_1 = require("../middlewares/upload");
const propertyController_1 = require("../controllers/propertyController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const isAdmin_1 = require("../middlewares/isAdmin");
const router = (0, express_1.Router)();
// PUBLIC
router.get("/", propertyController_1.getProperties);
router.get("/:id", propertyController_1.getPropertyById);
// ADMIN
router.post("/admin", authMiddleware_1.authMiddleware, isAdmin_1.isAdmin, upload_1.upload.array("images"), propertyController_1.createProperty);
router.put("/admin/:id", authMiddleware_1.authMiddleware, isAdmin_1.isAdmin, upload_1.upload.array("images"), propertyController_1.updateProperty);
router.delete("/admin/:id", authMiddleware_1.authMiddleware, isAdmin_1.isAdmin, propertyController_1.deleteProperty);
exports.default = router;
