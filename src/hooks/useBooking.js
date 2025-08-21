import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useAuth } from "./hooks/useAuth";

// Utility functions
import calculateRealDistance from '../utils/calculateRealDistance';
import calculateFare from '../utils/calculateFare';
import acceptBooking from '../utils/acceptBooking';

/**
 * A custom hook that encapsulates booking-related logic.
 * 1) Basic form states (pickup, dropoff, etc.)
 * 2) Validations (e.g., preventing same pickup & dropoff)
 * 3) Distance & fare calculations
 * 4) Firestore interactions (create a booking)
 * 5) Example acceptBooking method
 */
export default function useBooking() {
  // FORM STATE
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [carType, setCarType] = useState('sedan');

  // DERIVED STATE
  const [fareEstimate, setFareEstimate] = useState(null);
  const [distanceKm, setDistanceKm] = useState(null);

  // UI/STATUS
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  // AUTH
  const { user } = useAuth();

  /**
   * Resets the booking form.
   */
  const resetForm = () => {
    setPickup('');
    setDropoff('');
    setCarType('sedan');
    setFareEstimate(null);
    setDistanceKm(null);
  };

  /**
   * Validates form fields before making any API calls.
   */
  const validateBookingForm = () => {
    if (!pickup || !dropoff) {
      throw new Error('Please fill out all fields.');
    }
    if (pickup.toLowerCase() === dropoff.toLowerCase()) {
      throw new Error("Pick-up and drop-off locations can't be the same.");
    }
    if (!user) {
      throw new Error('You must be signed in to book a ride.');
    }
  };

  /**
   * Main booking handler:
   * 1) Validate input
   * 2) Calculate distance & fare
   * 3) Create booking in Firestore
   */
  const handleBooking = async (event) => {
    // If this is called from a <form onSubmit={handleBooking}>
    if (event?.preventDefault) {
      event.preventDefault();
    }

    setError('');
    setStatusMessage('');

    try {
      validateBookingForm();

      setLoading(true);

      // 1) Calculate distance
      const distance = await calculateRealDistance(pickup, dropoff);
      const distanceFormatted = distance.toFixed(2);
      setDistanceKm(distanceFormatted);

      // 2) Calculate fare
      const fare = calculateFare(distance, carType);
      setFareEstimate(fare);

      // 3) Add booking to Firestore
      await addDoc(collection(db, 'bookings'), {
        userId: user.uid,
        pickup,
        dropoff,
        carType,
        distance,
        fare,
        status: 'SearchingDriver',
        rideStatus: 'SearchingDriver',
        timestamp: serverTimestamp(),
      });

      setStatusMessage(
        `Booking request sent! Approx Distance: ${distanceFormatted} km. Estimated Fare: $${fare}`
      );
      resetForm();
    } catch (err) {
      console.error('Booking failed:', err);
      setError(err.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Example function that demonstrates how a driver might accept a booking.
   * A real app would likely place this logic in a separate "driver dashboard."
   */
  const handleAcceptBookingDemo = async (bookingId) => {
    setError('');
    setStatusMessage('');

    if (!user) {
      setError('You must be signed in to accept a booking.');
      return;
    }

    try {
      await acceptBooking(bookingId, user);
      setStatusMessage('Booking accepted!');
    } catch (err) {
      console.error('Accept booking failed:', err);
      setError(err.message || 'Failed to accept booking.');
    }
  };

  return {
    // FORM STATE
    pickup,
    setPickup,
    dropoff,
    setDropoff,
    carType,
    setCarType,

    // DERIVED STATE
    fareEstimate,
    distanceKm,

    // UI/STATUS
    loading,
    error,
    statusMessage,

    // METHODS
    handleBooking,
    handleAcceptBookingDemo,
  };
}