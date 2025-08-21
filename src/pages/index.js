import React, { useState } from "react";
import DebugBanner from "../components/DebugBanner";
import SafeSidebar from "../components/SafeSidebar/SafeSidebar";
import { getFirebaseFirestore } from "firebaseConfig";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import useRooms from "../components/SafeSidebar/useRooms";
import { load, save } from "../utils/storage";

export default function Home() {
  const [isDark, setIsDark] = useState(load("ui:isDark", false));
  const [isCollapsed, setIsCollapsed] = useState(load("ui:isCollapsed", false));
  const [roomId, setRoomId] = useState(load("ui:roomId", "default-room"));
  const rooms = useRooms(); // [{id,name}]; // customize freely
  const db = getFirebaseFirestore();



  useEffect(() => save("ui:isDark", isDark), [isDark]);
  useEffect(() => save("ui:isCollapsed", isCollapsed), [isCollapsed]);
  useEffect(() => save("ui:roomId", roomId), [roomId]);

  async function handleCreateRoom() {
    const base = "room-";
    const suffix = Math.random().toString(36).slice(2, 8);
    const newId = `${base}${suffix}`;
    const name = prompt("Room name:", newId) || newId;
    try {
      if (db) {
        // (optional) create a room doc to track metadata/members later
        await setDoc(doc(db, "chatRooms", newId), {
          createdAt: serverTimestamp(),
          createdBy: "system",
          name,
          members: [], // fill later when you add auth/membership
        });
      }
    
      setRoomId(newId);
    } catch (e) {
      console.error("Create room failed:", e);
      // UI could show a toast/error here
    }
  }


  return (
    <div className={`${isDark ? "dark " : ""}safeShell`}>
      <SafeSidebar
        isDark={isDark}
        onToggleTheme={() => setIsDark((d) => !d)}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed((c) => !c)}
        roomId={roomId}
        onChangeRoom={(id) => setRoomId(id)}
        rooms={rooms}
        onCreateRoom={handleCreateRoom}
      />

      <main className="safeMain">
        <DebugBanner text="Stage 4b: Sticky rail + flex shell (no squish) ✅" />
        <h1>Content</h1>
        <p>This is the main content area.</p>
        <p>Collapsed: {String(isCollapsed)} | Dark: {String(isDark)}</p>
      </main>
    </div>
  );
}