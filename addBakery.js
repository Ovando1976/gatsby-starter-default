const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json'); // Path to your service account key file

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

// Data for 3Little Birds Bakeshop
const bakeryData = {
  name: "3Little Birds Bakeshop & Catering Service",
  location: "St. Thomas, USVI",
  contact: {
    phone: "340-555-1234",
    email: "info@3littlebirds.com"
  },
  website: "https://3littlebirdsvi.com/",
  menu: {
    bakedGoods: [
      {
        name: "Chocolate Chip Cookies",
        description: "Freshly baked chocolate chip cookies with a gooey center.",
        price: 12
      },
      {
        name: "Red Velvet Cupcakes",
        description: "Classic red velvet cupcakes with cream cheese frosting.",
        price: 18
      }
    ],
    cakes: [
      {
        name: "Vanilla Birthday Cake",
        description: "A classic vanilla cake with buttercream frosting. Custom decorations available.",
        price: 45
      },
      {
        name: "Chocolate Fudge Cake",
        description: "Rich chocolate fudge cake layered with chocolate ganache.",
        price: 50
      }
    ],
    catering: [
      {
        name: "Sandwich Platter",
        description: "An assortment of gourmet sandwiches for events and parties.",
        price: 75
      },
      {
        name: "Dessert Platter",
        description: "A mix of cookies, brownies, and mini cupcakes.",
        price: 60
      }
    ]
  }
};

// Function to add the bakery to Firestore
async function addBakery() {
  try {
    const bakeryRef = db.collection('restaurants'); // 'restaurants' collection
    const docRef = await bakeryRef.add(bakeryData); // Add bakery data
    console.log(`Bakery added with ID: ${docRef.id}`);
  } catch (error) {
    console.error("Error adding bakery to Firestore:", error);
  }
}

// Run the function
addBakery();