import React from "react";

export default function DebugBanner({ text = "App mounted ✅" }) {
  return (
    <div style={{
      padding: "8px 12px",
      background: "#0ea5e9",
      color: "white",
      fontWeight: 600,
      fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell",
    }}>
      {text}
    </div>
  );
}