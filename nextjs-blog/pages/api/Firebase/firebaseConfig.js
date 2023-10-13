import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore} from 'firebase/firestore/lite';
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp(); // if already initialized, use that one
}
console.log(getApp().name);  // '[DEFAULT]'


const auth = getAuth(app);
const db = getDatabase(app);
const firestore = getFirestore(app);
const storage = getStorage(app);
// Get a list of cities from your database


export { app, auth, db, firestore, storage, firebaseConfig };
