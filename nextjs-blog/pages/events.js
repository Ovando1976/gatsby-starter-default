// pages/events.js
import styles from './styles/events.module.css';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from './api/Firebase/firebaseConfig';
import dynamic from 'next/dynamic';

const FirebaseAdmin = dynamic(
    () => import('./api/Firebase/firebaseConfig'),
    { ssr: true, loading: () => <p>Loading...</p> }
);

// Use `FirebaseAdmin` in your component to access the admin functionalities.



function EventsPage({ events }) {
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Upcoming Events</h1>

      <div className={styles.eventsList}>
        {events.map(event => (
          <div key={event.id} className={styles.eventCard}>
            <h2>{event.title}</h2>
            <p>Date: {event.date}</p>
            <p>Time: {event.time}</p>
            <p>Location: {event.location}</p>
            <p>{event.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const db = getFirestore(app);
  let events = [];  // Corrected this line

  try {
    const querySnapshot = await getDocs(collection(db, 'events'));
    events = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    // Sort events by date and time
    events.sort((a, b) => new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time));
  } catch (err) {
    console.error("Error fetching events: ", err);
  }

  return {
    props: {
      events
    }
  }
}

export default EventsPage;
