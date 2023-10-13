'use client';

import { Button } from './ui/button';
import Input from './ui/input';
import React, { useState, useEffect } from 'react'; 
import { ref, onValue, off, getDatabase } from 'firebase/database'; 

const database = getDatabase();

export const useChatMessages = (sessionId) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const messageRef = ref(database, `sessions/${sessionId}/messages`).orderByChild('createdAt');
    const listener = onValue(messageRef, (snapshot) => {
      const newMessages = [];
      snapshot.forEach(childSnapshot => {
        newMessages.push(childSnapshot.val());
      });
      setMessages(newMessages);
    });

    return () => off(messageRef, listener);
  }, [sessionId]);

  const addMessage = async (text, role) => {
    const newMessageRef = ref(database, `sessions/${sessionId}/messages`).push();
    await newMessageRef.set({
      text,
      role,
      createdAt: Date.now() // Use a simple timestamp for this example
    });
    return newMessageRef.key;
  };

  return { messages, addMessage };
};

const ChatComponent = ({ sessionId }) => {
  const [input, setInput] = useState(''); 
  const { messages, addMessage } = useChatMessages(sessionId);
  const [user] = useState(null); 
  const [responseMessage, setResponseMessage] = useState(''); 
  const [errorMessage, setErrorMessage] = useState(''); // New state for error messages

  const handleSendMessage = async () => {
    if (!input) return;
    try {
      await addMessage(input, user);
      setInput('');

      const response = await fetch('/api/Completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      if (response.ok) {
        const data = await response.json();
        setResponseMessage(data.message);
        await addMessage(data.message, "gpt");
      } else {
        console.error('Unexpected response from server:', await response.json());
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setErrorMessage('Error sending message, please try again later.');
    }
  };

  return (
    <>
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
      <div>{responseMessage}</div>
      {messages.map((message, index) => (
      <p key={message.createdAt + index}>{message.text}</p>  
      ))}

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
};

export default ChatComponent;
