// eslint-disable-next-line no-unused-vars
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, getAuth } from 'firebase/auth';
import { initializeApp } from "firebase/app";
// eslint-disable-next-line no-unused-vars
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB_gYJPNSFP6fd9Tvo0Tlc_IDvjCOwU2As",
  authDomain: "polished-leaf-592.firebaseapp.com",
  databaseURL: "https://polished-leaf-592-default-rtdb.firebaseio.com",
  projectId: "polished-leaf-592",
  storageBucket: "polished-leaf-592.appspot.com",
  messagingSenderId: "510356182006",
  appId: "1:510356182006:web:715794509df8c3307cadd7",
  measurementId: "G-Y7YN0W032Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// auth instance of firebase
export const auth = getAuth(app);

// Sign In
export const signIn = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        return { user };
    } catch (error) {
        console.error('Error signing in:', error);
        return { error };
    }
}

// Sign Out
export const signOutUser = async () => {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        console.error('Error signing out:', error);
        return { error };
    }
}

// Get current user
export const getCurrentUser = () => {
    return auth.currentUser;
}


