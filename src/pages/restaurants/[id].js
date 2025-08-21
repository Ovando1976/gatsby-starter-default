import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { getFirebaseAuth, getFirebaseFirestore, getFirebaseStorage } from "firebaseConfig";

const db = getFirebaseFirestore();

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      if (!db) {
        console.error("Firestore is not initialized");
        setError("Firestore is not initialized.");
        setLoading(false);
        return;
      }

      try {
        const querySnapshot = await getDocs(collection(db, "restaurants"));
        const fetchedRestaurants = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRestaurants(fetchedRestaurants);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching restaurants:", err);
        setError("Failed to load restaurants. Please try again later.");
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  if (loading) {
    return <p>Loading restaurants...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div>
      <h1>Restaurants</h1>
      {restaurants.length > 0 ? (
        <ul>
          {restaurants.map((restaurant) => (
            <li key={restaurant.id}>
              <h2>{restaurant.name}</h2>
              <p>Cuisine: {restaurant.cuisine}</p>
              <p>Address: {restaurant.address}</p>
              {/* Add more restaurant details */}
            </li>
          ))}
        </ul>
      ) : (
        <p>No restaurants available.</p>
      )}
    </div>
  );
};

export default Restaurants;