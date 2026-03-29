import express from "express";
import cors from "cors";
import "dotenv/config";
import propertyRoutes from "./routes/propertyRoutes";
import authRoutes from "./routes/authRoutes";
import favoriteRoutes from "./routes/favoriteRoutes";
import { authMiddleware } from "./middlewares/authMiddleware";
import messageRoutes from "./routes/messageRoutes";
import userRoutes from "./routes/userRoutes";
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/favorites", authMiddleware, favoriteRoutes);
app.use("/api/messages", authMiddleware, messageRoutes);
app.use("/api/properties", propertyRoutes);

app.get("/", (req, res) => {
  res.send("UrbanNest API Running!");
});

// Global error handler (including upload/Cloudinary connection issues)
app.use((err: any, req: any, res: any, next: any) => {
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