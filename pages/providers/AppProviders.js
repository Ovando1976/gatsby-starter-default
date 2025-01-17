// ../providers/AppProviders.js
import React from "react";
import { Provider as ReduxProvider } from "react-redux";
import { AuthProvider } from "../../contexts/AuthProvider";
import { RestaurantProvider } from "../../contexts/RestaurantProvider";
import { CartProvider } from "../../contexts/CartProvider";
import store from "../../store";

export default function AppProviders({ children }) {
  return (
    <ReduxProvider store={store}>
        <AuthProvider>
          <RestaurantProvider>
            <CartProvider>{children}</CartProvider>
          </RestaurantProvider>
        </AuthProvider>
    </ReduxProvider>
  );
}