import React, { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import axios from "axios"; // Use axios for API calls

import { useAuth } from "../../../contexts/AuthProvider";
import styles from "../../styles/blog.module.css";

// Dynamically import ReactQuill so SSR doesn't break
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

function CreatePost({ defaultCategory = "Technology" }) {
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState(defaultCategory);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  // Refs for focusing on error
  const titleRef = useRef(null);
  const excerptRef = useRef(null);

  const resetForm = () => {
    setTitle("");
    setExcerpt("");
    setContent("");
    setCategory(defaultCategory);
    setImage(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user) {
      setError("You must be signed in to create a post.");
      return;
    }

    if (!title.trim() || !excerpt.trim() || !content.trim()) {
      setError("Please fill out all text fields.");
      if (!title.trim()) titleRef.current && titleRef.current.focus();
      else if (!excerpt.trim()) excerptRef.current && excerptRef.current.focus();
      return;
    }

    if (title.length > 100) {
      setError("Title should not exceed 100 characters.");
      titleRef.current && titleRef.current.focus();
      return;
    }

    if (excerpt.length > 300) {
      setError("Excerpt should not exceed 300 characters.");
      excerptRef.current && excerptRef.current.focus();
      return;
    }

    setUploading(true);
    setError("");

    try {
      let imageUrl = null;

      // Upload the image to the backend if provided
      if (image) {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", "blogImages");

        const imageRes = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/uploadImage`,
          formData
        );

        imageUrl = imageRes.data.url;
      }

      // Send post data to the backend
      const postRes = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/createPost`,
        {
          title: title.trim(),
          excerpt: excerpt.trim(),
          content,
          category,
          imageUrl,
          authorId: user.uid,
        }
      );

      if (postRes.status === 201) {
        toast.success("Blog post added successfully!");
        resetForm();
      }
    } catch (err) {
      console.error("Error uploading blog post:", err);
      setError("Failed to upload blog post. Please try again.");
      toast.error("Failed to upload blog post. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // Quill modules
  const quillModules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["bold", "italic", "underline"],
      ["link", "image"],
      [{ align: [] }],
    ],
  };

  // Quill formats
  const quillFormats = [
    "header",
    "font",
    "list",
    "bullet",
    "bold",
    "italic",
    "underline",
    "link",
    "image",
    "align",
  ];

  return (
    <section className={styles.uploadForm}>
      <h2>Create a New Post</h2>
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* TITLE */}
        <div className={styles.formGroup}>
          <label htmlFor="title">Title:</label>
          <input
            ref={titleRef}
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            placeholder="Enter a catchy title"
            required
          />
        </div>

        {/* EXCERPT */}
        <div className={styles.formGroup}>
          <label htmlFor="excerpt">Excerpt:</label>
          <textarea
            ref={excerptRef}
            id="excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            maxLength={300}
            placeholder="Write a short summary of the post"
            required
          />
        </div>

        {/* CONTENT (Rich Text Editor) */}
        <div className={styles.formGroup}>
          <label htmlFor="content">Content:</label>
          <ReactQuill
            value={content}
            onChange={setContent}
            modules={quillModules}
            formats={quillFormats}
            theme="snow"
          />
        </div>

        {/* CATEGORY */}
        <div className={styles.formGroup}>
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Technology">Technology</option>
            <option value="Travel">Travel</option>
            <option value="Health">Health</option>
            <option value="Lifestyle">Lifestyle</option>
            <option value="Food">Food</option>
            <option value="General">General</option>
          </select>
        </div>

        {/* IMAGE */}
        <div className={styles.formGroup}>
          <label htmlFor="image">Image:</label>
          <input
            type="file"
            id="image"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            accept="image/*"
          />
        </div>

        <button type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Publish Post"}
        </button>
      </form>
    </section>
  );
}

export default CreatePost;