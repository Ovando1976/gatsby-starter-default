// src/pages/restaurants.js
import React from "react";
import { Router } from "@reach/router";
import RestaurantMenuPage from "../components/restaurants/RestaurantMenuPage";

export const config = {
  matchPath: "/restaurants/*",
};

export default function RestaurantsClientOnly() {
  return (
    <div>
      <h1>Restaurants</h1>
      <Router basepath="/restaurants">
        <RestaurantMenuPage path=":id" />
      </Router>
    </div>
  );
}