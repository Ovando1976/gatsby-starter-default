import React, { useState, useEffect } from "react";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [news, setNews] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchServerData() {
      try {
        const res = await fetch("/api/get-events");
        const data = await res.json();

        if (res.ok) {
          setEvents(data.events || []);
          setNews(data.news || []);
        } else {
          setError(data.error || "Failed to load data");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load server data");
      }
    }

    fetchServerData();
  }, []);

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  // Filter events based on title or description
  const filteredEvents = events.filter(
    (event) =>
      event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <header>
        <h1>MyApp Events</h1>
        <input
          type="text"
          placeholder="Search Events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </header>

      <section>
        <h2>Upcoming Events</h2>
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <div key={event.id}>
              <h3>{event.title}</h3>
              <p>
                {event.date} | {event.time}
              </p>
              <p>{event.description}</p>
            </div>
          ))
        ) : (
          <p>No events match your search.</p>
        )}
      </section>

      <section>
        <h2>Local News</h2>
        {news.map((article) => (
          <div key={article.id}>
            <h3>{article.title}</h3>
            <p>{article.summary}</p>
            <a href={article.link} target="_blank" rel="noopener noreferrer">
              Read more →
            </a>
          </div>
        ))}
      </section>
    </div>
  );
}
