import React, { useState } from "react";
import styles from "../src/styles/events.module.css";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app } from "../firebaseConfig";

function EventsPage({ events, news }) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter events based on search query
  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.container}>
      {/* Navbar */}
      <header className={styles.navbar}>
        <h1 className={styles.logo}>MyApp Events</h1>
        <input
          type="text"
          placeholder="Search Events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchBar}
        />
      </header>

      <div className={styles.layout}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
  <h2>Event Categories</h2>
  <ul>
    <li className={styles.sidebarItem}>
      <a href="/events/music">Music</a>
    </li>
    <li className={styles.sidebarItem}>
      <a href="/events/art">Art</a>
    </li>
    <li className={styles.sidebarItem}>
      <a href="/events/technology">Technology</a>
    </li>
    <li className={styles.sidebarItem}>
      <a href="/events/sports">Sports</a>
    </li>
    <li className={styles.sidebarItem}>
      <a href="/events/community">Community</a>
    </li>
  </ul>
</aside>

        {/* Main Content */}
        <main className={styles.mainContent}>
          {/* Events Section */}
          <section className={styles.eventsSection}>
            <h2 className={styles.subHeader}>Upcoming Events</h2>
            <div className={styles.eventsList}>
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <div key={event.id} className={styles.eventCard}>
                    <h3>{event.title}</h3>
                    <p className={styles.eventDateTime}>
                      {event.date} | {event.time}
                    </p>
                    <p className={styles.eventLocation}>{event.location}</p>
                    <p className={styles.eventDescription}>{event.description}</p>
                  </div>
                ))
              ) : (
                <p className={styles.noEvents}>No events match your search.</p>
              )}
            </div>
          </section>

          {/* News Section */}
          <section className={styles.newsSection}>
            <h2 className={styles.subHeader}>Local News</h2>
            <div className={styles.newsList}>
              {news.map((article, index) => (
                <div key={index} className={styles.newsCard}>
                  <h3>{article.title}</h3>
                  <p>{article.summary}</p>
                  <a
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.newsLink}
                  >
                    Read more &rarr;
                  </a>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const db = getFirestore(app);
  let events = [];
  let news = [];

  try {
    // Fetch events from Firestore
    const querySnapshot = await getDocs(collection(db, "events"));
    events = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

    // Sort events by date and time
    events.sort((a, b) => new Date(a.date + " " + a.time) - new Date(b.date + " " + b.time));

    // Example news data (you can fetch this from another Firestore collection or an API)
    news = [
      {
        title: "Local Art Fair This Weekend",
        summary: "Join us for an exciting art fair showcasing local artists.",
        link: "https://example.com/local-art-fair",
      },
      {
        title: "New Community Center Opening",
        summary: "The new community center is opening next month with many activities planned.",
        link: "https://example.com/community-center",
      },
    ];
  } catch (err) {
    console.error("Error fetching events or news: ", err);
  }

  return {
    props: {
      events,
      news,
    },
  };
}

export default EventsPage;