const admin = require('firebase-admin');

// Load your service account key
const serviceAccount = require('.pages/api/Firebase/serviceAccountKey.json');

// Initialize Firebase Admin with a service account
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://polished-leaf-592-default-rtdb.firebaseio.com",
  storageBucket: "polished-leaf-592.appspot.com",
});

// Get Firebase services
const db = admin.firestore();
const auth = admin.auth();
const storage = admin.storage();

// Export Firebase services for use in other parts of your app
module.exports = { db, auth, storage };
