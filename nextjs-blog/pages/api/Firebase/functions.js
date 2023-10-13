import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';

const db = getFirestore();
const functions = getFunctions();

// Starting a new chat session between two users

// Storing a message from one user to another in a session
export const storeMessage = async (sessionId, message, sentBy) => {
  try {
    const messageDoc = {
      sessionId: sessionId,
      text: message,
      sentBy: sentBy,
      timestamp: new Date()
    };
    await addDoc(collection(db, 'messages'), messageDoc);
  } catch (error) {
    console.error("Error storing message:", error);
    throw new Error("Failed to store message.");
  }
}

// Function to add a document to a Firestore collection
export const addDocumentToCollection = async (collectionName, documentData) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), documentData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding document:', error);
    throw error;
  }
};

// Function to fetch a document from a Firestore collection
export const fetchDocumentFromCollection = async (collectionName, documentId) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      throw new Error('Document not found');
    }
  } catch (error) {
    console.error('Error fetching document:', error);
    throw error;
  }
};

// Function to update a document in a Firestore collection
export const updateDocumentInCollection = async (collectionName, documentId, updatedData) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    await updateDoc(docRef, updatedData);
  } catch (error) {
    console.error('Error updating document:', error);
    throw error;
  }
};

// Function to call a Firebase Cloud Function
export const callFirebaseFunction = async (functionName, data) => {
  try {
    const functionRef = httpsCallable(functions, functionName);
    const response = await functionRef(data);
    return response.data;
  } catch (error) {
    console.error(`Error calling function ${functionName}:`, error);
    throw error;
  }
};





