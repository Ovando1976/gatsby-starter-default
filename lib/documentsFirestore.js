const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
} else {
  admin.app(); // Use the default app
}

const { firestore } = admin;
const { serverTimestamp, collection, getDocs, addDoc } = firestore();
/**
 * GET all documents from Firestore
 * Returns an array of document objects, each with { id, ...data }.
 */
const getDocumentsFirestore = async () => {
  const colRef = collection("documents");
  const snapshot = await getDocs(colRef);

  const docs = [];
  snapshot.forEach((doc) => {
    docs.push({ id: doc.id, ...doc.data() });
  });
  return docs;
};

/**
 * ADD a new document to Firestore
 * Accepts an object (newDoc) with the fields you want stored.
 * Adds a 'createdAt' timestamp using serverTimestamp().
 * Returns { id, ...newDoc } for the newly created doc.
 */
const addDocumentFirestore = async (newDoc) => {
  const colRef = collection("documents");

  // Optionally add a server timestamp field if you need creation time
  const payload = {
    ...newDoc,
    createdAt: serverTimestamp(),
  };
  const docRef = await addDoc(colRef, payload);

  // Return the newly created doc (with Firestore ID)
  return { id: docRef.id, ...newDoc };
};

module.exports = { getDocumentsFirestore, addDocumentFirestore };