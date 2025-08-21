// pages/collab.js

import React,{ useEffect, useState } from "react";

export default function Collaboration() {
  const [sharedNote, setSharedNote] = useState("");
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "collabNote") {
        // Update local note
        setSharedNote(data.note);
      }
    };
    setWs(socket);
    return () => socket.close();
  }, []);

  const handleNoteChange = (e) => {
    setSharedNote(e.target.value);
    // broadcast to server
    if (ws) {
      ws.send(JSON.stringify({ type: "collabNote", note: e.target.value }));
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Collaboration</h2>
      <p className="mt-1 text-gray-600 dark:text-gray-400">
        Work together on documents in real-time.
      </p>

      <div className="mt-4 p-4 bg-white rounded shadow dark:bg-gray-800 max-w-xl">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
          Shared Note
        </h3>
        <textarea
          className="w-full h-40 p-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
          value={sharedNote}
          onChange={handleNoteChange}
          placeholder="Type here; changes broadcast to others..."
        />
      </div>
    </div>
  );
}