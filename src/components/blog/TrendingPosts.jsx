import React from 'react';
import Link from 'next/link';
import styles from '../../../pages/styles/blog.module.css';

function TrendingPosts({ trending }) {
  return (
    <div>
      <h2>Trending Posts</h2>
      <ul>
        {trending && trending.length > 0 ? (
          trending.map((post) => (
            <li key={post.id} className={styles.sidebarItem}>
              <Link href={`/posts/${post.id}`} className={styles.trendingLink}>
                {post.title}
              </Link>
            </li>
          ))
        ) : (
          <p>No trending posts available.</p>
        )}
      </ul>
    </div>
  );
}

export default TrendingPosts;