import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styles from './styles/Dashboard.module.css';
import FloatingCard from '../src/components/FloatingCard';


// Sample data for pages
const pagesData = [
    { avatarSrc: '/path_to_avatar1.jpg', title: 'User Profile', description: 'Manage your user details and settings.' },
    { avatarSrc: '/path_to_avatar2.jpg', title: 'Blog', description: 'Discover and read our latest blog posts.' },
    { avatarSrc: '/path_to_avatar1.jpg', title: 'Booking', description: 'Book your ride details and settings.' },
    { avatarSrc: '/path_to_avatar2.jpg', title: 'Driver Profile', description: 'Choose your personal driver.' },
    { avatarSrc: '/path_to_avatar1.jpg', title: 'Events', description: 'Keep track of the latest eventsd in the USVI.' },
    { avatarSrc: '/path_to_avatar2.jpg', title: 'Expenses', description: 'Keep track of your reciepts and expenses.' },
    { avatarSrc: '/path_to_avatar1.jpg', title: 'Groups', description: 'Join, create and collaborate with groups.' },
    { avatarSrc: '/path_to_avatar2.jpg', title: 'Register', description: 'Register now to unlock all of the features of this app.' },
    // ... Add other pages data
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

        <div className={styles.linksContainer}>
          <Link href="/user">User Profile</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/groups">Groups</Link>
          <Link href="/events">Events</Link>
          <Link href="/booking">Booking</Link>
          <Link href="/expenses">Expenses</Link>
          <Link href="/register">Registration</Link>
          <Link href="/driverprofile">Driver Profile</Link>
        </div>

        <section className={styles.infoSection}>
          <h2>Information</h2>
          <p>If you're not logged in, please proceed to the login page.</p>
          <Link href="/login">
            <button className={styles.loginBtn}>Login</button>
          </Link>
        </section>
        <div className={styles.container}>
            {/* Other components and content */}
            <div className={styles.cardsContainer}>
                {pagesData.map((page, index) => (
                    <FloatingCard key={index} {...page} />
                ))}
            </div>
        </div>

        </main>

      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} USVIexplorer. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Dashboard;
