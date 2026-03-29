import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types";

export const isAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const user = req.user;
  console.debug("isAdmin middleware user:", user ? JSON.stringify(user) : null);

  if (!user || user.role !== "ADMIN") {
    return res.status(403).json({ message: "Forbidden: Admins only" });
  }

  next();
};