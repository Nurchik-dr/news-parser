import { Schema, model } from "mongoose";

const FeedItemSchema = new Schema(
  {
    title: String,
    link: String,
    pubDate: String,
    summary: String,
    image: String,
    source: String,
    category: {
      type: String,
      enum: ["news", "instagram"],
      default: "instagram",
    },
  },
  { timestamps: true }
);

export const FeedItemModel = model("FeedItem", FeedItemSchema);
