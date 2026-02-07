import { execSync } from "child_process";
import path from "path";

/**
 * Получаем последние Reels через профиль Instagram
 * yt-dlp умеет доставать entries из обычной страницы профиля
 */
export async function fetchLatestReels(username, limit = 5) {
  console.log("🔍 Fetch reels from profile:", username);

  const cookiesPath = path.resolve("../parser/cookies.txt");

  const cmd = `
python3 -m yt_dlp \
  --cookies "${cookiesPath}" \
  --flat-playlist \
  --dump-single-json \
  "https://www.instagram.com/${username}/"
  `;

  const raw = execSync(cmd, { encoding: "utf-8" });

  const json = JSON.parse(raw);

  if (!json.entries) return [];

  // Берём только Reels (обычно shortcode начинается с "DU...")
  const reels = json.entries
    .filter((e) => e.url && e.url.includes("/reel/"))
    .slice(0, limit)
    .map((e) => `https://www.instagram.com${e.url}`);

  return reels;
}
