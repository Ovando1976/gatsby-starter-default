// pages/posts/[id].jsx

import React from "react";
import Head from "next/head";
import { admin, db } from "../../firebaseAdmin"; // Import admin Firestore
import styles from "../../src/styles/post.module.css";
import Image from "next/image"; // For optimized images

function Post({ post }) {
  if (!post) {
    return <div className={styles.notFound}>Post not found.</div>;
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>{post.title} - USVIexplorer</title>
        <meta name="description" content={post.excerpt} />
      </Head>

      <article className={styles.post}>
        {post.imageUrl && (
          <Image
            src={post.imageUrl}
            alt={post.title}
            width={800}
            height={450}
            className={styles.postImage}
          />
        )}
        <h1 className={styles.postTitle}>{post.title}</h1>
        <p className={styles.postDate}>
          {post.date
            ? new Date(post.date.seconds * 1000).toLocaleDateString()
            : "No Date"}
        </p>
        <div className={styles.postContent}>{post.content}</div>
      </article>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.params;

  try {
    // Reference to the specific post using Admin SDK
    const postRef = db.collection("articles").doc(id);
    const doc = await postRef.get();

    if (!doc.exists) {
      return {
        props: {
          post: null,
        },
      };
    }

    // Increment the view count atomically
    await postRef.update({
      viewCount: admin.firestore.FieldValue.increment(1),
    });

    return {
      props: {
        post: { id: doc.id, ...doc.data() },
      },
    };
  } catch (error) {
    console.error("Error fetching post:", error);
    return {
      props: {
        post: null,
      },
    };
  }
}

export default Post;