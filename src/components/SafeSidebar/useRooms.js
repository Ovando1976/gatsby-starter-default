import { useEffect, useState } from "react";
import { getFirebaseFirestore } from "firebaseConfig";
import { collection, onSnapshot, orderBy, query, limit } from "firebase/firestore";

/** Returns [{id,name}] */
export default function useRooms(defaultRooms = ["default-room","lounge","dev-room"]) {
  const db = getFirebaseFirestore();
  const [rooms, setRooms] = useState(defaultRooms.map(id => ({ id, name: id })));

  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, "chatRooms"), orderBy("createdAt", "desc"), limit(100));
    const unsub = onSnapshot(q, snap => {
      const docs = snap.docs.map(d => ({ id: d.id, name: d.data()?.name || d.id }));
      // merge with defaults (preserve if missing)
      const merged = [...docs];
      defaultRooms.forEach(id => {
        if (!merged.find(r => r.id === id)) merged.push({ id, name: id });
      });
      setRooms(merged);
    });
    return () => unsub();
  }, [db]);

  return rooms;
}