import React from "react"
// Replace next/link with Gatsby's Link
import { Link } from "gatsby"

import "../../styles/blog.module.css"

function TrendingPosts({ trending }) {
  return (
    <div>
      <h2>Trending Posts</h2>
      <ul>
        {trending && trending.length > 0 ? (
          trending.map((post) => (
            <li key={post.id} className={styles.sidebarItem}>
              {/* Replace href= with to= for Gatsby */}
              <Link to={`/posts/${post.id}`} className={styles.trendingLink}>
                {post.title}
              </Link>
            </li>
          ))
        ) : (
          <p>No trending posts available.</p>
        )}
      </ul>
    </div>
  )
}

export default TrendingPosts