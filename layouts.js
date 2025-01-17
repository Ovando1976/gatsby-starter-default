import React from "react";

/**
 * Expects:
 * - `sidebar`: A React element for the left sidebar content
 * - `children`: The main content
 */
const Layout = ({ sidebar, children }) => {
  return (
    <div className="layout">
      {/* Header (optional) */}
      <header className="header">
        <nav className="navBar">
          <div className="brandSection">
            <a href="/" className="brandLink">
              MyApp
            </a>
          </div>
          <div className="navLinks">
            <a href="/" className="navLink">Home</a>
            <a href="/about" className="navLink">About</a>
            <a href="/contact" className="navLink">Contact</a>
          </div>
        </nav>
      </header>

      <div className="bodyContainer">
        {/* Left Sidebar */}
        <aside className="sidebarArea">
          {sidebar}
        </aside>

        {/* Main Content */}
        <main className="mainContent">
          {children}
        </main>
      </div>

      <footer className="footer">
        <p>&copy; 2023 My Application. All rights reserved.</p>
      </footer>

      {/* Inline or external stylesheet */}
      <style jsx>{`
        /********************************************
         * Layout outer container
         ********************************************/
        .layout {
          display: flex;
          flex-direction: column;
          min-height: 100vh; /* allows the footer to be at the bottom */
          background-color: #f9fafb; /* light background */
        }

        /********************************************
         * Header with gradient background (optional)
         ********************************************/
        .header {
          background: linear-gradient(90deg, #0d9488 0%, #3b82f6 100%);
          color: #fff;
          padding: 0.75rem 0;
        }
        .navBar {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1rem;
        }
        .brandSection .brandLink {
          text-decoration: none;
          font-size: 1.25rem;
          font-weight: bold;
          color: inherit;
        }
        .navLinks {
          display: flex;
          gap: 1rem;
        }
        .navLink {
          text-decoration: none;
          color: #fff;
          font-weight: 500;
          transition: opacity 0.2s ease-in-out;
        }
        .navLink:hover {
          opacity: 0.8;
        }

        /********************************************
         * Body container: sidebar + main content
         ********************************************/
        .bodyContainer {
          display: flex;
          flex: 1; /* fill the screen’s remaining space */
          min-height: 0; /* ensures the children can scroll if needed */
        }

        /* Sidebar on the left */
        .sidebarArea {
          width: 280px; /* fix the width or use 20% if you prefer */
          flex-shrink: 0; /* prevents it from shrinking */
          background-color: #ffffff;
          border-right: 1px solid #e5e7eb; /* subtle border */
          padding: 1rem;
          /* If you want it scrollable or sticky, you can do:
            position: sticky;
            top: 0;
            height: calc(100vh - (header height));
          */
        }

        /* Main content to the right */
        .mainContent {
          flex: 1;
          padding: 1rem;
          overflow: auto; /* if you want it to scroll inside */
          max-width: 1200px;
          margin: 0 auto; /* center the content area if you want narrower reading width */
        }

        /********************************************
         * Footer
         ********************************************/
        .footer {
          background: #444;
          color: #fff;
          text-align: center;
          padding: 1rem;
        }
      `}</style>
    </div>
  );
};

export default Layout;