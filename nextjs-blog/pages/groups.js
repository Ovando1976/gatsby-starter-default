
import React,{useState, useEffect} from 'react';
import styles from './styles/groups.module.css';


function Groups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch groups
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
  }, []);

  return (
    <div className={styles.container}>
      {/* React Helmet for title and meta tags */}
      <h1 className={styles.header}>Discover Groups</h1>
      {/* Assume you have a "/create-group" route for creating new groups */}

      {loading && <p>Loading groups...</p>}
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.groupsList}>
       {groups.length === 0 && !loading && <p>No groups available. Create one now!</p>}
        {groups.map(group => (
          <div key={group.id} className={styles.groupCard}>
            <img src={group.image} alt={group.name} className={styles.groupImage} />
            <h2>{group.name}</h2>
            <p>Members: {group.memberCount}</p>
            <p>{group.description}</p>
            {/* Example: Join group functionality, wrap button with NavLink if needed */}
            <button className={styles.joinButton}>Join Group</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Groups;