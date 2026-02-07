export const NEWS_ACCOUNTS = [
  "kaznews",
  "tengrinews",
  "zakonkz",
  "informburo",
];

export function buildReelUrls(username, limit = 3) {
  const urls = [];

  for (let i = 0; i < limit; i++) {
    urls.push(`https://www.instagram.com/${username}/reels/`);
  }

  return urls;
}
