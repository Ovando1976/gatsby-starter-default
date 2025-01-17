"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { getCurrentUser, signOutUser } from "./auth"; // Adjust path if needed
import ThemeToggle from "./theme-toggle";
import { ClearHistory } from "./clear-history";
import styles from "./header.module.css";

// Hook: Detect clicks outside a referenced element
const useClickOutside = (ref, callback) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
};

// Minimal link
const LinkItem = ({ path, label }) => (
  <Link href={path} className={styles.linkItem}>
    {label}
  </Link>
);

// Dropdown menu
function UserDropdown({ isOpen, onSelectProfile, onSelectSettings, onLogout }) {
  return (
    <div
      className={`
        ${styles.dropdownMenu} 
        ${isOpen ? styles.dropdownOpen : styles.dropdownClosed}
      `}
      role="menu"
      aria-hidden={!isOpen}
    >
      <div onClick={onSelectProfile} role="menuitem" className={styles.dropdownItem}>
        Profile
      </div>
      <div onClick={onSelectSettings} role="menuitem" className={styles.dropdownItem}>
        Settings
      </div>
      <div onClick={onLogout} role="menuitem" className={styles.dropdownItem}>
        Logout
      </div>
    </div>
  );
}

// Main Header
function Header() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchSession = async () => {
      const currentSession = await getCurrentUser();
      setSession(currentSession);
    };
    fetchSession();
  }, []);

  useClickOutside(dropdownRef, () => setDropdownOpen(false));

  const Links = [
    { path: "/", label: "Home" },
    { path: "/blog", label: "Blog" },
    { path: "/user", label: "User" },
    { path: "/groups", label: "Groups" },
    { path: "/events", label: "Events" },
    { path: "/booking", label: "Booking" },
    { path: "/driverProfile", label: "Driver Profile" },
  ];

  // Dropdown events
  const handleProfile = () => {
    setDropdownOpen(false);
    router.push("/profile");
  };
  const handleSettings = () => {
    setDropdownOpen(false);
    router.push("/settings");
  };
  const handleLogout = async () => {
    try {
      setDropdownOpen(false);
      await signOutUser();
      console.log("User logged out!");
      // Possibly router.push("/login")
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className={styles.navbar}>
      <nav className={styles.navInner}>
        {/* Brand or Logo */}
        <div className={styles.brandSection}>
          <Link href="/" className={styles.brandLink}>
            <span className={styles.brandText}>MyApp</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className={styles.linksContainer}>
          {Links.map((link) => (
            <LinkItem key={link.path} path={link.path} label={link.label} />
          ))}
        </div>

        {/* Right side: user or guest */}
        <div className={styles.rightSide}>
          {session?.user ? (
            <>
              {/* Dropdown Trigger */}
              <div
                className={styles.userButton}
                onClick={() => setDropdownOpen((prev) => !prev)}
                ref={dropdownRef}
                aria-haspopup="true"
                aria-expanded={isDropdownOpen}
                tabIndex={0}
              >
                User
                <UserDropdown
                  isOpen={isDropdownOpen}
                  onSelectProfile={handleProfile}
                  onSelectSettings={handleSettings}
                  onLogout={handleLogout}
                />
              </div>
              <ThemeToggle />
              <ClearHistory />
            </>
          ) : (
            <div
              className={styles.guestIcon}
              onClick={() => router.push("/")}
              role="button"
              tabIndex={0}
            >
              {/* Light Mode Icon */}
              <Image
                src="/IconNextChat.png"
                alt="Next Chat Icon"
                className={`${styles.navIcon} dark:hidden`}
                width={24}
                height={24}
              />
              {/* Dark Mode Icon */}
              <Image
                src="/IconNextChat.png"
                alt="Next Chat Icon Dark"
                className={`${styles.navIcon} hidden dark:block`}
                width={24}
                height={24}
              />
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;