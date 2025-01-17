import React, { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import app from "../firebaseConfig";

const db = getFirestore(app);

function BookingStatus({ bookingId }) {
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const bookingRef = doc(db, "bookings", bookingId);
    const unsubscribe = onSnapshot(bookingRef, (snapshot) => {
      if (snapshot.exists()) {
        setBooking(snapshot.data());
      }
    });
    return () => unsubscribe();
  }, [bookingId]);

  if (!booking) return <p>Loading booking...</p>;

  return (
    <div>
      <h3>Current Status: {booking.status}</h3>
      {booking.driverId && <p>Driver ID: {booking.driverId}</p>}
    </div>
  );
}

export default BookingStatus;