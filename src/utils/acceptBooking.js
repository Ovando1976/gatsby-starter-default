import { doc, runTransaction } from "firebase/firestore";
import { getFirebaseFirestore } from "../../firebaseConfig";

export default async function acceptBooking(bookingId, user) {
  if (!user || !user.uid) {
    throw new Error("You must be signed in as a driver to accept a booking.");
  }

  // Ensure Firebase Firestore is initialized correctly
  const db = getFirebaseFirestore();
  const bookingRef = doc(db, "bookings", bookingId);

  try {
    const result = await runTransaction(db, async (transaction) => {
      const bookingSnap = await transaction.get(bookingRef);
      if (!bookingSnap.exists()) {
        throw new Error("Booking no longer exists!");
      }

      const bookingData = bookingSnap.data();
      if (bookingData.status !== "SearchingDriver" || bookingData.driverId) {
        throw new Error("Booking already assigned to another driver!");
      }

      // Assign the driver
      transaction.update(bookingRef, {
        driverId: user.uid,
        status: "DriverAssigned",
        rideStatus: "DriverAssigned",
      });

      return { success: true, driverId: user.uid };
    });

    console.log(`🚗 Booking ${bookingId} accepted by Driver: ${user.uid}`);
    return result;
  } catch (error) {
    console.error("🔥 Error accepting booking:", error.message);
    return { success: false, error: error.message };
  }
}