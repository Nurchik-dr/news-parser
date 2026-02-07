import express from "express";
import { FeedItemModel } from "../models/FeedItem.js";

const router = express.Router();

/**
 * GET /api/feed
 * Возвращает все новости (instagram + rss)
 */
router.get("/", async (req, res) => {
  try {
    const items = await FeedItemModel.find({})
      .sort({ pubDate: -1 })
      .limit(50);

    res.json({ items });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

export default router;
