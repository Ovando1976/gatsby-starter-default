// src/components/Restaurant/RestaurantMenu.js
import React from "react";
import { useRestaurantContext } from "../../contexts/RestaurantProvider";

export default function RestaurantMenu({ restaurantId }) {
  const { restaurants, loading, error } = useRestaurantContext();

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  // Find the matching restaurant by ID
  const restaurant = restaurants.find((r) => r.id === restaurantId);

  if (!restaurant) {
    return <p>No restaurant found for ID: {restaurantId}</p>;
  }

  const { name, address, phone, menu = [] } = restaurant;

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <h1>{name}</h1>
      <p><strong>Address:</strong> {address}</p>
      {phone && <p><strong>Phone:</strong> {phone}</p>}

      <h2>Menu</h2>
      {menu.length === 0 ? (
        <p>No menu items listed.</p>
      ) : (
        <ul>
          {menu.map((item, index) => (
            <li key={index}>
              {item.name} - ${item.price.toFixed(2)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}