const { db } = require("../../../firebaseConfig");
const {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  addDoc,
} = require("firebase/firestore");

// Fetch all documents from Firestore
async function getDocumentsFirestore() {
  try {
    const collectionRef = collection(db, "documents");
    const querySnapshot = await getDocs(collectionRef);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching documents:", error);
    throw new Error("Failed to fetch documents from Firestore");
  }
}

// Add a new document to Firestore
async function addDocumentFirestore(data) {
  try {
    const collectionRef = collection(db, "documents");
    const docRef = await addDoc(collectionRef, data);
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error("Error adding document:", error);
    throw new Error("Failed to add document to Firestore");
  }
}

// Fetch a single document by ID
async function getDocumentById(id) {
  try {
    const docRef = doc(db, "documents", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id, ...docSnap.data() };
    } else {
      throw new Error(`Document with ID ${id} does not exist`);
    }
  } catch (error) {
    console.error("Error fetching document:", error);
    throw new Error("Failed to fetch document by ID");
  }
}

// Update a document in Firestore
async function updateDocument(id, data) {
  try {
    const docRef = doc(db, "documents", id);
    await setDoc(docRef, data, { merge: true });
    return { id, ...data };
  } catch (error) {
    console.error("Error updating document:", error);
    throw new Error("Failed to update document");
  }
}

// Delete a document from Firestore
async function deleteDocument(id) {
  try {
    const docRef = doc(db, "documents", id);
    await deleteDoc(docRef);
    return { success: true, id };
  } catch (error) {
    console.error("Error deleting document:", error);
    throw new Error("Failed to delete document");
  }
}

// Export all functions for use in other files
module.exports = {
  getDocumentsFirestore,
  addDocumentFirestore,
  getDocumentById,
  updateDocument,
  deleteDocument,
};