// pages/api/blog-data.js
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp } from 'firebase-admin/app'; 

// Initialize Firebase Admin (only if not already initialized)
if (!initializeApp().name) { 
  initializeApp({ 
    // ... your Firebase Admin config
  });
}

const db = getFirestore();

export default async function handler(req, res) {
  try {
    const snapshot = await db.collection('blogPosts').get();
    const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching blog data:", error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}