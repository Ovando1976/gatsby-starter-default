import { getDatabase, ref, set, get, update, push } from 'firebase/database';

const db = getDatabase();

// Storing a message from one user to another in a session
export const storeMessage = async (sessionId, message, sentBy) => {
  try {
    const messageRef = ref(db, `messages/${sessionId}`);
    const newMessageRef = push(messageRef);
    await set(newMessageRef, {
      text: message,
      sentBy: sentBy,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error storing message:", error);
    throw new Error("Failed to store message.");
  }
};

// Function to add a document to a Realtime Database collection
export const addDocumentToCollection = async (collectionName, documentData) => {
  try {
    const newDocRef = ref(db, `${collectionName}/${push().key}`);
    await set(newDocRef, documentData);
    return newDocRef.key;
  } catch (error) {
    console.error('Error adding document:', error);
    throw error;
  }
};

// Function to fetch a document from a Realtime Database collection
export const fetchDocumentFromCollection = async (collectionName, documentId) => {
  try {
    const docRef = ref(db, `${collectionName}/${documentId}`);
    const snapshot = await get(docRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      throw new Error('Document not found');
    }
  } catch (error) {
    console.error('Error fetching document:', error);
    throw error;
  }
};

// Function to update a document in a Realtime Database collection
export const updateDocumentInCollection = async (collectionName, documentId, updatedData) => {
  try {
    const docRef = ref(db, `${collectionName}/${documentId}`);
    await update(docRef, updatedData);
  } catch (error) {
    console.error('Error updating document:', error);
    throw error;
  }
};

// If you have Firebase Functions set up, you can keep the callFirebaseFunction the same as in your Firestore utilities.
