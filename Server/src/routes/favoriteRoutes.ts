import { Router } from "express";
import { getFavorites, addFavorite, removeFavorite } from "../controllers/favoriteController";
import { authMiddleware } from "../middlewares/authMiddleware"; // your auth middleware

const router = Router();

router.use(authMiddleware); // protect routes
router.get("/", getFavorites);
router.post("/", addFavorite);
router.delete("/:id", removeFavorite);

export default router;