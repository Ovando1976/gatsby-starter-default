// src/pages/callback.js

import React, { useEffect } from "react";
import { navigate } from "gatsby";
import { useAuth } from "../hooks/useAuth";

export default function Callback() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/"); // Redirect to home after successful login
    }
  }, [isAuthenticated]);

  return <div>Loading...</div>;
}