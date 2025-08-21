import React, { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, limit, query } from "firebase/firestore";
import { getFirebaseFirestore } from "firebaseConfig";   // ← path fix
import { initials, timeAgo } from "../../utils/time";

export default function SafeMessages({ roomId = "default-room", pageSize = 5 }) {
  const [items, setItems] = useState([]);
  const [state, setState] = useState({ loading: true, error: "" });
  const db = getFirebaseFirestore();

  useEffect(() => {
    if (!db) return;
    try {
      const q = query(
        collection(db, `chatRooms/${roomId}/messages`),
        orderBy("timestamp", "desc"),
        limit(pageSize)
      );

      const unsub = onSnapshot(
        q,
        (snap) => {
          const rows = snap.docs.map((doc) => {
            const d = doc.data();
            const dt = d.timestamp?.toDate?.();
            return {
              id: doc.id,
              sender: d.sender ?? "Unknown",
              preview: d.preview ?? d.text ?? "",
              when: dt ? timeAgo(dt) : "—",
            };
          });
          setItems(rows);
          setState({ loading: false, error: "" });
        },
        (err) => setState({ loading: false, error: err.message || "Listen failed" })
      );

      return () => unsub();
    } catch (e) {
      setState({ loading: false, error: e.message || "Query failed" });
    }
  }, [db, roomId, pageSize]);

  if (state.loading) return <p style={{ opacity: 0.75, marginTop: 0 }}>Loading…</p>;
  if (state.error)   return <p style={{ color: "#ef4444" }}>Error: {state.error}</p>;
  if (items.length === 0) return <p style={{ opacity: 0.75, marginTop: 0 }}>No recent messages</p>;

  return (
    <ul className="safeMsgs">
      {items.map((m) => (
        <li key={m.id} className="safeMsgRow">
          <div className="safeMsgTop">
            <div className="safeAvatar">{initials(m.sender)}</div>
            <div className="safeMsgMeta">
              <div className="safeMetaTop">
                <strong className="safeMsgSender">{m.sender}</strong>
                <span className="safeMsgTime">{m.when}</span>
              </div>
              {m.preview ? <div className="safeMsgPreview">{m.preview}</div> : null}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}