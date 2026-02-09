import express from "express";
import { FeedItemModel } from "../models/FeedItem.js";
import { exec } from "child_process";
import path from "path";

const router = express.Router();

/**
 * ✅ GET /api/feed
 */
router.get("/", async (req, res) => {
  try {
    const items = await FeedItemModel.find()
      .sort({ pubDate: -1, createdAt: -1 })
      .limit(200);

    res.json({ items });
  } catch (err) {
    console.error("❌ Feed error:", err);
    res.status(500).json({ error: "Feed error" });
  }
});

/**
 * ✅ POST /api/feed/refresh
 */
router.post("/refresh", async (req, res) => {
  try {
    console.log("🧹 Clearing old RSS items...");

    await FeedItemModel.deleteMany({ category: "rss" });

    console.log("🚀 Running RSS worker...");

    const workerPath = path.join(
      process.cwd(),
      "parser/src/rss/rssWorker.js"
    );

    exec(`node ${workerPath}`);

    res.json({
      ok: true,
      message: "Feed refreshed успешно!",
    });
  } catch (err) {
    console.error("❌ Refresh failed:", err);
    res.status(500).json({ ok: false });
  }
});

export default router;
