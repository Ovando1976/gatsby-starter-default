import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link'; 
import { IconNextChat } from './ui/icons';
import { getCurrentUser, signOutUser } from '../../auth';
import ThemeToggle from './theme-toggle';
import { ClearHistory } from './clear-history';
import styles from './header.module.css';

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

const LinkItem = ({ path, label }) => (
  <Link key={path} href={path} className={styles.link}>
    {label}
  </Link>
);

const Dropdown = ({ isDropdownOpen, router }) => (
  <div style={{
    position: 'absolute',
    insetBlockStart: '100%',
    insetInlineStart: 0,
    border: '1px solid #ddd',
    backgroundColor: 'white'
  }}>
    <div onClick={() => router.push("/profile")} className={styles.link}>Profile</div>
    <div onClick={() => router.push("/settings")} className={styles.link}>Settings</div>
    <div className={styles.link} onClick={async () => {
      try {
        await signOutUser();
        console.log("User logged out!");
      } catch (error) {
        console.error('Error signing out:', error);
      }
    }}>Logout</div>
  </div>
);

const Header = () => {
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
    { path: "/driverProfile", label: "Driver Profile" }
  ];

  return (
    <header className={styles.navbar}>
      {Links.map(link => <LinkItem {...link} />)}

      {session?.user ? (
        <>
          <div
            className={styles.link}
            onClick={() => setDropdownOpen(prevState => !prevState)}
            ref={dropdownRef}
          >
            User
            {isDropdownOpen && <Dropdown isDropdownOpen={isDropdownOpen} router={router} />}
          </div>
          <ThemeToggle />
          <ClearHistory />
        </>
      ) : (
        <div onClick={() => router.push("/")}>
          <IconNextChat className="mr-2 h-6 w-6 dark:hidden" />
          <IconNextChat className="mr-2 hidden h-6 w-6 dark:block" />
        </div>
      )}
    </header>
  );
};

export default Header;
