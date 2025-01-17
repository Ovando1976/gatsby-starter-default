import React from "react";
import Link from "next/link";
import Head from "next/head";
import styles from "../src/styles/Dashboard.module.css";
import FloatingCard from "../src/components/FloatingCard";

// Sample data for pages
const pagesData = [
  {
    avatarSrc: "/avatar1.jpg",
    title: "User Profile",
    description: "Manage your user details and settings.",
    link: "/user",
  },
  {
    avatarSrc: "/avatar2.jpg",
    title: "Blog",
    description: "Discover and read our latest blog posts.",
    link: "/blog",
  },
  {
    avatarSrc: "/avatar3.jpg",
    title: "FoodDelivery",
    description: "Book your ride details and settings.",
    link: "/foodDelivery",
  },
  {
    avatarSrc: "/avatar4.jpg",
    title: "Driver Profile",
    description: "Choose your personal driver.",
    link: "/driverProfile",
  },
  {
    avatarSrc: "/avatar5.jpg",
    title: "Events",
    description: "Keep track of the latest events in the USVI.",
    link: "/events",
  },
  {
    avatarSrc: "/avatar6.jpg",
    title: "Expenses",
    description: "Keep track of your receipts and expenses.",
    link: "/expenses",
  },
  {
    avatarSrc: "/avatar7.jpg",
    title: "Groups",
    description: "Join, create, and collaborate with groups.",
    link: "/groups",
  },
  {
    avatarSrc: "/avatar8.jpg",
    title: "Register",
    description: "Register now to unlock all of the features of this app.",
    link: "/register",
  },
];

function Dashboard() {
  return (
    <div className={styles.container}>
      <Head>
        <title>USVIexplorer Dashboard</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="USVIexplorer Dashboard" />
        <meta name="keywords" content="USVI, Explorer, Travel, Dashboard" />
        <meta name="author" content="USVIexplorer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.header}>Welcome to USVIexplorer Dashboard</h1>
        <p>Select an option to navigate:</p>

        {/* Sidebar Buttons */}
        <div className={styles.linksContainer}>
          {pagesData.map((page) => (
            <button
              key={page.title}
              className={styles.sidebarButton}
              onClick={() => (window.location.href = page.link)}
            >
              {page.title}
            </button>
          ))}
        </div>

        {/* Floating Cards */}
        <div className={styles.cardsContainer}>
          {pagesData.map((page) => (
            <Link href={page.link} key={page.title} className={styles.cardLink}>
              <FloatingCard
                avatarSrc={page.avatarSrc}
                title={page.title}
                description={page.description}
              />
            </Link>
          ))}
        </div>

        {/* Login Section */}
        <nav className={styles.linksContainer}>
          <h2>Information</h2>
          <p>If you're not logged in, please proceed to the login page.</p>
          <Link href="/login">
            <button className={styles.loginBtn}>Login</button>
          </Link>
        </nav>
      </main>
    </div>
  );
}

export default Dashboard;