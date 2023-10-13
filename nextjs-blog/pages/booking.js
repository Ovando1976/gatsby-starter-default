import React, { useState } from 'react';
import { getFirestore, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from './api/Firebase/firebaseConfig';
import dynamic from 'next/dynamic';

const FirebaseAdmin = dynamic(
    () => import('./api/Firebase/firebaseConfig'),
    { ssr: true, loading: () => <p>Loading...</p> }
);



function Booking() {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [carType, setCarType] = useState('sedan');
  const [loading, setLoading] = useState(false);
  const db = getFirestore(app);
  const auth = getAuth(app);

  const resetForm = () => {
    setPickup('');
    setDropoff('');
    setCarType('sedan');
  };

  const handleBooking = async (event) => {
    event.preventDefault();

    if (!pickup || !dropoff || !carType) {
      alert('Please fill out all fields.');
      return;
    }

    if (pickup === dropoff) {
      alert("Pick-up and Drop-off locations can't be the same.");
      return;
    }

    setLoading(true);
    try {
      await db.collection('bookings').add({
        userId: auth.currentUser.uid,
        pickup,
        dropoff,
        carType,
        timestamp: serverTimestamp()
      });
      alert('Booking successful!');
      resetForm();
    } catch (error) {
      alert('Error booking: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxinlineSize: '400px', margin: 'auto', padding: '20px' }}>
      <h2>Book a Ride</h2>
      <form onSubmit={handleBooking}>
        <div style={{ margininsetBlockEnd: '20px' }}>
          <label>
            Pick-up Location:
            <input
              type="text"
              value={pickup}
              placeholder="Pick-up Location"
              onChange={e => setPickup(e.target.value)}
              aria-required="true"
            />
          </label>
        </div>

        <div style={{ margininsetBlockEnd: '20px' }}>
          <label>
            Drop-off Location:
            <input
              type="text"
              value={dropoff}
              placeholder="Drop-off Location"
              onChange={e => setDropoff(e.target.value)}
              aria-required="true"
            />
          </label>
        </div>

        <div style={{ margininsetBlockEnd: '20px' }}>
          <label>
            Car Type:
            <select value={carType} onChange={e => setCarType(e.target.value)} aria-label="Select car type">
              <option value="sedan">Sedan</option>
              <option value="suv">SUV</option>
            </select>
          </label>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Booking...' : 'Book Now'}
        </button>
      </form>
    </div>
  );
}

export default Booking;