export const API_BASE =
  import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export type FeedItem = {
  title: string;
  link: string;
  pubDate: string;
  summary: string;
  image: string;
  source: string;
  category: string;
};

export async function fetchFeed(): Promise<{ items: FeedItem[] }> {
  const res = await fetch(`${API_BASE}/api/feed`);

  if (!res.ok) {
    throw new Error("Feed request failed");
  }

  return res.json();
}

export async function refreshRSS() {
  await fetch("http://localhost:4000/api/feed/refresh/rss", {
    method: "POST",
  });
}

export async function refreshFeed() {
  await fetch(`${API_BASE}/api/feed/refresh`, {
    method: "POST",
  });
}
