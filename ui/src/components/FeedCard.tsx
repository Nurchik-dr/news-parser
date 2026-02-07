import { FeedItem } from "../api";

export default function FeedCard({ item }: { item: FeedItem }) {
  return (
    <article className="card">
      <div className="top">
        <span className={`badge ${item.category}`}>
          {item.category.toUpperCase()}
        </span>
        <span className="src">{item.source}</span>
      </div>

      <h3>{item.title}</h3>

      {item.summary && <p>{item.summary.slice(0, 120)}...</p>}

      <div className="bottom">
        <time>
          {new Date(item.pubDate).toLocaleDateString("ru-RU")}
        </time>

        <a href={item.link} target="_blank">
          Открыть →
        </a>
      </div>
    </article>
  );
}
