"use server";

import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getFirebaseAuth, getFirebaseFirestore, getFirebaseStorage } from "firebaseConfig";

const auth = getFirebaseAuth();
const db = getFirebaseFirestore();
const storage = getFirebaseStorage();

/**
 * Fetch all chats from the 'chats' collection
 * Returns an array of chat objects
 */
export async function getChats() {
  try {
    const chatsSnapshot = await getDocs(collection(db, "chats"));
    const chats = chatsSnapshot.docs.map((docRef) => ({
      id: docRef.id,
      ...docRef.data(),
    }));
    return chats;
  } catch (error) {
    console.error("Error fetching chats:", error);
    return []; // Return an empty array in case of error
  }
}

/**
 * Add a new message to a chat's 'messages' subcollection
 * Updates the 'lastUpdated' field on the parent chat doc
 */
export async function addMessage(chatId, message) {
  try {
    const chatRef = doc(db, "chats", chatId);
    const messagesCollection = collection(chatRef, "messages");

    await addDoc(messagesCollection, {
      ...message,
      timestamp: serverTimestamp(),
    });

    // Update the parent chat's `lastUpdated` field
    await updateDoc(chatRef, {
      lastUpdated: serverTimestamp(),
    });

    console.log("Message added and chat updated successfully");
  } catch (error) {
    console.error("Error adding message:", error);
  }
}

/**
 * Remove a chat document entirely from Firestore
 */
export async function removeChat(chatId) {
  try {
    const chatRef = doc(db, "chats", chatId);
    await deleteDoc(chatRef);
    console.log("Chat removed successfully");
  } catch (error) {
    console.error("Error removing chat:", error);
  }
}

/**
 * Share a chat with another user by email
 * Adds the user's email to a 'sharedWith' array in the chat document
 */
export async function shareChat(chatId, userEmail) {
  try {
    const chatRef = doc(db, "chats", chatId);
    const chatDoc = await getDoc(chatRef);

    if (!chatDoc.exists()) {
      console.error(`Chat with ID ${chatId} does not exist.`);
      return;
    }

    const chatData = chatDoc.data();
    const sharedWith = chatData.sharedWith || [];

    if (!sharedWith.includes(userEmail)) {
      sharedWith.push(userEmail);
      await updateDoc(chatRef, { sharedWith });
      console.log(`Chat successfully shared with ${userEmail}`);
    } else {
      console.log(`Chat is already shared with ${userEmail}`);
    }
  } catch (error) {
    console.error("Error sharing chat:", error);
  }
}

// store/actions.js
export const setErrorAction = (error) => ({
  type: "SET_ERROR",
  payload: error,
});

export const setLoadingAction = (isLoading) => ({
  type: "SET_LOADING",
  payload: isLoading,
});

export const setUserAction = (user) => ({
  type: "SET_USER",
  payload: user,
});

export const setSuccessAction = (success) => ({
  type: "SET_SUCCESS",
  payload: success,
});