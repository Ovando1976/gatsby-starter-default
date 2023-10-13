import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  // ... your firebase config
};

// Ensure Firebase is initialized only once
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log('User signed in:', user);
  } catch (error) {
    console.error('Error signing in:', error);
  }
};

export default signInWithGoogle;
