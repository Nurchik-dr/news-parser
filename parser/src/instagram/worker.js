import { Worker } from "bullmq";
import IORedis from "ioredis";

import downloadService from "../services/downloadService.js";
import { FeedItemModel } from "../models/FeedItem.js";
import { connectDB } from "../db/connect.js";

await connectDB();

const redis = new IORedis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  maxRetriesPerRequest: null,
});

console.log("🚀 Instagram Worker started...");

new Worker(
  "instagram_queue",
  async (job) => {
    const { videoUrl, source } = job.data;

    console.log("\n🎯 Processing reel:", videoUrl);

    // ✅ 1. Проверка чтобы не сохранять дубликаты
    const exists = await FeedItemModel.findOne({ link: videoUrl });
    if (exists) {
      console.log("⚠️ Already exists in DB, skipping:", videoUrl);
      return exists;
    }

    // ✅ 2. Анализ видео
    const result = await downloadService.processVideo(videoUrl);

    if (!result.success) {
      throw new Error("Video processing failed");
    }

    // ✅ 3. Сохраняем в Mongo
    const doc = await FeedItemModel.create({
      title: "Instagram Reel News",
      link: videoUrl,
      pubDate: new Date().toISOString(),
      summary: "Parsed reel from Instagram",
      category: "instagram",

      // source паблика
      source: source || "instagram",

      // timeline + audio правильно
      timeline: result.data.timeline || [],
      audio: result.data.audio || null,
    });

    console.log("✅ Saved Reel as FeedItem:", doc._id);

    return doc;
  },
  { connection: redis }
);
