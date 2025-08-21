import React from "react";
import "./styles/globals.css";
import { AuthProvider } from "./hooks/useAuth";
import { RestaurantProvider } from "./contexts/RestaurantProvider";

export const wrapRootElement = ({ element }) => (
  <AuthProvider>
    <RestaurantProvider>{element}</RestaurantProvider>
  </AuthProvider>
);