// auth.js
import { getFirebaseAuth } from '../../firebaseConfig'; 
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

/**
 * Returns the currently signed-in user object or `null` if none is signed in.
 */
export const getCurrentUser = () => {
  const auth = getFirebaseAuth(); 
  try {
    return auth.currentUser;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

/**
 * Signs user in
 */
export const signIn = async (email, password) => {
  const auth = getFirebaseAuth(); 
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error('Error signing in:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Signs user out
 */
export const signOutUser = async () => {
  const auth = getFirebaseAuth(); 
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Error signing out:', error);
    return { success: false, error: error.message };
  }
};