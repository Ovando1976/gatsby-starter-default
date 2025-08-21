// userDocuments.js

import React from 'react';

function UserDocuments() {
  // Example: If you wanted to fetch user documents, you could do so here (or via props).
  // For now, we’ll just return a placeholder list.

  const documents = [
    { id: 1, title: 'Document 1', description: 'Description for Document 1' },
    { id: 2, title: 'Document 2', description: 'Description for Document 2' },
    { id: 3, title: 'Document 3', description: 'Description for Document 3' },
  ];

  return (
    <div>
      <h2>User Documents</h2>
      <ul>
        {documents.map((doc) => (
          <li key={doc.id}>
            <strong>{doc.title}</strong>: {doc.description}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserDocuments;