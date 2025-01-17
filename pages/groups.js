import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import styles from "../src/styles/groups.module.css";

// Import dynamic components for video chat (client-side only)
const VideoChat = dynamic(() => import("../src/components/VideoChat"), { ssr: false });

function Groups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeGroup, setActiveGroup] = useState(null); // Group currently in focus
  const [isVideoChatOpen, setVideoChatOpen] = useState(false);
  const [groupPosts, setGroupPosts] = useState([]);
  const [newPost, setNewPost] = useState("");

  useEffect(() => {
    // Simulated API call to fetch groups
    setTimeout(() => {
      setGroups([
        {
          id: 1,
          name: "Fitness Enthusiasts",
          description: "A group for people passionate about fitness and health.",
          memberCount: 120,
          image: "/fitness-group.jpg",
        },
        {
          id: 2,
          name: "Travel Lovers",
          description: "Explore the best travel destinations with us!",
          memberCount: 85,
          image: "/travel-group.jpg",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleOpenGroupFeed = (group) => {
    setActiveGroup(group);
    // Simulate fetching group posts
    setGroupPosts([
      {
        id: 1,
        content: "Had an amazing workout session today!",
        reactions: { like: 5 },
        comments: [
          { id: 1, text: "That's awesome!" },
          { id: 2, text: "Keep it up!" },
        ],
      },
      {
        id: 2,
        content: "Looking for travel buddies for Bali next month.",
        reactions: { like: 10 },
        comments: [{ id: 3, text: "Count me in!" }],
      },
    ]);
  };

  const handleAddPost = () => {
    if (newPost.trim()) {
      const post = {
        id: Date.now(),
        content: newPost,
        reactions: { like: 0 },
        comments: [],
      };
      setGroupPosts((prev) => [post, ...prev]);
      setNewPost("");
    }
  };

  return (
    <div className={styles.container}>
      {/* Navigation Bar */}
      <header className={styles.navbar}>
        <h1 className={styles.logo}>MyApp Groups</h1>
        <input
          type="text"
          placeholder="Search Groups..."
          className={styles.searchBar}
        />
      </header>

      <div className={styles.layout}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <h2>Groups</h2>
          <ul>
            {groups.map((group) => (
              <li
                key={group.id}
                className={styles.sidebarItem}
                onClick={() => handleOpenGroupFeed(group)}
              >
                {group.name}
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content */}
        <main className={styles.mainContent}>
          {loading && <p>Loading groups...</p>}

          {!loading && activeGroup && (
            <div>
              <h2>{activeGroup.name}</h2>
              <p>{activeGroup.description}</p>

              {/* Post Input */}
              <div className={styles.postInput}>
                <textarea
                  placeholder="What's on your mind?"
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className={styles.textarea}
                ></textarea>
                <button onClick={handleAddPost} className={styles.createButton}>
                  Post
                </button>
              </div>

              {/* Posts */}
              <div className={styles.postsList}>
                {groupPosts.map((post) => (
                  <div key={post.id} className={styles.postCard}>
                    <p>{post.content}</p>
                    <div className={styles.postActions}>
                      <button className={styles.likeButton}>
                        👍 {post.reactions.like || 0}
                      </button>
                      <button className={styles.commentButton}>
                        💬 {post.comments.length} Comments
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Groups;