// pages/chat.js
import { useEffect, useState } from "react";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState("");
  const [ws, setWs] = useState(null);

  useEffect(() => {
    // Connect to WebSocket server
    const socket = new WebSocket("ws://localhost:8080");
    socket.onopen = () => {
      console.log("Connected to WebSocket server.");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // e.g., { sender: "You", text: "Hello" }
      setMessages((prev) => [...prev, data]);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    setWs(socket);

    // Cleanup
    return () => socket.close();
  }, []);

  const sendMessage = () => {
    if (!inputVal.trim()) return;
    const msgObject = { sender: "You", text: inputVal };
    // Send to server
    ws.send(JSON.stringify(msgObject));
    setInputVal("");
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Chat</h2>
      <p className="mt-1 text-gray-600 dark:text-gray-400">
        Chat with friends or AI in real-time.
      </p>

      <div className="mt-4 w-full max-w-xl p-4 bg-white rounded shadow dark:bg-gray-800">
        <div className="mb-4 h-64 overflow-y-auto border border-gray-200 dark:border-gray-700 p-2">
          {messages.map((m, i) => (
            <div key={i} className="mb-2 text-gray-800 dark:text-gray-200">
              <strong>{m.sender}:</strong> {m.text}
            </div>
          ))}
        </div>
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-2 py-1 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
          <button
            onClick={sendMessage}
            className="px-4 py-1 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}