"use client"; // Only if you're using Next.js 13 App Router

import React, { useState } from "react";
import "./ProfilePage.module.css";

export default function ProfilePage() {
  const [previewSrc, setPreviewSrc] = useState(null); // For local image preview
  const [fileData, setFileData] = useState(null);     // For the raw File object

  // Fired when a user picks a file from <input type="file" />
  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Ensure it's an image
    if (!file.type.match(/image.*/)) {
      alert("Please select a valid image file.");
      return;
    }

    // Save the raw File object for uploading later
    setFileData(file);

    // Generate a local preview with FileReader
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewSrc(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Fired when the user clicks "Update Profile Picture"
  const handleSubmit = async () => {
    if (!fileData) {
      alert("No file selected!");
      return;
    }

    try {
      // Create a FormData object for your file
      const formData = new FormData();
      formData.append("file", fileData);

      // Example: uploading to a Next.js API route
      const response = await fetch("/api/uploadProfileImage", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      alert("Profile picture updated!");
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Update Profile Picture</h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className={styles.fileInput}
      />

      {previewSrc && (
        <img
          src={previewSrc}
          alt="Profile Preview"
          className={styles.profileImage}
        />
      )}

      <button onClick={handleSubmit} className={styles.updateButton}>
        Update Profile Picture
      </button>
    </div>
  );
}