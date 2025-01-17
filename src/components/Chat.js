"use client";

import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { getFirebaseFirestore } from "../../firebaseConfig";

export default function ChatComponent({ sessionId }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [responseMessage, setResponseMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [db, setDb] = useState(null);

  // 1. Safely fetch the Firestore instance (if getFirebaseFirestore is async).
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const firestoreInstance = await getFirebaseFirestore();
        if (isMounted) {
          setDb(firestoreInstance);
        }
      } catch (error) {
        console.error("Error initializing Firestore:", error);
        setErrorMessage("Unable to initialize Firestore.");
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Listen for messages once db is available.
  useEffect(() => {
    if (!db || !sessionId) return;

    const messagesRef = collection(db, `sessions/${sessionId}/messages`);
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetched = [];
        snapshot.forEach((doc) => {
          fetched.push({ id: doc.id, ...doc.data() });
        });
        setMessages(fetched);
      },
      (err) => {
        console.error("Error listening for messages:", err);
        setErrorMessage("Error loading messages from Firestore.");
      }
    );

    return () => unsubscribe();
  }, [sessionId, db]);

  // 3. Helper to add a message to Firestore.
  async function addMessage(text, role) {
    if (!db) return;

    const messagesRef = collection(db, `sessions/${sessionId}/messages`);
    const newMessage = {
      text,
      role, // e.g., "user" or "assistant"
      createdAt: serverTimestamp(), 
    };

    try {
      const docRef = await addDoc(messagesRef, newMessage);
      return docRef.id;
    } catch (error) {
      console.error("Error adding message:", error);
      setErrorMessage("Error adding message. Please try again.");
      return null;
    }
  }

  // 4. Handle sending a message (user-sent).
  async function handleSendMessage() {
    if (!input || !db) return;
    setErrorMessage(""); // Clear any old errors

    try {
      // Add the user's message with role "user"
      await addMessage(input, "user");
      const userText = input; // store the text for the fetch
      setInput("");

      // Call the /api/Completions endpoint
      const response = await fetch("/api/Completions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });

      if (!response.ok) {
        console.error("Unexpected server response:", response);
        setErrorMessage("Unexpected response from server.");
        return;
      }

      const data = await response.json();
      // Show the AI’s message in local UI
      setResponseMessage(data.message || "");

      // Store the AI's reply with role "assistant" (or "gpt")
      await addMessage(data.message, "assistant");
    } catch (error) {
      console.error("Error sending message:", error);
      setErrorMessage("Error sending message. Please try again later.");
    }
  }

  if (errorMessage) {
    // If it’s a severe error, you could render a fallback here
    // or just display it inline
  }

  return (
    <>
      {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}

      {/* Show the latest AI response at the top (optional) */}
      {responseMessage && <div>{responseMessage}</div>}

      {/* Render all messages */}
      {messages.map((msg) => (
        <p key={msg.id}>
          <strong>{msg.role}:</strong> {msg.text}
        </p>
      ))}

      {/* Input + Send Button */}
      <div>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your message here"
        />
        <Button onClick={handleSendMessage}>Send Message</Button>
      </div>
    </>
  );
}