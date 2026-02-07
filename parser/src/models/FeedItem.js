import mongoose from "mongoose";

export const FeedItemSchema = new mongoose.Schema(
  {
    title: String,

    link: {
      type: String,
      unique: true,
    },

    pubDate: Date,
    summary: String,
    image: String,
    source: String,
    category: String,

    timeline: Array,
    audio: Object,
  },
  { timestamps: true }
);

// ✅ ВОТ ЭТОГО НЕ ХВАТАЛО
export const FeedItemModel =
  mongoose.models.FeedItem ||
  mongoose.model("FeedItem", FeedItemSchema);
