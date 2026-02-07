import express from "express";
import { addInstagramJob } from "../../parser/src/instagram/index.js";

const router = express.Router();

// health
router.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

// запуск парсинга
router.post("/instagram/parse", async (req, res) => {
  const { username, limit } = req.body;

  if (!username) {
    return res.status(400).json({ error: "username is required" });
  }

  const jobs = await addInstagramJob(username, limit || 5);

  res.json({
    success: true,
    message: "Parsing started",
    jobs,
  });
});

export default router;
