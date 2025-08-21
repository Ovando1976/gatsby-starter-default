import React from "react"
import { Helmet } from "react-helmet"
import * as styles from "../../styles/post.module.css"
// If you have a firebaseAdmin setup, you can import it
import { admin, db } from "../../firebaseAdmin"

// Gatsby SSR data fetch (v4.3+). This replaces getServerSideProps.
export async function getServerData({ query }) {
  // We'll read `id` from the query string: e.g. /posts/[id]?id=xyz
  const { id } = query

  if (!id) {
    // No ID passed => we can't fetch the doc
    return {
      props: {
        post: null,
        error: "No ID provided in query string.",
      },
      status: 400,
    }
  }

  try {
    // Attempt to fetch from your Firestore "articles" collection
    const postRef = db.collection("articles").doc(id)
    const doc = await postRef.get()

    if (!doc.exists) {
      return {
        props: {
          post: null,
        },
        status: 404,
      }
    }

    // Increment the view count atomically (Admin SDK)
    await postRef.update({
      viewCount: admin.firestore.FieldValue.increment(1),
    })

    return {
      props: {
        post: {
          id: doc.id,
          ...doc.data(),
        },
      },
      // optional: { status: 200 }
    }
  } catch (error) {
    console.error("Error fetching post:", error)
    return {
      props: {
        post: null,
        error: error.message,
      },
      status: 500,
    }
  }
}

export default function PostPage({ serverData }) {
  const { post, error } = serverData || {}

  if (error) {
    return <div className={styles.notFound}>Error: {error}</div>
  }

  if (!post) {
    return <div className={styles.notFound}>Post not found.</div>
  }

  // Date logic if post.date is a Firestore timestamp
  const readableDate =
    post.date?.seconds
      ? new Date(post.date.seconds * 1000).toLocaleDateString()
      : "No Date"

  return (
    <div className={styles.container}>
      <Helmet>
        <title>{post.title} - USVIexplorer</title>
        <meta name="description" content={post.excerpt || "Blog post"} />
      </Helmet>

      <article className={styles.post}>
        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt={post.title}
            width="800"
            height="450"
            className={styles.postImage}
          />
        )}
        <h1 className={styles.postTitle}>{post.title}</h1>
        <p className={styles.postDate}>{readableDate}</p>
        <div className={styles.postContent}>{post.content}</div>
      </article>
    </div>
  )
}