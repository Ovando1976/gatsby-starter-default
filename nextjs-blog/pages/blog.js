import React from 'react';
import Head from 'next/head';
import styles from './styles/blog.module.css';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from './api/Firebase/firebaseConfig';




function Blog({ articles }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Blog - USVIexplorer</title>
        <meta name="description" content="Latest articles and updates from our blog." />
      </Head>

      <h1 className={styles.header}>Blog Page</h1>
      
      <div className={styles.articles}>
        {articles.map(article => (
          <div key={article.id} className={styles.article}>
            <h2>{article.title}</h2>
            <p>{article.excerpt}</p>
            {/* Add more details such as images, date, author, etc. */}
          </div>
        ))}
      </div>
      {/* Pagination, search functionality, categories, etc. can be added below */}
    </div>
  );
}

export async function getServerSideProps() {
  const db = getFirestore(app);
  const articlesCollection = collection(db, 'articles');
  let articlesList = [];

  try {
    const articleSnapshot = await getDocs(articlesCollection);
    articlesList = articleSnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    }));
  } catch (err) {
    console.error("Error fetching articles:", err);
  }

  return {
    props: {
      articles: articlesList
    }
  };
}

export default Blog;

