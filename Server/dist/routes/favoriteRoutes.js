"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const favoriteController_1 = require("../controllers/favoriteController");
const authMiddleware_1 = require("../middlewares/authMiddleware"); // your auth middleware
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authMiddleware); // protect routes
router.get("/", favoriteController_1.getFavorites);
router.post("/", favoriteController_1.addFavorite);
router.delete("/:id", favoriteController_1.removeFavorite);
exports.default = router;
