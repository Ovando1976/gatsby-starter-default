import React, { useEffect } from "react";
import { navigate } from "gatsby";
import { useAuth } from "../hooks/useAuth"; // Assuming you have this hook

export default function Callback() {
  const { isAuthenticated, handleCallback, isLoading, error } = useAuth(); // Enhanced hook

  useEffect(() => {
    handleCallback(); // Process the authentication callback
  }, [handleCallback]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/"); // Redirect to home after successful login
    }
  }, [isAuthenticated]);

  if (isLoading) {
    return <div>Authenticating...</div>; // More informative loading state
  }

  if (error) {
    return <div>Authentication Error: {error.message}</div>; // Display error message
  }

  return <div>Loading...</div>; // Initial loading state
}