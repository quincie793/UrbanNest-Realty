"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = void 0;
const isAdmin = (req, res, next) => {
    const user = req.user;
    console.debug("isAdmin middleware user:", user ? JSON.stringify(user) : null);
    if (!user || user.role !== "ADMIN") {
        return res.status(403).json({ message: "Forbidden: Admins only" });
    }
    next();
};
exports.isAdmin = isAdmin;
