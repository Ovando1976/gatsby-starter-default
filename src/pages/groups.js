// src/pages/groups.js

import React, { useState, useEffect } from "react";
import "../styles/groups.module.css"; // Correctly import the CSS module
import VideoChat from "../components/VideoChat";

export default function Groups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeGroup, setActiveGroup] = useState(null);
  const [groupPosts, setGroupPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [isVideoChatOpen, setVideoChatOpen] = useState(false);

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

  const handleToggleVideoChat = () => {
    setVideoChatOpen((prev) => !prev);
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
          {loading ? (
            <p>Loading groups...</p>
          ) : (
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
          )}
        </aside>

        {/* Main Content */}
        <main className={styles.mainContent}>
          {activeGroup && (
            <>
              <h2>{activeGroup.name}</h2>
              <p>{activeGroup.description}</p>

              {/* Toggle Video Chat */}
              <button
                className={styles.videoChatButton}
                onClick={handleToggleVideoChat}
              >
                {isVideoChatOpen ? "Close Video Chat" : "Open Video Chat"}
              </button>

              {/* Video Chat Section */}
              {isVideoChatOpen && <VideoChat groupId={activeGroup.id} />}

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
            </>
          )}
        </main>
      </div>
    </div>
  );
}