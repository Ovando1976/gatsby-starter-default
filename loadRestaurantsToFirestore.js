const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json'); // Path to your service account key file

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

// Sample restaurant data
const restaurants = [
  {
    name: "Indigo 4 Restaurant",
    location: "Yacht Haven Grande, St. Thomas, USVI",
    contact: {
      phone: "340-714-4447",
      email: "info@indigo4vi.com"
    },
    website: "https://indigo4vi.com/",
    menu: {
      starters: [
        {
          name: "Fried Calamari",
          description: "Fried calamari with banana peppers and carrot relish with a seasoned pepper aioli sauce",
          price: 17
        },
        {
          name: "Crab Cake",
          description: "Crab cake with roasted pineapple salsa and three-island sauce",
          price: 18
        }
      ],
      entrees: [
        {
          name: "Grilled Salmon",
          description: "Grilled salmon with baked mac & cheese, green beans, mango soy ginger sauce",
          price: 38
        },
        {
          name: "Filet Mignon",
          description: "Pan-seared 8oz filet mignon with horseradish and green banana mash, burnt broccoli, béarnaise sauce",
          price: 45
        }
      ]
    }
  },
  {
    name: "Sunset Grille",
    location: "Secret Harbour Beach Resort, St. Thomas, USVI",
    contact: {
      phone: "340-714-7874"
    },
    website: "https://www.sunsetgrillevi.com/",
    menu: {
      starters: [
        {
          name: "Coconut Shrimp",
          description: "Sweet Thai chili sauce",
          price: 17
        },
        {
          name: "Fried Pickles",
          description: "Maple Dijon mustard sauce",
          price: 14
        }
      ],
      entrees: [
        {
          name: "Blackened Mahi Tacos",
          description: "Lime cabbage, pineapple pico de gallo, Cajun crema, flour tortillas",
          price: 24
        },
        {
          name: "Grilled Ribeye",
          description: "Chili rubbed, port wine reduction, Spanish bleu cheese, yucca fries, grilled asparagus",
          price: 52
        }
      ]
    }
  },
  {
    name: "Fish Bar",
    location: "15 Hull Bay Road, St. Thomas, VI 00802",
    contact: {
      phone: "Not provided"
    },
    website: "https://www.fishbarvi.com/",
    menu: {
      description: "Serving light, fresh, & healthy fare - utilizing locally grown goods and locally caught fish.",
      hours: "Wednesday - Sunday 4 PM – 9 PM; Sunday Brunch 10 AM – 1 PM (reservation only)"
    }
  },
  {
    name: "Oceana Restaurant & Bistro",
    location: "#8 Honduras - Villa Olga, Frenchtown, St. Thomas, 00802",
    contact: {
      phone: "340-774-4262",
      email: "manager@oceanavi.com"
    },
    website: "https://www.oceanavi.com/",
    menu: {
      description: "Overlooking the aqua colors of the Baye de GriGri on St. Thomas, Oceana offers fine dining by the sea.",
      hours: "Tuesday — Saturday 5:00 PM - 9:30 PM"
    }
  },
  {
    name: "Blue 11",
    location: "St. Thomas, USVI",
    contact: {
      phone: "340-777-2511"
    },
    website: "https://blue11vi.com/",
    menu: {
      description: "Offering a variety of dishes from fresh, local seafood to succulent prime filet.",
      note: "We cater to various dietary restrictions and offer vegetarian and vegan options upon request."
    }
  }
];

// Function to load restaurant data into Firestore
async function loadRestaurants() {
  try {
    const restaurantsCollection = db.collection('restaurants'); // Reference to the 'restaurants' collection

    for (const restaurant of restaurants) {
      const docRef = await restaurantsCollection.add(restaurant); // Add each restaurant as a document
      console.log(`Restaurant added with ID: ${docRef.id}`);
    }

    console.log("All restaurants have been added to Firestore.");
  } catch (error) {
    console.error("Error adding restaurants to Firestore:", error);
  }
}

// Call the function
loadRestaurants();