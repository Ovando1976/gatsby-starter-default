import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// Ensure Firebase only initializes in the client (browser)
const isBrowser = typeof window !== "undefined";

const firebaseConfig = {
  apiKey: process.env.GATSBY_FIREBASE_API_KEY,
  authDomain: process.env.GATSBY_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.GATSBY_FIREBASE_PROJECT_ID,
  storageBucket: process.env.GATSBY_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.GATSBY_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.GATSBY_FIREBASE_APP_ID,
  measurementId: process.env.GATSBY_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase only in the browser
let app;
if (isBrowser) {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
}

// Export Firebase services (use lazy-loading for SSR safety)
export const getFirebaseAuth = () => (isBrowser ? getAuth(app) : null);
export const getFirebaseFirestore = () => (isBrowser ? getFirestore(app) : null);
export const getFirebaseDatabase = () => (isBrowser ? getDatabase(app) : null);
export const getFirebaseStorage = () => (isBrowser ? getStorage(app) : null);

// Default export for Firebase app (only if browser)
export default app;