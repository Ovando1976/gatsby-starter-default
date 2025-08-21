import React, { useState, useEffect, createContext, useContext } from "react";
import { navigate } from "gatsby";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import {
  getFirebaseAuth,
  getFirebaseFirestore,
  getFirebaseStorage,
} from "../../firebaseConfig";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const auth = getFirebaseAuth();
  const db = getFirebaseFirestore();
  const storage = getFirebaseStorage();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Monitor auth state
  useEffect(() => {
    if (!auth) return;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            setUser({ uid: firebaseUser.uid, email: firebaseUser.email, ...userDoc.data() });
          } else {
            setUser({ uid: firebaseUser.uid, email: firebaseUser.email });
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [auth, db]);

  // Auth actions
  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);

  const signUp = async (email, password, displayName) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    await updateProfile(firebaseUser, { displayName });
    await setDoc(doc(db, "users", firebaseUser.uid), {
      displayName,
      email,
      avatar: "",
    });
    setUser({ uid: firebaseUser.uid, email, displayName, avatar: "" });
  };

  const logoutUser = () => signOut(auth);

  const uploadAvatar = async (file) => {
    if (!user) return;
    const storageRef = ref(storage, `avatars/${user.uid}`);
    await uploadBytes(storageRef, file);
    const avatarURL = await getDownloadURL(storageRef);
    await updateDoc(doc(db, "users", user.uid), { avatar: avatarURL });
    setUser({ ...user, avatar: avatarURL });
  };

  const value = {
    user,
    loading,
    error,
    login,
    signUp,
    logout: logoutUser,
    uploadAvatar,
    isAuthenticated: !!user,
    isLoading: loading,
    loginWithRedirect: () => navigate("/login"),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>.");
  return ctx;
};