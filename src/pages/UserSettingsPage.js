// components/UserSettings.js

import React, { useState } from 'react'

export default function UserSettings() {
  // State for each “setting” field:
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [statusMessage, setStatusMessage] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  // Example: handle Save by POSTing to /api/saveUserSettings
  async function handleSaveSettings() {
    setIsSaving(true)
    setStatusMessage(null)

    try {
      const response = await fetch('/api/saveUserSettings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          darkMode,
          notifications,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save settings.')
      }

      const data = await response.json()
      setStatusMessage(data.message || 'Settings saved!')
    } catch (error) {
      console.error(error)
      setStatusMessage('Error saving settings.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>User Settings</h2>

      {/* Name */}
      <div style={styles.field}>
        <label style={styles.label}>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
        />
      </div>

      {/* Email */}
      <div style={styles.field}>
        <label style={styles.label}>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
      </div>

      {/* Password */}
      <div style={styles.field}>
        <label style={styles.label}>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
      </div>

      {/* Dark Mode Toggle */}
      <div style={styles.field}>
        <label style={styles.label}>Dark Mode:</label>
        <input
          type="checkbox"
          checked={darkMode}
          onChange={(e) => setDarkMode(e.target.checked)}
          style={{ marginLeft: '0.5rem' }}
        />
      </div>

      {/* Notifications Toggle */}
      <div style={styles.field}>
        <label style={styles.label}>Enable Notifications:</label>
        <input
          type="checkbox"
          checked={notifications}
          onChange={(e) => setNotifications(e.target.checked)}
          style={{ marginLeft: '0.5rem' }}
        />
      </div>

      {/* Save Button */}
      <button onClick={handleSaveSettings} style={styles.button} disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Save Settings'}
      </button>

      {/* Status Message */}
      {statusMessage && <p style={{ marginTop: '1rem' }}>{statusMessage}</p>}
    </div>
  )
}

// Inline style objects (optional) - you can replace with your own CSS or module
const styles = {
  container: {
    maxWidth: '400px',
    margin: '1rem auto',
    padding: '1rem',
    border: '1px solid #ccc',
    borderRadius: '8px',
  },
  title: {
    marginBottom: '1rem',
    textAlign: 'center',
  },
  field: {
    marginBottom: '1rem',
  },
  label: {
    display: 'inline-block',
    width: '140px',
    fontWeight: 'bold',
  },
  input: {
    padding: '0.4rem',
    width: '200px',
  },
  button: {
    display: 'block',
    marginTop: '1rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#4caf50',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
}