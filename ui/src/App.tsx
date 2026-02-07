import { useEffect, useState } from "react";
import { fetchFeed, FeedItem } from "./api";
import "./styles.css";

export default function App() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const data = await fetchFeed();
    setItems(data.items);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="app">
      <header>
        <h1>📰 MarketWatchr Feed</h1>
        <p>Instagram Reels + RSS News (автоматически)</p>

        <button className="refresh" onClick={load}>
          🔄 Обновить
        </button>
      </header>

      {loading && <p>Загрузка...</p>}

      {!loading && items.length === 0 && (
        <p>Пока нет новостей. Запусти parser workers.</p>
      )}

      <div className="grid">
        {items.map((item) => (
          <article key={item.link + item.pubDate} className="card">
            <div className="top">
              <span className={`badge ${item.category}`}>
                {item.category}
              </span>
              <span className="source">{item.source}</span>
            </div>

            <h3>{item.title}</h3>

            {item.image && (
              <img src={item.image} alt={item.title} />
            )}

            <p className="summary">{item.summary}</p>

            <div className="bottom">
              <time>
                {new Date(item.pubDate).toLocaleString("ru-RU")}
              </time>

              <a href={item.link} target="_blank">
                Открыть →
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
