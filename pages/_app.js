import React from "react";
import { AuthProvider} from "../contexts/AuthProvider";
import { AppProvider } from "../store/AppContext";
import { RestaurantProvider } from "../contexts/RestaurantProvider";
import {CartProvider} from "../contexts/CartProvider";
import "../src/styles/globals.css";
import Layout from "../src/components/Layout";


export default function App({ Component, pageProps }) {
  return (
    <Layout>
    <AuthProvider>
      <AppProvider>
        <RestaurantProvider>
          <CartProvider>
          {/* Render the main component with its props */}
          <Component {...pageProps} />
          </CartProvider>
        </RestaurantProvider>
      </AppProvider>
    </AuthProvider>
    </Layout>
  );
}