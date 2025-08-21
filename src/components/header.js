import React, { useState, useEffect, useRef } from "react"
import { navigate, Link } from "gatsby"      // Gatsby Link + navigate
// import { getImage, GatsbyImage } from "gatsby-plugin-image" // if you want Gatsby images
import { getCurrentUser, signOutUser } from "./auth" // Adjust path if needed
import ThemeToggle from "./theme-toggle"
import { ClearHistory } from "./clear-history"
import styles from "./header.module.css"
import { cn } from "../lib/utils" // or wherever your cn function is
// Icons
import { IconArrowElbow, IconPlus } from "./ui/icons"

// Hook: Detect clicks outside a referenced element
const useClickOutside = (ref, callback) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback()
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [ref, callback])
}

// Minimal link (Gatsby version)
const LinkItem = ({ path, label }) => (
  <Link to={path} className={styles.linkItem}>
    {label}
  </Link>
)

// Dropdown menu
function UserDropdown({ isOpen, onSelectProfile, onSelectSettings, onLogout }) {
  return (
    <div
      className={`${styles.dropdownMenu} ${
        isOpen ? styles.dropdownOpen : styles.dropdownClosed
      }`}
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
  )
}

// Main Header
function Header() {
  const [session, setSession] = useState(null)
  const [isDropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Replace Next.js getCurrentUser usage with your own logic or keep if it works for Gatsby
  useEffect(() => {
    const fetchSession = async () => {
      const currentSession = await getCurrentUser()
      setSession(currentSession)
    }
    fetchSession()
  }, [])

  useClickOutside(dropdownRef, () => setDropdownOpen(false))

  // Your nav links
  const Links = [
    { path: "/", label: "Home" },
    { path: "/blog", label: "Blog" },
    { path: "/user", label: "User" },
    { path: "/groups", label: "Groups" },
    { path: "/events", label: "Events" },
    { path: "/booking", label: "Booking" },
    { path: "/driverProfile", label: "Driver Profile" },
  ]

  // Dropdown events
  const handleProfile = () => {
    setDropdownOpen(false)
    navigate("/profile")
  }
  const handleSettings = () => {
    setDropdownOpen(false)
    navigate("/settings")
  }
  const handleLogout = async () => {
    try {
      setDropdownOpen(false)
      await signOutUser()
      console.log("User logged out!")
      // Possibly navigate("/login")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <header className={styles.navbar}>
      <nav className={styles.navInner}>
        {/* Brand or Logo */}
        <div className={styles.brandSection}>
          <Link to="/" className={styles.brandLink}>
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
              onClick={() => navigate("/")} // or some login route
              role="button"
              tabIndex={0}
            >
              {/* Light Mode Icon */}
              <img
                src="/IconNextChat.png"
                alt="Next Chat Icon"
                className={`${styles.navIcon} dark:hidden`}
                width={24}
                height={24}
              />
              {/* Dark Mode Icon */}
              <img
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
  )
}

export default Header