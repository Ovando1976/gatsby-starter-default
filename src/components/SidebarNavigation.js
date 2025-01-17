// src/components/SidebarNavigation.js

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../../pages/styles/Home.module.css';
import sidebarLinks from '../data/sidebarLinks';
import { useAuth } from '../../contexts/AuthProvider';

export default function SidebarNavigation() {
  const router = useRouter();
  const { user } = useAuth();
  const userRole = user?.role;

  function hasAccess(linkRoles) {
    if (!linkRoles) return true; // no role requirement
    return linkRoles.includes(userRole);
  }

  /**
   * Opens an external link in a new tab without using <a>.
   * You could also do router.push if it’s internal,
   * but for external, window.open is straightforward.
   */
  function handleExternalLink(url) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  return (
    <ul className={styles.sidebarList}>
      {sidebarLinks.map((link) => {
        if (!hasAccess(link.roles)) return null;

        const isActive = router.pathname === link.path;

        if (link.external) {
          // For external links: use a button with onClick
          return (
            <li key={link.path}>
              <button
                onClick={() => handleExternalLink(link.path)}
                className={`${styles.sidebarButton} ${
                  isActive ? styles.activeLink : ''
                }`}
              >
                {link.label}
              </button>
            </li>
          );
        }

        // Internal link: Use Next.js Link without <a>
        return (
          <li key={link.path}>
            <Link
              href={link.path}
              className={`${styles.sidebarButton} ${
                isActive ? styles.activeLink : ''
              }`}
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}