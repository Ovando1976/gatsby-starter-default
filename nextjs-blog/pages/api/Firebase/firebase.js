import { initializeApp, getAnalytics } from "firebase/app";
import { firebaseConfig } from "./Firebase/firebaseConfig";
const admin = require('firebase-admin');
const { Storage } = require('@google-cloud/storage');
const serviceAccount = require('cuttingedgeai-firebase-adminsdk-yyiv5-420e302899.json');


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  apiKey: "AIzaSyCtJtPZObAxzIir4k0h4PqKZDUr92XKUEc",
  authDomain: "cuttingedgeai.firebaseapp.com",
  databaseURL: "https://cuttingedgeai-default-rtdb.firebaseio.com",
  projectId: "cuttingedgeai",
  storageBucket: "cuttingedgeai.appspot.com",
  messagingSenderId: "1013851195112",
  appId: "1:1013851195112:web:8ee2b63286c598dd81eb5d",
  measurementId: "G-C21BE37K0T"
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


const db = admin.database();


module.exports = { admin, analytics, db,Storage };