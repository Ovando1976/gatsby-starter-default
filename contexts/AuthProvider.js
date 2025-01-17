import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInAnonymously,
  onAuthStateChanged,
} from "firebase/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe; // Cleanup subscription on unmount
  }, [auth]);

  const login = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signInAsGuest = async () => {
    return signInAnonymously(auth);
  };

  const logout = async () => {
    return auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, login, signInAsGuest, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};