// Import the necessary modules
import React from 'react';
import { getSortedPostsData } from './posts';  // Importing the function

// Define a functional component to display the sorted posts
const SortedPostsList = () => {
  // Call the function to get the sorted posts data
  const sortedPostsData = getSortedPostsData();

  // Render the sorted posts
  return (
    <div>
      <h1>Sorted Posts</h1>
      <ul>
        {sortedPostsData.map((post, index) => (
          <li key={index}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SortedPostsList;  // Export the component
