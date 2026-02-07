import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import instagramRoutes from "./routes/instagram.routes.js";
import feedRoutes from "./routes/feed.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Mongo connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Server connected to MongoDB"))
  .catch((err) => console.log("❌ Mongo error:", err.message));

// Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/instagram", instagramRoutes);
app.use("/api/feed", feedRoutes);

// Start
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ API running on http://localhost:${PORT}`);
});
