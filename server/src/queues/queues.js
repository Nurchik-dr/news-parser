import { Queue } from "bullmq";
import { redisConnection } from "./connection.js";

export const instagramQueue = new Queue("instagram_queue", {
  connection: redisConnection,
});
