import React, { useEffect, useState } from 'react';
import '../styles/user.module.css';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { getFirebaseAuth, getFirebaseFirestore, getFirebaseStorage } from "firebaseConfig";

const auth = getFirebaseAuth();
const db = getFirebaseFirestore();
const storage = getFirebaseStorage();

// Mock: Typically you’d fetch this from your own server or an API
const mockFriendsData = [
  { id: 1, name: 'Alice Anderson' },
  { id: 2, name: 'Bob Brown' },
  { id: 3, name: 'Charlie Chaplin' },
];

// Mock: Example structure of a post. In reality you’d fetch this from your server.
const mockInitialPosts = [
  {
    id: 1,
    content: 'Hello world! My first post on this platform!',
    likes: 2,
    comments: [{ id: 1, text: 'Nice post!' }, { id: 2, text: 'Welcome!' }],
  },
  {
    id: 2,
    content: 'Enjoying a sunny day at the beach!',
    likes: 5,
    comments: [
      { id: 1, text: 'Lucky you!' },
      { id: 2, text: 'Looks amazing!' },
    ],
  },
];

function User() {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userStatus, setUserStatus] = useState('');
  const [userPosts, setUserPosts] = useState([]);
  const [profilePicURL, setProfilePicURL] = useState('');
  const [uploading, setUploading] = useState(false);

  // Additional states for “Create Post” flow
  const [newPostContent, setNewPostContent] = useState('');

  // 1. Fetch mock user profile
  const fetchUserProfile = () => {
    fetch('/api/userProfile')
      .then((response) => {
        if (!response.ok)
          throw new Error(
            'Network response was not ok ' + response.statusText
          );
        return response.json();
      })
      .then((data) => {
        setProfile(data);
        setUserStatus(data.status || '');
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch profile.');
        setLoading(false);
      });
  };

  // 2. Fetch mock user posts
  const fetchUserPosts = async () => {
    try {
      // For now, we can just use mock data
      // In a real app, you’d do something like:
      // const response = await fetch('/api/userPosts');
      // const data = await response.json();
      setUserPosts(mockInitialPosts);
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };

  // 3. Run on mount
  useEffect(() => {
    fetchUserProfile();
    fetchUserPosts();
  }, []);

  // 4. Handle profile picture upload
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploading(true);
      const storageRef = ref(storage, 'profilePictures/' + file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          console.error('Upload failed:', error);
          setUploading(false);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            setProfilePicURL(downloadURL);
            setUploading(false);
          });
        }
      );
    }
  };

  // 5. Update status
  const updateStatus = () => {
    // In a real app, make a request to your server to update the user status
    console.log('Updating status to:', userStatus);
    setProfile({ ...profile, status: userStatus });
  };

  // 6. Create a new post
  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;

    // In a real scenario, you'd call an API endpoint:
    // const response = await fetch('/api/createPost', { ... });
    // const createdPost = await response.json();

    const newPost = {
      id: userPosts.length + 1,
      content: newPostContent,
      likes: 0,
      comments: [],
    };

    setUserPosts([newPost, ...userPosts]); // Insert post at the top
    setNewPostContent('');
  };

  // 7. Like a post
  const handleLikePost = (postId) => {
    const updatedPosts = userPosts.map((p) => {
      if (p.id === postId) {
        return { ...p, likes: p.likes + 1 };
      }
      return p;
    });
    setUserPosts(updatedPosts);
  };

  // 8. Add a comment
  const handleAddComment = (postId, commentText) => {
    if (!commentText.trim()) return;

    const updatedPosts = userPosts.map((p) => {
      if (p.id === postId) {
        const newComment = {
          id: p.comments.length + 1,
          text: commentText,
        };
        return { ...p, comments: [...p.comments, newComment] };
      }
      return p;
    });
    setUserPosts(updatedPosts);
  };

  // 9. Render
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Your Profile</h1>

      {/* Show loading or error states */}
      {loading && <p>Loading profile...</p>}
      {error && (
        <>
          <p className={styles.error}>{error}</p>
          <button onClick={fetchUserProfile} className={styles.retryButton}>
            Retry
          </button>
        </>
      )}

      {/* Profile info section */}
      {!loading && !error && (
        <div className={styles.profileCard}>
          <img
            src={profile.avatar || profilePicURL}
            alt={`${profile.name || 'User'}'s profile`}
            className={styles.profileImage}
          />
          <h2>{profile.name}</h2>
          <p>Email: {profile.email}</p>
          <p>Contact: {profile.contact}</p>
          {uploading && <p>Uploading new profile picture...</p>}
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>
      )}

      {/* Status update section */}
      <div className={styles.statusSection}>
        <h2>Your Status:</h2>
        <textarea
          value={userStatus}
          onChange={(e) => setUserStatus(e.target.value)}
          placeholder="Update your status..."
        />
        <button onClick={updateStatus}>Update Status</button>
      </div>

      {/* "Friends" list - purely mock data here */}
      <div className={styles.friendsSection}>
        <h2>Your Friends</h2>
        <div className={styles.friendsList}>
          {mockFriendsData.map((friend) => (
            <div key={friend.id} className={styles.friendItem}>
              {friend.name}
            </div>
          ))}
        </div>
      </div>

      {/* Create Post section */}
      <div className={styles.createPostSection}>
        <h2>Create a Post</h2>
        <textarea
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder="What's on your mind?"
        />
        <button onClick={handleCreatePost}>Post</button>
      </div>

      {/* Posts feed */}
      <div className={styles.postsSection}>
        <h2>Your Timeline</h2>
        {userPosts.map((post) => (
          <div key={post.id} className={styles.post}>
            <p>{post.content}</p>
            <div className={styles.postActions}>
              <span>{post.likes} likes</span>
              <button onClick={() => handleLikePost(post.id)}>Like</button>
            </div>

            {/* Comments */}
            <div className={styles.commentsSection}>
              <h3>Comments:</h3>
              {post.comments.map((comment) => (
                <div key={comment.id} className={styles.comment}>
                  {comment.text}
                </div>
              ))}
              {/* Simple inline comment form */}
              <CommentForm onAddComment={(text) => handleAddComment(post.id, text)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// A simple inline comment form
function CommentForm({ onAddComment }) {
  const [commentText, setCommentText] = useState('');

  const handleSubmit = () => {
    onAddComment(commentText);
    setCommentText('');
  };

  return (
    <div className={styles.commentForm}>
      <input
        type="text"
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Write a comment..."
      />
      <button onClick={handleSubmit}>Comment</button>
    </div>
  );
}

export default User;