import React from "react"
import { Link } from "gatsby"        
import { useLocation } from "@reach/router"  
import * as styles from "../styles/Home.module.css" // Adjust path if needed
import sidebarLinks from "../data/sidebarLinks"
import { useAuth } from "../hooks/useAuth"

export default function SidebarNavigation() {
  // Instead of router, use @reach/router's location
  const location = useLocation()
  const { user } = useAuth()
  const userRole = user?.role

  function hasAccess(linkRoles) {
    if (!linkRoles) return true // no role requirement
    return linkRoles.includes(userRole)
  }

  /**
   * Opens an external link in a new tab without using <a>.
   * For internal links, we use <Link to="/..."/>.
   */
  function handleExternalLink(url) {
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <ul className={styles.sidebarList}>
      {sidebarLinks.map((link) => {
        if (!hasAccess(link.roles)) return null

        // Compare location.pathname with link.path
        const isActive = location.pathname === link.path

        if (link.external) {
          // For external links: use a button + onClick
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

        // Internal link: Use Gatsby <Link to="/...">
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