import React from "react";
import "./SafeSidebar.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import SafeMessages from "./SafeMessages";
import SafeCompose from "./SafeCompose";
import RoomSelector from "./RoomSelector"; // Import RoomSelector if needed

export default function SafeSidebar({
  isCollapsed = false,
  onToggleCollapse = () => {},
  onToggleTheme = () => {},
  isDark = false,
  roomId = "default-room",
   onChangeRoom,                 // ✅ new prop from page
   onCreateRoom,
   rooms = [{id:"default-room", name:"default-room"}], // sensible defaults
}) {

  return (
    <aside className={`safeSidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="safeHeaderRow">
        <h2 className="safeTitle"><span className="safeLabel">Safe Sidebar</span></h2>
        <button
          className="safeCollapseBtn"
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!isCollapsed}
        >
          {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
          <span className="safeLabel">{isCollapsed ? "Expand" : "Collapse"}</span>
        </button>
      </div>
      <div className="safeRoomRow">
         <button className="safeCollapseBtn" onClick={onCreateRoom} title="Create new room">＋</button>
         <RoomSelector rooms={rooms} value={roomId} onChange={onChangeRoom} />
       </div>
      {/* Room picker */}
       <RoomSelector rooms={rooms} value={roomId} onChange={onChangeRoom} />

      <div className="safeBlockTitle"><span className="safeLabel">Recent Messages</span></div>

      {/* Guarded, SSR-safe recent messages */}
      <div className="safeLabel">
        <SafeMessages roomId={roomId} pageSize={5} />
      </div>

      {/* Compose box */}
      <SafeCompose roomId={roomId} />

      <ul className="safeNav" style={{ marginTop: 16 }}>
        <li><a href="/profile"><span className="safeLabel">Profile</span></a></li>
        <li><a href="/users"><span className="safeLabel">Users</span></a></li>
        <li><a href="/settings"><span className="safeLabel">Settings</span></a></li>
      </ul>

      <button className="themeBtn" onClick={onToggleTheme}>
        {isDark ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>
    </aside>
  );
}