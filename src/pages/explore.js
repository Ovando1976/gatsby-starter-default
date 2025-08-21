import React from "react";
import { Link } from "gatsby"

/**
 * By exporting "Head", you can set the page <title> and any other SEO
 * tags for this page. Learn more:
 * https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => (
  <>
    <title>Explore – Your Amazing App</title>
    <meta name="description" content="Dive into the latest features, resources, and hidden gems of our platform." />
  </>
)

/**
 * Main Explore Page Component
 */
export default function ExplorePage() {
  return (
    <main style={styles.container}>
      {/* Hero / Header Section */}
      <section style={styles.heroSection}>
        <h1 style={styles.heroTitle}>Explore &amp; Discover</h1>
        <p style={styles.heroSubtitle}>
          Dive into our latest features, resources, and hidden gems. Unleash the full potential of our platform and
          uncover everything we have to offer.
        </p>
        <Link to="/signup" style={styles.ctaButton}>
          Get Started
        </Link>
      </section>

      {/* Features or Highlights Section */}
      <section style={styles.featuresSection}>
        <h2 style={styles.sectionTitle}>Why Explore?</h2>
        <div style={styles.featuresGrid}>
          <div style={styles.featureCard}>
            <h3>Hidden Features</h3>
            <p>
              We regularly add new tools and enhancements that might surprise you. Learn about advanced functionalities
              that can supercharge your workflow.
            </p>
          </div>

          <div style={styles.featureCard}>
            <h3>Guided Tutorials</h3>
            <p>
              Master the platform with step-by-step tutorials. Whether you’re a beginner or a pro, there's always
              something new to learn.
            </p>
          </div>

          <div style={styles.featureCard}>
            <h3>Community Insights</h3>
            <p>
              Engage with our active community. Share tips, read success stories, and get inspired by how others use our
              platform.
            </p>
          </div>
        </div>
      </section>

      {/* Optional: Show an image gallery or additional resources */}
      {/* 
      <section style={styles.imageGallery}>
        <h2 style={styles.sectionTitle}>Gallery of Possibilities</h2>
        <div style={styles.imageRow}>
          <img src="/images/explore1.jpg" alt="Explore Feature 1" style={styles.galleryImage} />
          <img src="/images/explore2.jpg" alt="Explore Feature 2" style={styles.galleryImage} />
          <img src="/images/explore3.jpg" alt="Explore Feature 3" style={styles.galleryImage} />
        </div>
      </section>
      */}

      {/* Call-to-Action Footer Section */}
      <section style={styles.footerSection}>
        <h2 style={{ ...styles.sectionTitle, marginBottom: "0.5rem" }}>
          Ready to Dive Deeper?
        </h2>
        <p style={{ marginBottom: "1rem" }}>
          Unlock advanced capabilities and join a community of innovative explorers. Start learning, collaborating,
          and creating now!
        </p>
        <Link to="/tutorials" style={styles.ctaSecondary}>
          View Tutorials
        </Link>
      </section>
    </main>
  )
}

/* Inline styling for quick setup – ideally, you'd use a CSS module or styled-components. */
const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    margin: "0 auto",
    padding: "1rem",
    maxWidth: "900px",
  },
  heroSection: {
    textAlign: "center",
    padding: "2rem 1rem",
    background: "#f9fafb",
    borderRadius: "8px",
    marginBottom: "2rem",
  },
  heroTitle: {
    fontSize: "2.5rem",
    marginBottom: "1rem",
    color: "#0f172a",
  },
  heroSubtitle: {
    fontSize: "1.2rem",
    maxWidth: "600px",
    margin: "0 auto 1.5rem",
    lineHeight: "1.5",
  },
  ctaButton: {
    display: "inline-block",
    padding: "0.75rem 1.5rem",
    backgroundColor: "#0d9488",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "4px",
    fontWeight: "bold",
  },
  featuresSection: {
    marginBottom: "2rem",
  },
  sectionTitle: {
    fontSize: "2rem",
    marginBottom: "1rem",
    color: "#0f172a",
    textAlign: "center",
  },
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "1rem",
  },
  featureCard: {
    background: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    padding: "1rem",
  },
  imageGallery: {
    marginBottom: "2rem",
  },
  imageRow: {
    display: "flex",
    gap: "1rem",
    justifyContent: "center",
  },
  galleryImage: {
    width: "200px",
    borderRadius: "4px",
  },
  footerSection: {
    textAlign: "center",
    padding: "2rem 1rem",
    background: "#fff",
    borderRadius: "8px",
    marginBottom: "2rem",
    border: "2px solid #0d9488",
  },
  ctaSecondary: {
    display: "inline-block",
    padding: "0.75rem 1.5rem",
    backgroundColor: "#3b82f6",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "4px",
    fontWeight: "bold",
  },
}