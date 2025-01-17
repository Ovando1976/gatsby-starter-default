import { doc, runTransaction } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

/**
 * Accepts a booking by a "driver." 
 * This would normally be triggered in a driver’s dashboard context.
 */
export default async function acceptBooking(bookingId, user) {
  if (!user) {
    throw new Error("You must be signed in as a driver to accept a booking.");
  }
  const bookingRef = doc(db, 'bookings', bookingId);

  await runTransaction(db, async (transaction) => {
    const bookingSnap = await transaction.get(bookingRef);
    if (!bookingSnap.exists()) {
      throw new Error("Booking no longer exists!");
    }

    const bookingData = bookingSnap.data();
    if (bookingData.status !== 'SearchingDriver' || bookingData.driverId) {
      throw new Error("Booking already assigned to another driver!");
    }

    // Assign the driver
    transaction.update(bookingRef, {
      driverId: user.uid,
      status: 'DriverAssigned',
      rideStatus: 'DriverAssigned',
    });
  });
}