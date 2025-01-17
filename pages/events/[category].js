import React, { useState } from "react";
import { useRouter } from "next/router";
import styles from "../../src/styles/events.module.css";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app } from "../../firebaseConfig";

function EventCategoryPage({ events }) {
  const router = useRouter();
  const { category } = router.query; // Get category from the URL
  const [searchQuery, setSearchQuery] = useState("");

  // Filter events by category and search query
  const filteredEvents = events.filter(
    (event) =>
      event.category.toLowerCase() === category.toLowerCase() &&
      (event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>{category} Events</h1>

      {/* Search Bar */}
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder={`Search for ${category} events...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {/* Events List */}
      <section className={styles.eventsSection}>
        <h2 className={styles.subHeader}>Upcoming {category} Events</h2>
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
            <p className={styles.noEvents}>No {category} events available.</p>
          )}
        </div>
      </section>
    </div>
  );
}

export async function getServerSideProps() {
  const db = getFirestore(app);
  let events = [];

  try {
    const querySnapshot = await getDocs(collection(db, "events"));
    events = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  } catch (err) {
    console.error("Error fetching events: ", err);
  }

  return {
    props: {
      events,
    },
  };
}

export default EventCategoryPage;