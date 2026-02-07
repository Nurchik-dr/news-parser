import mongoose from "mongoose";

const FeedItemSchema = new mongoose.Schema(
  {
    title: String,
    link: String,
    pubDate: Date,
    summary: String,
    image: String,
    source: String,
    category: String, // rss или instagram
    timeline: Array,
    audio: String,
  },
  { timestamps: true }
);

export const FeedItemModel =
  mongoose.models.FeedItem || mongoose.model("FeedItem", FeedItemSchema);
