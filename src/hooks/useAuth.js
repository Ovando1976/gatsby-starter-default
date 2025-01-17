// src/hooks/useAuth.js

import { useState, useEffect, createContext, useContext } from "react"
import { auth, firestore, storage } from "../firebaseConfig"

// Create a Context for Authentication
const AuthContext = createContext()

// AuthProvider Component to wrap the app and provide auth state
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch additional user data from Firestore if available
        try {
          const userDoc = await firestore.collection("users").doc(firebaseUser.uid).get()
          if (userDoc.exists) {
            setUser({ uid: firebaseUser.uid, email: firebaseUser.email, ...userDoc.data() })
          } else {
            setUser({ uid: firebaseUser.uid, email: firebaseUser.email })
          }
        } catch (err) {
          console.error("Error fetching user data:", err)
          setError(err)
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [])

  // Login method
  const login = async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      await auth.signInWithEmailAndPassword(email, password)
    } catch (err) {
      console.error("Login error:", err)
      setError(err)
    }
    setLoading(false)
  }

  // Sign Up method
  const signUp = async (email, password, displayName) => {
    setLoading(true)
    setError(null)
    try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password)
      const firebaseUser = userCredential.user
      // Set displayName in Firebase Auth
      await firebaseUser.updateProfile({ displayName })
      // Create a user document in Firestore
      await firestore.collection("users").doc(firebaseUser.uid).set({
        displayName,
        email,
        avatar: "", // Placeholder for avatar URL
      })
      setUser({ uid: firebaseUser.uid, email: firebaseUser.email, displayName, avatar: "" })
    } catch (err) {
      console.error("Sign Up error:", err)
      setError(err)
    }
    setLoading(false)
  }

  // Logout method
  const logoutUser = async () => {
    setLoading(true)
    setError(null)
    try {
      await auth.signOut()
      setUser(null)
    } catch (err) {
      console.error("Logout error:", err)
      setError(err)
    }
    setLoading(false)
  }

  // Upload Avatar
  const uploadAvatar = async (file) => {
    if (!user) return
    setLoading(true)
    setError(null)
    try {
      const storageRef = storage.ref().child(`avatars/${user.uid}`)
      await storageRef.put(file)
      const avatarURL = await storageRef.getDownloadURL()
      // Update Firestore user document
      await firestore.collection("users").doc(user.uid).update({ avatar: avatarURL })
      // Update user state
      setUser({ ...user, avatar: avatarURL })
    } catch (err) {
      console.error("Upload Avatar error:", err)
      setError(err)
    }
    setLoading(false)
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, login, signUp, logout: logoutUser, uploadAvatar }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext)
}