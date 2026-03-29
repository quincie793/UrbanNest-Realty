import { Router } from "express";
import { getUsers } from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { isAdmin } from "../middlewares/isAdmin";

const router = Router();

// ADMIN: fetch all users
router.get("/", authMiddleware, isAdmin, getUsers);

export default router;