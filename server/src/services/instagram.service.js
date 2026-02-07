import { execSync } from "child_process";

/**
 * Получаем последние reels паблика через yt-dlp
 */
export function getLatestReels(username, limit = 5) {
  const url = `https://www.instagram.com/${username}/reels/`;

  console.log("🔍 Fetch reels playlist:", url);

  // flat-playlist → без скачивания, только ссылки
  const output = execSync(
    `yt-dlp --flat-playlist --dump-single-json "${url}"`,
    { encoding: "utf-8" }
  );

  const json = JSON.parse(output);

  if (!json.entries) return [];

  const reels = json.entries
    .slice(0, limit)
    .map((e) => `https://www.instagram.com/reel/${e.id}/`);

  return reels;
}
