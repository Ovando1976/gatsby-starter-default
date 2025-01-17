// components/userDocuments.js

import React, { useState, useEffect } from 'react';

function UserDocuments() {
  const [documents, setDocuments] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // On mount, fetch the existing documents
  useEffect(() => {
    async function fetchDocs() {
      try {
        const response = await fetch('/api/documents');
        if (!response.ok) throw new Error('Failed to load documents');
        const data = await response.json();
        setDocuments(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchDocs();
  }, []);

  // For demonstration, we show a simple "Create Document" form
  async function createDocument() {
    if (!title) {
      alert('Title is required');
      return;
    }
    try {
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });
      if (!response.ok) throw new Error('Error creating document');

      const newDoc = await response.json();
      // Update our local state
      setDocuments((prev) => [...prev, newDoc]);
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error(error);
    }
  }

  // Example "Delete" operation
  async function deleteDoc(id) {
    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok && response.status !== 204) {
        throw new Error('Error deleting document');
      }
      // Update local state after successful deletion
      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <h2>User Documents</h2>

      {/* Create a new document */}
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ marginRight: '0.5rem' }}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ marginRight: '0.5rem' }}
        />
        <button onClick={createDocument}>Add Document</button>
      </div>

      {/* List existing documents */}
      {documents.length === 0 ? (
        <p>No documents yet.</p>
      ) : (
        <ul>
          {documents.map((doc) => (
            <li key={doc.id}>
              <strong>{doc.title}</strong>: {doc.description}{' '}
              <button onClick={() => deleteDoc(doc.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserDocuments;