// components/HaikuGenerator.jsx
import React, { useState } from 'react';
import styles from '../styles/user.module.css'; // Adjust path as necessary
import { getAuth } from 'firebase/auth';

function HaikuGenerator() {
  const [haiku, setHaiku] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const auth = getAuth();

  const generateHaiku = async () => {
    setLoading(true);
    setError(null);
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User not authenticated");
      }

      const token = await user.getIdToken();

      const response = await fetch('http://localhost:8080/gpt4o', { // Ensure correct URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // If using authentication
        },
        body: JSON.stringify({
          prompt: "Write a haiku about AI",
          maxTokens: 50
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate haiku');
      }

      const data = await response.json();
      setHaiku(data.response);
    } catch (err) {
      console.error("Error generating haiku:", err);
      setError('Failed to generate haiku.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.haikuGenerator}>
      <button onClick={generateHaiku} disabled={loading} className={styles.generateBtn}>
        {loading ? 'Generating...' : 'Generate Haiku'}
      </button>
      {haiku && <p className={styles.haiku}>{haiku}</p>}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}

export default HaikuGenerator;