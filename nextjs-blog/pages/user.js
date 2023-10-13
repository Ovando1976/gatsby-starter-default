import React, { useEffect, useState } from 'react';
import styles from './styles/user.module.css';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from './api/Firebase/firebaseConfig'; // You need to import the storage object

function User() {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userStatus, setUserStatus] = useState(profile.status || '');
  const [userPosts, setUserPosts] = useState([]);
  const [profilePicURL, setProfilePicURL] = useState("");

  const fetchUserProfile = () => {
    fetch('/api/userProfile')
      .then(response => response.json())
      .then(data => {
        setProfile(data);
        setUserStatus(data.status || '');
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch profile.');
        setLoading(false);
      });
  };

  const fetchUserPosts = async () => {
    try {
      const response = await fetch('/api/userPosts');
      const data = await response.json();
      setUserPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchUserPosts();
  }, []);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
        const storageRef = ref(storage, 'profilePictures/' + file.name);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed', 
          (snapshot) => {
            // Progress function ...
          }, 
          (error) => {
            // Handle errors here
          }, 
          () => {
            // Handle successful uploads
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              console.log('File available at', downloadURL);
              setProfilePicURL(downloadURL);
            });
          }
        );
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Your Profile</h1>

      {loading && <p>Loading profile...</p>}
      {error && (
        <>
          <p className={styles.error}>{error}</p>
          <button onClick={fetchUserProfile} className={styles.retryButton}>Retry</button>
        </>
      )}

      {!loading && !error && (
        <div className={styles.profileCard}>
          <img src={profile.avatar || profilePicURL} alt="User profile" className={styles.profileImage} />
          <h2>{profile.name}</h2>
          <p>Email: {profile.email}</p>
          <p>Contact: {profile.contact}</p>
        </div>
      )}

      <div className={styles.statusSection}>
        <h2>Your Status:</h2>
        <textarea 
          value={userStatus} 
          onChange={(e) => setUserStatus(e.target.value)} 
          placeholder="Update your status..."
        />
        <button onClick={() => { /* Update status in backend */ }}>Update Status</button>
      </div>

      <div className={styles.postsSection}>
        <h2>Your Posts:</h2>
        {userPosts.map(post => (
          <div key={post.id} className={styles.post}>
            <p>{post.content}</p>
            <div className={styles.comments}>
              <h3>Comments:</h3>
              {post.comments.map(comment => (
                <div key={comment.id} className={styles.comment}>
                  {comment.text}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div>
        <input type="file" onChange={handleFileChange} />
      </div>
    </div>
  );
}

export default User;
