import React from "react";

/**
 * This function runs on the server during the build (or at request time in SSR)
 * and fetches the restaurant data from Firestore using Firebase Admin.
 */
export async function getServerData({ pageContext }) {
  // Require Firebase Admin here; since this code runs on the server,
  // it is safe to use Firebase Admin.
  const admin = require("firebase-admin");

  // Check if Firebase Admin is already initialized; if not, initialize it.
  if (!admin.apps.length) {
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    };

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  const db = admin.firestore();
  const restaurantId = pageContext.id;

  try {
    const doc = await db.collection("restaurants").doc(restaurantId).get();
    if (!doc.exists) {
      return { status: 404, props: {} };
    }
    const restaurant = { id: doc.id, ...doc.data() };
    return {
      props: { restaurant },
    };
  } catch (error) {
    console.error("Error fetching restaurant data:", error);
    return {
      status: 500,
      props: {},
    };
  }
}

/**
 * The page component renders the restaurant data.
 */
export default function RestaurantTemplate({ serverData }) {
  const { restaurant } = serverData;

  if (!restaurant) {
    return <div>Restaurant not found.</div>;
  }

  return (
    <main style={{ padding: "2rem", maxWidth: "800px", margin: "auto" }}>
      <h1>{restaurant.name}</h1>
      {restaurant.description && <p>{restaurant.description}</p>}
      {/* Add more restaurant details as needed */}
    </main>
  );
}