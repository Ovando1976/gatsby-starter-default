import React, { useMemo, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getFirebaseAuth, getFirebaseFirestore } from "firebaseConfig";
import { signInAnonymously } from "firebase/auth";

/**
 * SafeCompose
 * - roomId: chat room to post into (default: "default-room")
 * - onSent: optional callback after a successful send
 */
export default function SafeCompose({ roomId = "default-room", onSent }) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  // SSR-safe handles (return null server-side in your setup)
  const auth = getFirebaseAuth();
  const db = getFirebaseFirestore();

  const user = auth?.currentUser ?? null;
  const senderName = useMemo(() => {
    if (!user) return "Guest";
    return user.displayName || user.email || user.uid;
  }, [user]);

  async function handleSend(e) {
    e.preventDefault();
    setError("");

    if (!db) return setError("Firestore not ready.");
    if (!user) return setError("Sign in to send messages.");

    const trimmed = text.trim();
    if (!trimmed) return;

    setSending(true);
    try {
      const colRef = collection(db, "chatRooms", roomId, "messages");
      await addDoc(colRef, {
        userId: user.uid,
        sender: senderName,
        preview: trimmed,
        text: trimmed,
        timestamp: serverTimestamp(),
        createdAt: serverTimestamp(),
      });

      setText("");
      onSent?.();
    } catch (err) {
      setError(err?.message || "Failed to send");
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={handleSend} className="safeCompose" aria-label="Send message">
      <input
        type="text"
        className="safeInput"
        placeholder={user ? `Message as ${senderName}` : "Sign in to chat…"}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          if (error) setError(""); // clear old error as user types
        }}
        disabled={sending || !db}
        aria-label="Message text"
      />

      <button
        type="submit"
        className="safeSendBtn"
        disabled={sending || !text.trim() || !db || !user}
        aria-label="Send message"
        title={!user ? "Sign in to send" : "Send"}
      >
        {sending ? "Sending…" : "Send"}
      </button>

      {/* Anonymous sign-in (dev-friendly) */}
      {!user && db ? (
        <button
          type="button"
          className="safeSendBtn"
          style={{ background: "#6b7280", marginLeft: 8 }}
          onClick={() =>
            signInAnonymously(getFirebaseAuth()).catch((e) => setError(e.message))
          }
          title="Sign in anonymously"
        >
          Guest
        </button>
      ) : null}

      {error ? <div className="safeError">{error}</div> : null}
    </form>
  );
}