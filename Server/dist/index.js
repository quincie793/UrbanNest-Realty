"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const propertyRoutes_1 = __importDefault(require("./routes/propertyRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const favoriteRoutes_1 = __importDefault(require("./routes/favoriteRoutes"));
const authMiddleware_1 = require("./middlewares/authMiddleware");
const messageRoutes_1 = __importDefault(require("./routes/messageRoutes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/auth", authRoutes_1.default);
app.use("/api/favorites", authMiddleware_1.authMiddleware, favoriteRoutes_1.default);
app.use("/api/messages", authMiddleware_1.authMiddleware, messageRoutes_1.default);
app.use("/api/properties", propertyRoutes_1.default);
app.get("/", (req, res) => {
    res.send("UrbanNest API Running!");
});
// Global error handler (including upload/Cloudinary connection issues)
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    if (err && err.code === "ENOTFOUND") {
        return res.status(502).json({ error: "External service unreachable. Check Cloudinary/DNS connectivity." });
    }
    if (err && err.code === "ECONNRESET") {
        return res.status(502).json({ error: "Connection reset by peer. Check network or Cloudinary availability." });
    }
    if (err && err.name === "MulterError") {
        return res.status(400).json({ error: err.message });
    }
    res.status(err?.status || 500).json({ error: err?.message || "Internal Server Error" });
    next();
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
