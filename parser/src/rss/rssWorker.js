import Parser from "rss-parser";
import axios from "axios";
import dotenv from "dotenv";

import { FeedItemModel } from "../models/FeedItem.js";
import { connectDB } from "../db/connect.js";

dotenv.config();
await connectDB();

const parser = new Parser();

const RSS_SOURCES = [
  {
    name: "BBC",
    url: "https://feeds.bbci.co.uk/news/rss.xml",
  },
  {
    name: "CNN",
    url: "http://rss.cnn.com/rss/edition.rss",
  },
  {
    name: "NYTimes",
    url: "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml",
  },
];

// Fix broken XML entities
function fixXml(xml) {
  return xml.replace(/&(?!amp;|lt;|gt;|quot;|apos;)/g, "&amp;");
}

console.log("🚀 RSS Worker started...");

//
// ✅ AUTO CLEAN BEFORE PARSING
//
console.log("🧹 Cleaning old RSS news...");
await FeedItemModel.deleteMany({ category: "rss" });
console.log("✅ Old RSS news removed");

//
// ✅ PARSING LOOP
//
for (const source of RSS_SOURCES) {
  try {
    console.log("🔍 Parsing RSS:", source.name);

    const raw = await axios.get(source.url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    const feed = await parser.parseString(fixXml(raw.data));

    console.log("✅ Found items:", feed.items.length);

    //
    // ✅ Save only fresh items (limit 10)
    //
    for (const item of feed.items.slice(0, 10)) {
      console.log("✅ Saving:", item.title);

      await FeedItemModel.create({
        title: item.title,
        link: item.link,
        pubDate: item.pubDate || new Date(),
        summary: item.contentSnippet || "",
        category: "rss",
        source: source.name,
        image: "",
      });
    }

    console.log("✅ Done:", source.name);
  } catch (err) {
    console.log("❌ RSS failed:", source.name, err.message);
  }
}

console.log("✅ RSS Done");
process.exit(0);
