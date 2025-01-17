import React from 'react';
import Head from 'next/head';
import fs from 'fs';
import path from 'path';

import { getSortedPostsData } from '../lib/getSortedPostsData';
import { AppProvider } from '../store/AppContext';

// Layout & Styles
import '../src/styles/Home.module.css';

// Custom Components
import { useAuth } from '../src/hooks/useAuth';   // Hypothetical custom hook for authentication
import SidebarContent from '../src/components/SidebarContent';
import Dashboard from './dashboard';
import Layout from "../src/components/Layout";

const postsDirectory = path.join(process.cwd(), 'posts');

export async function getStaticProps() {
  try {
    if (!fs.existsSync(postsDirectory)) {
      console.warn(`Directory ${postsDirectory} does not exist!`);
      return { props: { allPostsData: [] } };
    }

    const allPostsData = getSortedPostsData();
    return { props: { allPostsData } };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return { props: { allPostsData: [] } };
  }
}

export default function Home({ allPostsData }) {
  // Example: Hook for auth info. 
  // Could also come from NextAuth or your own context, etc.
  const { isAuthenticated, user } = useAuth();

  return (
    <AppProvider>
      <Layout sidebar={<SidebarContent isAuthenticated={isAuthenticated} user={user} />}>
        <Head>
          <title>USVIexplorer</title>
          <meta charSet="UTF-8" />
          <meta name="description" content="USVIexplorer Dashboard" />
          <meta name="keywords" content="USVI, Explorer, Travel, Dashboard" />
          <meta name="author" content="USVIexplorer" />
          <meta property="og:title" content="USVIexplorer Dashboard" />
          <meta
            property="og:description"
            content="Discover the best of USVI with our dashboard."
          />
          <meta property="og:image" content="/path_to_your_image.jpg" />
          <meta property="og:url" content="YOUR_SITE_URL_HERE" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        {/* Main Content Area */}
        <main className={styles.main}>
          <h1 className={styles.mainHeader}>USVIexplorer</h1>
          <Dashboard />
          <h2>Blog Posts</h2>
            {allPostsData.map((post) => (
              <div key={post.id}>
                <h2>{post.title}</h2>
              </div>
            ))}
          
        </main>
      </Layout>
    </AppProvider>
  );
}