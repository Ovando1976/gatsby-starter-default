// src/components/Layout.js

import React, { useState, useEffect } from "react";
import { Link } from "gatsby";
import {
  X,
  Home,
  Compass,
  MessageSquare,
  User,
  Menu,
  Sun,
  Moon,
} from "react-feather";
import { useAuth } from "../hooks/useAuth";

export default function Layout({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { isAuthenticated, user, loginWithRedirect, logout, isLoading } = useAuth();

  // Toggle sidebar open/close
  const handleToggle = () => setIsOpen(!isOpen);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (typeof window !== "undefined") {
      document.documentElement.classList.toggle("dark");
    }
  };

  // Persist dark mode preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme");
      if (storedTheme === "dark") {
        setDarkMode(true);
        document.documentElement.classList.add("dark");
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (darkMode) {
        localStorage.setItem("theme", "dark");
      } else {
        localStorage.setItem("theme", "light");
      }
    }
  }, [darkMode]);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        {/* Sidebar */}
        <aside
          className={`${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } fixed z-50 flex flex-col w-64 h-full py-6 bg-white border-r dark:bg-gray-800 dark:border-gray-700 transform top-0 left-0 transition-transform duration-200 ease-in-out md:translate-x-0`}
        >
          <div className="flex items-center justify-between px-6 mb-4">
            <span className="text-xl font-semibold whitespace-nowrap dark:text-white">
              AI Social
            </span>
            <button
              onClick={handleToggle}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 md:hidden"
              aria-label="Close Sidebar"
            >
              <X />
            </button>
          </div>

          <nav className="flex flex-col space-y-1">
            <Link
              to="/"
              className="flex items-center px-6 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Home className="mr-2" size={18} />
              Feed
            </Link>
            <Link
              to="/explore"
              className="flex items-center px-6 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Compass className="mr-2" size={18} />
              Explore
            </Link>
            <Link
              to="/ai-tools"
              className="flex items-center px-6 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <span className="mr-2">🤖</span>
              AI Tools
            </Link>
            <Link
              to="/chat"
              className="flex items-center px-6 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <MessageSquare className="mr-2" size={18} />
              Chat
            </Link>
            <Link
              to="/collab"
              className="flex items-center px-6 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <span className="mr-2">👥</span>
              Collaboration
            </Link>
            <Link
              to="/profile"
              className="flex items-center px-6 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <User className="mr-2" size={18} />
              Profile
            </Link>
            {/* Authentication Links */}
            {!isLoading && !isAuthenticated && (
              <button
                onClick={() => loginWithRedirect()}
                className="mt-4 mx-6 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
              >
                Sign In
              </button>
            )}
            {!isLoading && isAuthenticated && (
              <button
                onClick={() => logout({ returnTo: window.location.origin })}
                className="mt-4 mx-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Sign Out
              </button>
            )}
          </nav>
        </aside>

        {/* Main area with top Nav */}
        <div className="flex flex-col flex-1 w-full md:ml-64">
          <header className="flex items-center justify-between w-full px-6 py-4 bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center">
              <button
                className="text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 md:hidden"
                onClick={handleToggle}
                aria-label="Open Sidebar"
              >
                <Menu />
              </button>
              <h1 className="hidden ml-4 text-xl font-semibold text-gray-800 dark:text-gray-200 md:block">
                AI Social
              </h1>
            </div>
            <button
              onClick={toggleDarkMode}
              className="flex items-center justify-center w-10 h-10 text-gray-600 bg-gray-200 rounded-full hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}