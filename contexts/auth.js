// src/contexts/auth.js
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(undefined);

// Keep the API simple: object return (not tuple) to avoid shape confusion
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // TODO: wire to Firebase if you like; for now we just simulate a ready state
  useEffect(() => {
    setLoading(false);
  }, []);

  const value = {
    user,
    setUser,
    loading,
    error,
    // stub methods to be implemented with Firebase later
    login: async () => {},
    logout: async () => {},
    register: async () => {},
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    // This ensures you never get the opaque "Right side of assignment..." again.
    throw new Error("useAuth must be used within <AuthProvider>.");
  }
  return ctx;
}