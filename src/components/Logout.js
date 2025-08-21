// components/Logout.js

import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth"; // Adjust the import path as necessary
import "../styles/logout.module.css";

const Logout = () => {
  const { logout } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setError("");
    setLoading(true);
    try {
      await logout();
      alert("Successfully logged out!");
      // Optionally, redirect the user after logout
      // For example, to the home page:
      // Router.push("/");
    } catch (err) {
      console.error("Logout Error:", err);
      setError("Failed to log out. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.logoutContainer}>
      {error && <p className={styles.error}>{error}</p>}
      <button
        onClick={handleLogout}
        disabled={loading}
        className={styles.logoutButton}
      >
        {loading ? "Logging out..." : "Log Out"}
      </button>
    </div>
  );
};

export default Logout;