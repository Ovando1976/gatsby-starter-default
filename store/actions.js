"use server";

import { getFirebaseFirestore } from "../firebaseConfig";
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

/**
 * Fetch all chats from the 'chats' collection
 * Returns an array of chat objects
 */
export async function getChats() {
  try {
    const db = await getFirebaseFirestore(); // Ensure Firestore is initialized
    const chatsSnapshot = await getDocs(collection(db, "chats"));

    const chats = [];
    chatsSnapshot.forEach((docRef) => {
      chats.push({ id: docRef.id, ...docRef.data() });
    });

    return chats;
  } catch (error) {
    console.error("Error fetching chats:", error);
    // Consider a more informative error handling approach here
    return []; 
  }
}

/**
 * Add a new message to a chat's 'messages' subcollection
 * Updates the 'lastUpdated' field on the parent chat doc
 */
export async function addMessage(chatId, message) {
  try {
    const db = await getFirebaseFirestore();
    const chatRef = doc(db, "chats", chatId);
    const messagesCollection = collection(chatRef, "messages");

    await addDoc(messagesCollection, message);

    await updateDoc(chatRef, {
      lastUpdated: serverTimestamp(), // or new Date()
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
    const db = await getFirebaseFirestore();
    const chatRef = doc(db, "chats", chatId);

    await deleteDoc(chatRef);
    console.log("Chat removed successfully");
  } catch (error) {
    console.error("Error removing chat:", error);
  }
}

/**
 * Example "shareChat" function.
 *   - Loads the existing chat
 *   - Adds the given userEmail to a 'sharedWith' array in the document
 * You can adapt this to your own access-control logic.
 */
export async function shareChat(chatId, userEmail) {
  try {
    const db = await getFirebaseFirestore();
    const chatRef = doc(db, "chats", chatId);

    const chatDoc = await getDoc(chatRef);
    if (!chatDoc.exists()) {
      console.error("Chat does not exist for sharing:", chatId);
      return;
    }

    // Extend the existing 'sharedWith' array or initialize if it doesn't exist
    const chatData = chatDoc.data();
    const sharedWith = chatData.sharedWith || [];

    // Only add if userEmail is not already there
    if (!sharedWith.includes(userEmail)) {
      sharedWith.push(userEmail);
      await updateDoc(chatRef, { sharedWith });
      console.log(`Chat shared with ${userEmail}`);
    } else {
      console.log(`Chat is already shared with ${userEmail}`);
    }
  } catch (error) {
    console.error("Error sharing chat:", error);
  }
}// store/actions.js
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