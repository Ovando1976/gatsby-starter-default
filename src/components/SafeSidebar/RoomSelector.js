import React from "react";

/**
 * RoomSelector
 * @param {string[]} rooms - list of room ids
 * @param {string} value - current room id
 * @param {(id:string)=>void} onChange - callback when selection changes
 */
export default function RoomSelector({ rooms = [], value, onChange }) {
  return (
    <div className="safeRoomRow" role="group" aria-label="Select chat room">
      <label className="safeRoomLabel" htmlFor="room-select">Room</label>
      <select
        id="room-select"
        className="safeRoomSelect"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      >
        {rooms.map((r) => (
          <option key={r} value={r}>{r}</option>
        ))}
      </select>
    </div>
  );
}