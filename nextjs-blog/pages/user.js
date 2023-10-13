import React, { useEffect, useState } from 'react';
import styles from './styles/user.module.css';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from './api/Firebase/firebaseConfig';

function User() {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userStatus, setUserStatus] = useState(profile.status || '');
  const [userPosts, setUserPosts] = useState([]);
  const [profilePicURL, setProfilePicURL] = useState("");
  const [uploading, setUploading] = useState(false);

  const fetchUserProfile = () => {
    fetch('/api/userProfile')
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok ' + response.statusText);
        return response.json();
      })
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
      if (!response.ok) throw new Error('Network response was not ok ' + response.statusText);
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
        setUploading(true);
        const storageRef = ref(storage, 'profilePictures/' + file.name);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed', 
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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

  const updateStatus = () => {
    // Make a request to your server to update the user status
    console.log('Updating status to:', userStatus);
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
          <img src={profile.avatar || profilePicURL} alt={`${profile.name}'s profile`} className={styles.profileImage} />
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
        <button onClick={updateStatus}>Update Status</button>
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
        {uploading && <p>Uploading...</p>}
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>
    </div>
  );
}

export default User;

