import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig"; // Adjust path as needed
import { cn } from "../lib/utils";
import { MemoizedReactMarkdown } from "../markdown";
import { IconOpenAI, IconUser } from "../components/ui/icons";
import { ChatMessageActions } from "./chat-message-actions";

export const useChatMessages = (sessionId) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Create a reference to the messages collection for the given session.
    const messagesRef = collection(db, "sessions", sessionId, "messages");
    const q = query(messagesRef, orderBy("createdAt"));
    
    // Subscribe to realtime updates using onSnapshot.
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const newMessages = [];
        snapshot.forEach((doc) => {
          newMessages.push({ id: doc.id, ...doc.data() });
        });
        setMessages(newMessages);
      },
      (error) => {
        console.error("Error fetching messages: ", error);
      }
    );

    // Cleanup subscription on unmount.
    return () => unsubscribe();
  }, [sessionId]);

  // Function to add a new message.
  const addMessage = async (text, role) => {
    try {
      const messagesRef = collection(db, "sessions", sessionId, "messages");
      const docRef = await addDoc(messagesRef, {
        text,
        role,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error adding message:", error);
      return null;
    }
  };

  return { messages, addMessage };
};

const ChatComponent = ({ sessionId }) => {
  const { messages, addMessage } = useChatMessages(sessionId);

  const sendMessage = () => {
    addMessage("Hello, world!", "user");
  };

  return (
    <div>
      {messages.map((message) => (
        <p key={message.id}>{message.text}</p>
      ))}
      <button onClick={sendMessage}>Send Message</button>
    </div>
  );
};

export function ChatMessage({ message }) {
  return (
    <div className={cn("group relative mb-4 flex items-start md:-ml-12")}>
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow",
          message.role === "user"
            ? "bg-background"
            : "bg-primary text-primary-foreground"
        )}
      >
        {message.role === "user" ? <IconUser /> : <IconOpenAI />}
      </div>
      <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
        <MemoizedReactMarkdown
          className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
          remarkPlugins={[]}
          components={{}}
        >
          {message.text}
        </MemoizedReactMarkdown>
        <ChatMessageActions message={message} />
      </div>
    </div>
  );
}

export default ChatComponent;