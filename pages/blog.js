import React, { useState, useCallback } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// If your styles folder is in the root with pages and components:
import styles from "../src/styles/blog.module.css";

import { useAuth } from "../contexts/AuthProvider";
import AuthToggle from "../src/components/AuthToggle";
import Logout from "../src/components/Logout";
import CategoryMenu from "../src/components/blog/CategoryMenu";
import CreatePost from "../src/components/blog/CreatePost";
import TrendingPosts from "../src/components/blog/TrendingPosts";

function Blog({ articles, trending }) {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("All");

  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category);
  }, []);

  const filteredArticles =
    selectedCategory === "All"
      ? articles
      : articles.filter((article) => article.category === selectedCategory);

  return (
    <div className={styles.container}>
      <Head>
        <title>Blog - USVIexplorer</title>
        <meta
          name="description"
          content="Latest articles and updates from our blog in the US Virgin Islands."
        />
      </Head>

      <div className={styles.layout}>
        {/* Left Sidebar */}
        <aside className={styles.sidebar}>
          <CategoryMenu
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </aside>

        {/* Main Content */}
        <main className={styles.mainContent}>
          {!user ? (
            <AuthToggle />
          ) : (
            <>
              <Logout />
              <CreatePost />
            </>
          )}

          <section className={styles.postsSection}>
            {filteredArticles.length > 0 ? (
              filteredArticles.map((article) => {
                const postDate = article.date
                  ? new Date(article.date).toLocaleDateString()
                  : "No Date";

                return (
                  <div key={article.id} className={styles.postCard}>
                    {article.imageUrl && (
                      <Image
                        src={article.imageUrl}
                        alt={article.title}
                        width={800}
                        height={450}
                        className={styles.postImage}
                      />
                    )}
                    <div className={styles.postContent}>
                      <h3>{article.title}</h3>
                      <p>{article.excerpt}</p>
                      <span>{postDate}</span>
                      {/* 
                        If you're on Next.js 13+, className on Link is fine.
                        Otherwise, wrap in an <a> tag with passHref legacyBehavior. 
                      */}
                      <Link href={`/posts/${article.id}`} className={styles.readMoreLink}>
                        Read More
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>No posts found for this category. Please check back later.</p>
            )}
          </section>
        </main>

        {/* Right Sidebar */}
        <aside className={styles.rightSidebar}>
          <TrendingPosts trending={trending} />
        </aside>
      </div>

      <ToastContainer />
    </div>
  );
}

export async function getServerSideProps() {
  try {
    // Fetch latest posts
    const articlesRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/userPosts?userId=ALL`
    );
    const articles = await articlesRes.json();

    // Fetch trending posts
    const trendingRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/documents`
    );
    const trending = await trendingRes.json();

    return {
      props: {
        articles,
        trending,
      },
    };
  } catch (error) {
    console.error("Error fetching posts from API:", error);
    return {
      props: {
        articles: [],
        trending: [],
      },
    };
  }
}

export default Blog;