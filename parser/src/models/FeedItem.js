import mongoose from "mongoose";

const FeedItemSchema = new mongoose.Schema(
  {
    title: String,

    link: {
      type: String,
      required: true,
      unique: true,
    },

    pubDate: Date,
    summary: String,
    image: String,
    source: String,
    category: String,
  },
  { timestamps: true }
);

// ✅ вот это важно
FeedItemSchema.index({ link: 1 }, { unique: true });

export const FeedItemModel =
  mongoose.models.FeedItem || mongoose.model("FeedItem", FeedItemSchema);
