"use server"
import { getFirebaseFirestore } from "./firebaseConfig"; // Correct import
import { collection, getDocs, doc, addDoc, updateDoc, serverTimestamp, deleteDoc, onSnapshot, getDoc } from 'firebase/firestore';

// Initialize Firestore using the accessor function
const db = getFirebaseFirestore();

export async function getChats(setChatsFunction) {
  try {
    const chatsRef = collection(db, 'chats');
    const unsubscribe = onSnapshot(chatsRef, (snapshot) => {
      const chatArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setChatsFunction(chatArray);
    });
    return unsubscribe;
  } catch (error) {
    console.error('Error fetching chats:', error);
    throw error;
  }
}

export async function removeChat(chatId) {
  try {
    const chatDocRef = doc(db, 'chats', chatId);
    await deleteDoc(chatDocRef);
  } catch (error) {
    console.error('Error removing chat:', error);
    throw error;
  }
}

export async function shareChat(chatId) {
  try {
    const chatDocRef = doc(db, 'chats', chatId);
    const snapshot = await getDoc(chatDocRef);

    if (!snapshot.exists()) {
      throw new Error('Chat not found.');
    }

    const chat = snapshot.data();
    console.log(`Shared chat message: ${chat.message}`);
    return chat;
  } catch (error) {
    console.error('Error sharing chat:', error);
    throw error;
  }
}

export async function addMessage(chatId, message) {
  try {
    const chatRef = doc(db, 'chats', chatId);
    const messagesCollection = collection(chatRef, 'messages');

    // Add the new message to the messages subcollection
    await addDoc(messagesCollection, message);

    // Update the lastUpdated field of the chat document
    await updateDoc(chatRef, {
      lastUpdated: serverTimestamp() // Or new Date() if you don't have serverTimestamp
    });

    console.log("Message added and chat updated successfully");
  } catch (error) {
    console.error("Error adding message or updating chat:", error);
  }
}