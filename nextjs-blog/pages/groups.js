
import React, { useState, useEffect } from 'react';
import styles from './styles/groups.module.css';

function Groups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGroups = () => {
    setLoading(true);
    setError(null);

    fetch('/api/groups')
      .then(response => {
        if (!response.ok) throw new Error(response.statusText);
        return response.json();
      })
      .then(data => {
        setGroups(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch groups: ' + err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Discover Groups</h1>

      {loading && <p>Loading groups...</p>}
      
      {error && (
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={fetchGroups}>Retry</button>
        </div>
      )}

      <div className={styles.groupsList}>
        {groups.length === 0 && !loading && <p>No groups available. Create one now!</p>}
        {groups.map(group => (
          <div key={group.id} className={styles.groupCard}>
            <img 
              src={group.image || '/fallback-image.png'} 
              alt={group.name} 
              className={styles.groupImage} 
            />
            <h2>{group.name}</h2>
            <p>Members: {group.memberCount}</p>
            <p>{group.description}</p>
            <button className={styles.joinButton}>Join Group</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Groups;
