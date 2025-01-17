const admin = require("firebase-admin");

// Path to your service account key
const serviceAccount = require("./serviceAccountKey.json");

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET, // Ensure this is set in your .env file
  });
} else {
  console.log("Firebase Admin already initialized.");
}

const db = admin.firestore();

// Sample Posts Data (USVI Specific)
const samplePosts = [
  {
    title: "How to Stay Fit in USVI: Top Local Workouts",
    excerpt: "Discover effective fitness strategies and routines tailored to the unique environment of the US Virgin Islands.",
    content: `Maintaining fitness in the US Virgin Islands involves a combination of dedication, local resources, and understanding your body's needs in a tropical environment. Here are some proven strategies to help you achieve your fitness goals in the USVI:

### 1. **Set Clear Fitness Goals** ...
    `,
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60", // Example USVI beach image
    date: admin.firestore.FieldValue.serverTimestamp(),
    viewCount: 120,
    authorId: "6h5eWxTdYKUlK2g4jUfl1Rtki0q1", // Replace with a valid user UID
  },
  {
    title: "Top 10 Travel Destinations in USVI for 2023",
    excerpt: "Explore the most sought-after travel destinations in the US Virgin Islands for 2023, each offering unique experiences and unforgettable memories.",
    content: `The US Virgin Islands (USVI) offer a diverse range of travel experiences, from pristine beaches and vibrant nightlife to historical sites and lush nature trails. As 2023 unfolds, here are the top 10 travel destinations in the USVI you shouldn't miss:

### 1. **Trunk Bay, St. John** ...
    `,
    imageUrl: "https://images.unsplash.com/photo-1516770843303-4b2a984fe80e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60", // Example USVI lighthouse image
    date: admin.firestore.FieldValue.serverTimestamp(),
    viewCount: 200,
    authorId: "6h5eWxTdYKUlK2g4jUfl1Rtki0q1", // Replace with a valid user UID
  },
  {
    title: "Healthy Recipes to Try in USVI",
    excerpt: "Elevate your meal planning with these delicious and nutritious recipes inspired by the flavors of the US Virgin Islands.",
    content: `Eating healthy in the US Virgin Islands means embracing fresh, local ingredients that are both nutritious and flavorful. Here are some mouth-watering recipes inspired by the vibrant cuisine of the USVI:

### 1. **Caribbean Quinoa Salad** ...
    `,
    imageUrl: "https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60", // Example USVI kitchen or meal image
    date: admin.firestore.FieldValue.serverTimestamp(),
    viewCount: 80,
    authorId: "6h5eWxTdYKUlK2g4jUfl1Rtki0q1", // Replace with a valid user UID
  }
];

// Function to add sample posts
const addSamplePosts = async () => {
  try {
    const batch = db.batch(); // Using batch to optimize multiple writes
    samplePosts.forEach((post) => {
      const docRef = db.collection("articles").doc(); // Create a new document reference
      batch.set(docRef, post); // Add post to the batch
    });

    // Commit the batch
    await batch.commit();
    console.log("All sample posts added successfully.");
  } catch (error) {
    console.error("Error adding sample posts:", error);
  }
};

addSamplePosts();