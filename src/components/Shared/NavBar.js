import React from "react";
import Link from "next/link";
import { useAuth } from "../../../contexts/AuthProvider"; // Authentication context

const Navbar = () => {
  const { user, auth } = useAuth();

  const navStyle = {
    display: "flex",
    justifyContent: "space-between",
    padding: "1rem",
    background: "#f8f9fa",
  };

  const linkStyle = {
    marginRight: "1rem",
    textDecoration: "none",
    color: "#007bff",
  };

  return (
    <nav style={navStyle}>
      {/* Home link (no <a> tag) */}
      <Link href="/" style={linkStyle}>
        Home
      </Link>

      {user ? (
        <div>
          {/* Order History link (no <a> tag) */}
          <Link href="/orders" style={linkStyle}>
            Order History
          </Link>
          {/* Logout button */}
          <button
            onClick={() => auth.signOut()}
            style={{
              background: "none",
              border: "none",
              color: "#007bff",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Logout
          </button>
        </div>
      ) : (
        <div>
          {/* Login link (no <a> tag) */}
          <Link href="/login" style={{ textDecoration: "none", color: "#007bff" }}>
            Login
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;