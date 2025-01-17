import React, { useEffect, useState } from "react";
import { Link } from "next/link";
import {
  FaUser,
  FaUsers,
  FaCog,
  FaChevronDown,
  FaChevronUp,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import classNames from "classnames";
import {
  collection,
  onSnapshot,
  orderBy,
  limit,
  query,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";
import "./Sidebar.css";

const SidebarContent = ({ toggleTheme, isDarkMode }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [recentMessages, setRecentMessages] = useState([]);
  const contacts = [
    { id: 1, name: "John Doe", status: "online" },
    { id: 2, name: "Jane Smith", status: "offline" },
  ];

  useEffect(() => {
    const roomId = "default-room";
    const messagesRef = collection(db, `chatRooms/${roomId}/messages`);
    const q = query(messagesRef, orderBy("timestamp", "desc"), limit(5));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetched = snapshot.docs.map((doc) => {
          const data = doc.data();
          // Safe navigation and handling for potentially missing timestamp or toDate
          const time = data.timestamp?.toDate?.().toLocaleString() ?? "No time";
          return {
            id: doc.id,
            sender: data.sender,
            preview: data.preview,
            time: time,
          };
        });
        setRecentMessages(fetched);
      },
      (error) => {
        console.error("Error fetching recent messages:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleCollapse = () => setIsCollapsed((prev) => !prev);

  return (
    <nav
      className={classNames("sidebar", {
        collapsed: isCollapsed,
        dark: isDarkMode,
      })}
    >
      {/* ... (rest of your JSX code) */}
        {/* Recent Messages */}
      {!isCollapsed && (
        <div className="recent-messages">
          <h3>Recent Messages</h3>
          {recentMessages.length === 0 ? (
            <p>No recent messages</p>
          ) : (
            <ul>
              {recentMessages.map((message) => (
                <li key={message.id} className="message-item">
                  <strong>{message.sender}:</strong> {message.preview}
                  <span className="message-time">{message.time}</span>
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
            {contacts.map((contact) => (
              <li key={contact.id} className={`contact-item ${contact.status}`}>
                {contact.name} <span>({contact.status})</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Theme Toggle */}
      <div className="theme-toggle">
        <button
          onClick={toggleTheme}
          className="theme-btn"
          aria-label="Toggle theme"
        >
          {isDarkMode ? <FaSun /> : <FaMoon />}
          {!isCollapsed && (isDarkMode ? " Light Mode" : " Dark Mode")}
        </button>
      </div>
    </nav>
  );
};

export default SidebarContent;