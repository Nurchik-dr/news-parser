import express from "express";
import { instagramQueue } from "../queues/queues.js";
import { fetchLatestReels } from "../services/instagramScraper.js";

const router = express.Router();

// ✅ Реальные Instagram паблики с новостями
const NEWS_SOURCES = [
  "kaznews",
  "tengrinews",
  "informburokz",
  "nur_kz",
];

router.post("/auto", async (req, res) => {
  const { limit = 3 } = req.body;

  const jobs = [];

  for (const source of NEWS_SOURCES) {
    console.log("🔍 Fetching reels from:", source);

    // ✅ ждём реальные reels
    let reels = [];
    try {
      reels = await fetchLatestReels(source, limit);
    } catch (err) {
      console.log("❌ Failed fetch reels:", source, err.message);
      continue;
    }

    for (const url of reels) {
      await instagramQueue.add("parse_reel", {
        videoUrl: url,
        source,
      });

      jobs.push({ source, url });
    }
  }

  res.json({
    success: true,
    message: "Auto parsing started",
    total: jobs.length,
    jobs,
  });
});

export default router;
