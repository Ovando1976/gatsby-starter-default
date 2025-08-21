import React from "react"
import { Link } from "gatsby"
import { useLocation } from "@reach/router"
import styles from "../pages/styles/Home.module.css" // Adjust if needed
import sidebarLinks from "../data/sidebarLinks"
import { useAuth } from "../hooks/useAuth"

export default function SidebarNavigation() {
  // For active link detection
  const location = useLocation()

  const { user } = useAuth()
  const userRole = user?.role

  function hasAccess(linkRoles) {
    if (!linkRoles) return true // no role requirement
    return linkRoles.includes(userRole)
  }

  /**
   * Opens an external link in a new tab for external URLs.
   */
  function handleExternalLink(url) {
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <ul className={styles.sidebarList}>
      {sidebarLinks.map((link) => {
        if (!hasAccess(link.roles)) return null

        // Check if this link is active by comparing location.pathname to link.path
        const isActive = location.pathname === link.path

        if (link.external) {
          // For external links
          return (
            <li key={link.path}>
              <button
                onClick={() => handleExternalLink(link.path)}
                className={`${styles.sidebarButton} ${
                  isActive ? styles.activeLink : ""
                }`}
              >
                {link.label}
              </button>
            </li>
          )
        }

        // Internal Gatsby link
        return (
          <li key={link.path}>
            <Link
              to={link.path}
              className={`${styles.sidebarButton} ${
                isActive ? styles.activeLink : ""
              }`}
            >
              {link.label}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}