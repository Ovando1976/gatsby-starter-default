import React, { useState, useEffect } from "react";
import { useRestaurantContext } from "../../context/RestaurantProvider";

const RestaurantList = () => {
  const { restaurants, isLoading, error } = useRestaurantContext();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRestaurants = restaurants.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <input
        type="text"
        placeholder="Search restaurants..."
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {filteredRestaurants.map((restaurant) => (
        <div key={restaurant.id}>{restaurant.name}</div>
      ))}
    </div>
  );
};

export default RestaurantList;