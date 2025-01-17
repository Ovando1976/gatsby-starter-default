// uploadRestaurants.js

const { db } = require('./firebaseAdmin'); 
// Ensure this db is properly initialized via the Admin SDK:
//   const admin = require('firebase-admin');
//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccountKey),
//   });
//   const db = admin.firestore();

const restaurants = [

  {
    name: "3Little Birds Bakeshop & Catering Service",
    address: "1234 Paradise Road, St Thomas, VI 00802",
    description: "A family-owned bakeshop offering sweet treats and catered meals.",
    imageUrl: "URL_TO_IMAGE_IN_FIREBASE_STORAGE",
  },
];

const uploadRestaurants = async () => {
  try {
    // Using the Admin SDK:
    const restaurantsRef = db.collection('restaurants');

    // Loop through each restaurant and upload
    for (const restaurant of restaurants) {
      await restaurantsRef.add(restaurant);
      console.log(`Uploaded: ${restaurant.name}`);
    }
    console.log('All restaurants uploaded successfully.');
  } catch (error) {
    console.error('Error uploading restaurants:', error);
  }
};

uploadRestaurants();