import React, { useState } from "react";
import { useRouter } from "next/router";
import { useRestaurantContext } from "../../../contexts/RestaurantProvider"; // Update the path as needed

const RestaurantMenu = () => {
  const router = useRouter();
  const { id } = router.query; // Dynamic route parameter from the URL
  const { restaurants } = useRestaurantContext(); // Context to fetch restaurant data
  const restaurant = restaurants.find((r) => r.id === id); // Find restaurant by id
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart((prev) => [...prev, item]);
  };

  if (!restaurant) return <p>Restaurant not found.</p>;

  return (
    <div>
      <h1>{restaurant.name}</h1>
      <h2>Menu</h2>
      {restaurant.menu.map((item) => (
        <div key={item.name}>
          <p>{item.name} - ${item.price}</p>
          <button onClick={() => addToCart(item)}>Add to Cart</button>
        </div>
      ))}

      <h2>Cart</h2>
      {cart.map((item, index) => (
        <p key={index}>
          {item.name} - ${item.price}
        </p>
      ))}
    </div>
  );
};

export default RestaurantMenu;