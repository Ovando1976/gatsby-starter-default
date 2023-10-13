import Link from 'next/link';
import Head from 'next/head';
import Header from '../src/components/header';   
import { Provider } from 'react-redux';
import store from '../store/store';
import styles from './styles/Home.module.css';
import Profile from './ProfilePage';
import UserDocuments from './UserDocumentsPage';
import Notifications from './NotificationsPage';
import UserSettings from './UserSettingsPage';
import { getSortedPostsData } from '../lib/posts';
import Sidebar from '../src/components/sidebar';  
import SidebarList from '../src/components/sidebar-list';
import Chat from '../src/components/Chat';  
import Layout from '../layouts';  

import Styles from './styles/utils.module.css';

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}

export default function Home ({ allPostsData }) { 
    const isAuthenticated = true;  
    const userName = "John"; 

    return (
     
      <Provider store={store}>
         <Layout home>
        <div className={styles.container}>
            <Head>
                <title>USVIexplorer Dashboard</title>
                <meta charSet="UTF-8" />
                <meta name="description" content="USVIexplorer Dashboard" />
                <meta name="keywords" content="USVI, Explorer, Travel, Dashboard" />
                <meta name="author" content="USVIexplorer" />
                {/* OpenGraph meta tags for better sharing on platforms like Facebook */}
                <meta property="og:title" content="USVIexplorer Dashboard" />
                <meta property="og:description" content="Discover the best of USVI with our dashboard." />
                <meta property="og:image" content="/path_to_your_image.jpg" />
                <meta property="og:url" content="YOUR_SITE_URL_HERE" />
                <link rel="icon" href="/favicon.ico" />
                </Head>

                <Header />

<main className={styles.main}>
    {/* User Profile Picture */}
    {isAuthenticated && <Profile />}

    {/* Sidebar and Chat */}
    <div className={styles.sidebar}>
        <Sidebar />
        <SidebarList>
            {/* ... same sidebar items ... */}
        </SidebarList>
        <Chat />
    </div>
    <div className={styles.content}>
                    <h1 className={styles.header}>
                        {isAuthenticated ? `Welcome back, ${userName}!` : 'Welcome to USVIexplorer'}
                    </h1>

                    {/* User Document Management */}
                    {isAuthenticated && <UserDocuments />}

                    {/* Notifications */}
                    {isAuthenticated && <Notifications />}

                    {/* User Settings and Preferences */}
                    {isAuthenticated && <UserSettings />}
        </div>

                <div className={styles.linksContainer}>
                    <Link href="/user">User Profile</Link>
                    <Link href="/blog">Blog</Link>
                    <Link href="/groups">Groups</Link>
                    <Link href="/events">Events</Link>
                    <Link href="/booking">Booking</Link>
                    <Link href="/expenses">Expenses</Link>
                    <Link href="/register">Registration</Link>
                    <Link href="/dashboard">Dashboard</Link>
                    <Link href="/driverProfile">Driver Profile</Link>
                </div>

                <p className={styles.description}>
                    {!isAuthenticated ? (
                        <>
                            Not logged in? {' '}
                            <Link href="/login">
                                <button>Login</button>
                            </Link>
                        </>
                    ) : (
                        <Link href="/dashboard">
                            <button>Go to Dashboard</button>
                        </Link>
                    )}
                </p>
            </main>
            </div>
        <section className={`${Styles.headingMd} ${Styles.padding1px}`}>
          <h2 className={Styles.headingLg}>Blog</h2>
          <ul className={Styles.list}>
            {allPostsData.map(({ id, date, title }) => (
              <li className={Styles.listItem} key={id}>
                {title}
                <br />
                {id}
                <br />
                {date}
              </li>
            ))}
          </ul>
        </section>

       </Layout>
            <footer className={styles.footer}>
                <p>&copy; 2023 USVIexplorer. All rights reserved.</p>
                <Link href="/terms">Terms & Conditions</Link>
                <Link href="/privacy">Privacy Policy</Link>
                </footer>
      </Provider>
    );
}
