import React, { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from "../../firebaseConfig";
import  "./driverDashboard.module.css";

/** 1. Mock dataset (inline) */
const mockDrivers = [
  {
    id: "driver1",
    name: "John Star",
    rating: 4.9,
    location: "Downtown",
    vehicle: "Toyota Prius"
  },
  {
    id: "driver2",
    name: "Jane Swift",
    rating: 4.7,
    location: "Airport",
    vehicle: "Honda Civic"
  },
  {
    id: "driver3",
    name: "Alex River",
    rating: 4.6,
    location: "Uptown",
    vehicle: "Tesla Model 3"
  }
];

const db = getFirestore(app);
const auth = getAuth(app);

function DriverDashboard() {
  const [bookings, setBookings] = useState([]);
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);

  // 2. We'll store the mock drivers in state as well
  const [driverList, setDriverList] = useState([]);

  useEffect(() => {
    // Auth check for driver
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setDriver(currentUser || null);
    });

    // Firestore query for SearchingDriver bookings
    const q = query(
      collection(db, "bookings"),
      where("status", "==", "SearchingDriver")
    );
    const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
      const newBookings = [];
      snapshot.forEach((docItem) => {
        newBookings.push({ id: docItem.id, ...docItem.data() });
      });
      setBookings(newBookings);
      setLoading(false);
    });

    // 3. Load mock driver data 
    // (In a real app, you might fetch from an API or Firestore)
    setDriverList(mockDrivers);

    return () => {
      unsubscribeAuth();
      unsubscribeSnapshot();
    };
  }, []);

  // Accept booking
  const acceptBooking = async (bookingId) => {
    if (!driver) return;

    try {
      const bookingRef = doc(db, "bookings", bookingId);
      await updateDoc(bookingRef, {
        status: "DriverAssigned",
        driverId: driver.uid,
        rideStatus: "DriverAssigned",
      });
      alert("Booking accepted!");
    } catch (err) {
      console.error("Error accepting booking:", err);
      alert(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Driver Dashboard</h1>

      {/* Loading state for Firestore bookings */}
      {loading && <p>Loading bookings...</p>}

      {/* Bookings list */}
      {!loading && bookings.length === 0 && (
        <p className={styles.noBookingsMsg}>
          No new ride requests are currently available.
        </p>
      )}
      <div className={styles.bookingsList}>
        {bookings.map((booking) => (
          <div key={booking.id} className={styles.bookingCard}>
            <h2>Booking #{booking.id}</h2>
            <p><strong>Pickup:</strong> {booking.pickup}</p>
            <p><strong>Dropoff:</strong> {booking.dropoff}</p>
            <p><strong>Car Type:</strong> {booking.carType}</p>
            <p><strong>Status:</strong> {booking.status}</p>
            <button
              onClick={() => acceptBooking(booking.id)}
              className={styles.acceptBtn}
            >
              Accept
            </button>
          </div>
        ))}
      </div>

      {/* 4. Driver Directory Section */}
      <div className={styles.directorySection}>
        <h2>Driver Directory (Mock)</h2>
        {driverList.map((drv) => (
          <div key={drv.id} className={styles.driverCard}>
            <p><strong>Name:</strong> {drv.name}</p>
            <p><strong>Rating:</strong> {drv.rating}</p>
            <p><strong>Location:</strong> {drv.location}</p>
            <p><strong>Vehicle:</strong> {drv.vehicle}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DriverDashboard;