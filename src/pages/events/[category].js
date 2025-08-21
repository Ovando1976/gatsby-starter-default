import React, { useState, useCallback } from "react";
import { Link } from "gatsby";
import { Helmet } from "react-helmet";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GatsbyImage, getImage } from "gatsby-plugin-image"; // Import GatsbyImage and getImage

import { useAuth } from "../../hooks/useAuth";
import AuthToggle from "../../components/AuthToggle";
import Logout from "../../components/Logout";
import CategoryMenu from "../../components/blog/CategoryMenu";
import CreatePost from "../../components/blog/CreatePost";
import TrendingPosts from "../../components/blog/TrendingPosts";

// Styles
import * as styles from "../../styles/blog.module.css";

// Gatsby SSR data fetch: runs server-side on every request
export async function getServerData() {
  try {
    // Example environment variable in Gatsby is GATSBY_API_URL
    const baseUrl = process.env.GATSBY_API_URL;

    if (!baseUrl) {
      console.error("GATSBY_API_URL is not defined in environment variables.");
      return {
        props: {
          articles: [],
          trending: [],
        },
        status: 500,
      };
    }

    // Fetch articles
    const articlesRes = await fetch(`${baseUrl}/api/userPosts?userId=ALL`);
    if (!articlesRes.ok) {
      throw new Error(`Failed to fetch articles: ${articlesRes.status}`);
    }
    const articles = await articlesRes.json();

    // Fetch trending
    const trendingRes = await fetch(`${baseUrl}/api/documents`);
    if (!trendingRes.ok) {
      throw new Error(`Failed to fetch trending posts: ${trendingRes.status}`);
    }
    const trending = await trendingRes.json();

    return {
      props: {
        articles,
        trending,
      },
      //  optional:
      //  status: 200,
      //  headers: { "Cache-Control": "max-age=600" },
    };
  } catch (error) {
    console.error("Error fetching posts from API:", error);
    return {
      props: {
        articles: [],
        trending: [],
      },
      status: 500,
    };
  }
}

export default function Blog({ serverData }) {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("All");

  const articles = serverData?.articles || [];
  const trending = serverData?.trending || [];

  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category);
  }, []);

  const filteredArticles =
    selectedCategory === "All"
      ? articles
      : articles.filter((article) => article.category === selectedCategory);

  return (
    <div className={styles.container}>
      {/* SEO / HEAD */}
      <Helmet>
        <title>Blog - USVIexplorer</title>
        <meta
          name="description"
          content="Latest articles and updates from our blog in the US Virgin Islands."
        />
      </Helmet>

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
                const image = article.localImage ? getImage(article.localImage) : null; // Assuming you have a localImage field

                return (
                  <div key={article.id} className={styles.postCard}>
                    {/* Use GatsbyImage */}
                    {image && (
                      <GatsbyImage image={image} alt={article.title} className={styles.postImage} />
                    )}
                    {!image && article.imageUrl && (
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className={styles.postImage}
                      />
                    )}
                    <div className={styles.postContent}>
                      <h3>{article.title}</h3>
                      <p>{article.excerpt}</p>
                      <span>{postDate}</span>
                      <Link to={`/posts/${article.id}`} className={styles.readMoreLink}>
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