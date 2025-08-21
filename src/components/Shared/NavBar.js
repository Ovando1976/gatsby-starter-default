import React, { useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp, FaMoon, FaSun } from "react-icons/fa";
import classNames from "classnames";
import { collection, onSnapshot, orderBy, limit, query } from "firebase/firestore";
import "../../styles/Sidebar.css";              // ← global CSS, no module object
import { getFirebaseAuth, getFirebaseFirestore, getFirebaseStorage } from "../../../firebaseConfig";

const auth = getFirebaseAuth();
const db = getFirebaseFirestore();
const storage = getFirebaseStorage();

export default function NavBar({ toggleTheme, isDarkMode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [recentMessages, setRecentMessages] = useState([]);

  const contacts = [
    { id: 1, name: "John Doe", status: "online" },
    { id: 2, name: "Jane Smith", status: "offline" },
  ];

  useEffect(() => {
    if (!db) return;
    const roomId = "default-room";
    const messagesRef = collection(db, `chatRooms/${roomId}/messages`);
    const q = query(messagesRef, orderBy("timestamp", "desc"), limit(5));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map((doc) => {
        const data = doc.data();
        const time = data.timestamp?.toDate?.().toLocaleString() ?? "No time";
        return { id: doc.id, sender: data.sender, preview: data.preview, time };
      });
      setRecentMessages(fetched);
    });
    return () => unsubscribe();
  }, [db]);

  const handleCollapse = () => setIsCollapsed((prev) => !prev);

  return (
    <nav
      className={classNames("sidebar", {
        collapsed: isCollapsed,
        dark: isDarkMode,
      })}
    >
      {/* Collapse Button */}
      <button onClick={handleCollapse} className="collapseBtn">
        {isCollapsed ? <FaChevronDown /> : <FaChevronUp />}
      </button>

      {/* Recent Messages */}
      {!isCollapsed && (
        <div className="recentMessages">
          <h3>Recent Messages</h3>
          {recentMessages.length === 0 ? (
            <p>No recent messages</p>
          ) : (
            <ul>
              {recentMessages.map((m) => (
                <li key={m.id} className="messageItem">
                  <strong>{m.sender}:</strong> {m.preview}
                  <span className="messageTime">{m.time}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Contacts */}
      {!isCollapsed && (
        <div className="contacts">
          <h3>Contacts</h3>
          <ul>
            {contacts.map((c) => (
              <li key={c.id} className={`contactItem ${c.status}`}>
                {c.name} <span>({c.status})</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Theme Toggle */}
      <div className="themeToggle">
        <button onClick={toggleTheme} className="themeBtn" aria-label="Toggle theme">
          {isDarkMode ? <FaSun /> : <FaMoon />}
          {!isCollapsed && (isDarkMode ? " Light Mode" : " Dark Mode")}
        </button>
      </div>
    </nav>
  );
}