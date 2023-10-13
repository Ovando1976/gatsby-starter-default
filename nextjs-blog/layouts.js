import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <header className="header">
        {/* You can add a navigation bar here */}
        <h1>My Application</h1>
      </header>

      <main className="main-content">
        {children}  {/* This is where the page content will be rendered */}
      </main>

      <footer className="footer">
        {/* Footer content */}
        <p>© 2023 My Application. All rights reserved.</p>
      </footer>

      {/* You can add global styles here or import a stylesheet */}
      <style jsx>{`
        .layout {
          display: flex;
          flex-direction: column;
          min-block-size: 100vh;
        }

        .header {
          background: #333;
          color: white;
          padding: 1rem;
          text-align: center;
        }

        .main-content {
          flex: 1;
          padding: 1rem;
        }

        .footer {
          background: #444;
          color: white;
          padding: 1rem;
          text-align: center;
        }
      `}</style>
    </div>
  );
}

export default Layout;
