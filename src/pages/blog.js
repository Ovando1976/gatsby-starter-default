// src/pages/blog.js

import React, { useState, useCallback } from "react"
import { Helmet } from "react-helmet"
import { Link } from "gatsby"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import { useAuth } from "../hooks/useAuth"
import AuthToggle from "../components/AuthToggle"
import Logout from "../components/Logout"
import CategoryMenu from "../components/blog/CategoryMenu"
import CreatePost from "../components/blog/CreatePost"
import TrendingPosts from "../components/blog/TrendingPosts"

// Import CSS module here
import "../styles/blog.module.css"

// If you have serverData from getServerData, you can define it like this:
// export async function getServerData() { ... }

export default function Blog({ articles = [], trending = [] }) {
  const { user } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState("All")

  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category)
  }, [])

  const filteredArticles =
    selectedCategory === "All"
      ? articles
      : articles.filter((article) => article.category === selectedCategory)

  return (
    <div className={styles.container}>
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
          {/* If the user is not logged in, show AuthToggle, otherwise show Logout & CreatePost */}
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
                  : "No Date"

                return (
                  <div key={article.id} className={styles.postCard}>
                    {article.imageUrl && (
                      <img
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
                      <Link to={`/posts/${article.id}`} className={styles.readMoreLink}>
                        Read More
                      </Link>
                    </div>
                  </div>
                )
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
  )
}