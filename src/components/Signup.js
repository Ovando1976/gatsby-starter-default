// components/Signup.js

import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import "../styles/auth.module.css";

const Signup = () => {
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    try {
      await register(email, password);
      // Optionally, redirect the user after successful registration
    } catch (err) {
      console.error("Signup Error:", err);
      setError("Failed to create an account. Please try again.");
    }
  };

  return (
    <div className={styles.authContainer}>
      <h2>Sign Up</h2>
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleSignup} className={styles.authForm}>
        <div className={styles.formGroup}>
          <label htmlFor="signup-email">Email:</label>
          <input
            type="email"
            id="signup-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="signup-password">Password:</label>
          <input
            type="password"
            id="signup-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="signup-confirm-password">Confirm Password:</label>
          <input
            type="password"
            id="signup-confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Confirm your password"
          />
        </div>
        <button type="submit" className={styles.authButton}>
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;