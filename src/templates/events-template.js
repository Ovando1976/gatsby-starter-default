import React, { useState, useMemo } from "react";

const styles = {
  container: { padding: "20px", maxWidth: "800px", margin: "auto" },
  searchBox: {
    width: "100%",
    padding: "10px",
    marginBottom: "20px",
    fontSize: "16px",
  },
  eventList: { listStyleType: "none", padding: 0 },
  eventItem: {
    borderBottom: "1px solid #ddd",
    paddingBottom: "10px",
    marginBottom: "10px",
  },
  newsList: { listStyleType: "none", padding: 0 },
  newsItem: { borderBottom: "1px solid #ddd", paddingBottom: "10px" },
};

export default function EventsTemplate({ pageContext }) {
  const { events, news } = pageContext;
  const [searchQuery, setSearchQuery] = useState("");

  // Memoize the filtered events to optimize performance
  const filteredEvents = useMemo(() => {
    return events
      ? events.filter((event) =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : [];
  }, [events, searchQuery]);

  return (
    <div style={styles.container}>
      <h1>Upcoming Events</h1>
      <label htmlFor="event-search" style={{ display: "none" }}>
        Search events
      </label>
      <input
        id="event-search"
        type="text"
        placeholder="Search events..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={styles.searchBox}
      />

      {filteredEvents.length > 0 ? (
        <ul style={styles.eventList}>
          {filteredEvents.map((event) => (
            <li key={event.id} style={styles.eventItem}>
              <h3>{event.title}</h3>
              <p>{event.date}</p>
              <p>{event.location}</p>
              <p>{event.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No events found.</p>
      )}

      <h2>Latest News</h2>
      {news && news.length > 0 ? (
        <ul style={styles.newsList}>
          {news.map((item) => (
            <li key={item.id} style={styles.newsItem}>
              <h4>{item.title}</h4>
              <p>{item.summary}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No news available.</p>
      )}
    </div>
  );
}