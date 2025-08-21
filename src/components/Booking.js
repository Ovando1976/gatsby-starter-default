import React from 'react';
import styles from '../styles/booking.module.css';
import { useAuth } from "../hooks/useAuth";

// Our new custom hook
import useBooking from '../hooks/useBooking';

// Simple driver-accept mock for demonstration
import acceptBooking from './utils/acceptBooking';

import AuthToggle from './AuthToggle'; 
import Logout from './Logout';

function Booking() {
  // Use the custom hook for booking logic
  const {
    pickup,
    setPickup,
    dropoff,
    setDropoff,
    carType,
    setCarType,
    distanceKm,
    fareEstimate,
    loading,
    error,
    statusMessage,
    handleBooking,
    handleAcceptBookingDemo, // an example function that calls `acceptBooking()`
  } = useBooking();

  // Grab the user from AuthContext
  const { user } = useAuth();

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h2>Book a Ride in USVI</h2>
      </div>
      
      {/* If no user, show Auth toggle; else show logout */}
      {!user ? <AuthToggle /> : <Logout />}

      {/* An optional spot to display global error or success messages */}
      {error && <div className={styles.error}>{error}</div>}
      {statusMessage && <div className={styles.success}>{statusMessage}</div>}

      <form onSubmit={handleBooking} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Pick-up Location:</label>
          <input
            type="text"
            value={pickup}
            placeholder="e.g., Charlotte Amalie, St. Thomas"
            onChange={(e) => setPickup(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Drop-off Location:</label>
          <input
            type="text"
            value={dropoff}
            placeholder="e.g., Trunk Bay, St. John"
            onChange={(e) => setDropoff(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Car Type:</label>
          <select
            value={carType}
            onChange={(e) => setCarType(e.target.value)}
            aria-label="Select car type"
          >
            <option value="sedan">Sedan</option>
            <option value="suv">SUV</option>
          </select>
        </div>

        {/* If distance is known, display it */}
        {distanceKm && (
          <div className={styles.fareEstimate}>
            <p>Approx Distance: {distanceKm} km</p>
          </div>
        )}

        {/* If fare estimate is available, display it */}
        {fareEstimate && (
          <div className={styles.fareEstimate}>
            <p>Estimated Fare: ${fareEstimate}</p>
          </div>
        )}

        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? 'Booking...' : 'Book Now'}
        </button>
      </form>

      {/* For demonstration: a button to accept a booking as "driver" */}
      <button
        onClick={() => handleAcceptBookingDemo('REPLACE_WITH_BOOKING_ID')}
        className={styles.acceptButton}
      >
        Accept a Booking (Driver Flow Demo)
      </button>
    </div>
  );
}

export default Booking;