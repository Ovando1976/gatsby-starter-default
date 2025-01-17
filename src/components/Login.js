import { useState } from "react";
import { useAuth } from "../../contexts/AuthProvider";
import { useRouter } from "next/router"; // For navigation after login
import styles from "../styles/auth.module.css";

const Login = () => {
  const { login } = useAuth(); // Get the login function from AuthProvider
  const router = useRouter(); // Use Next.js router for redirection

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loading state for login

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password); // Perform login
      router.push("/dashboard"); // Redirect after successful login
    } catch (err) {
      console.error("Login Error:", err);
      // Handle Firebase error codes
      if (err.code === "auth/user-not-found") {
        setError("No user found with this email.");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email format.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className={styles.authContainer}>
      <h2>Log In</h2>
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleLogin} className={styles.authForm}>
        <div className={styles.formGroup}>
          <label htmlFor="login-email">Email:</label>
          <input
            type="email"
            id="login-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
            aria-label="Email"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="login-password">Password:</label>
          <input
            type="password"
            id="login-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
            aria-label="Password"
          />
        </div>
        <button
          type="submit"
          className={styles.authButton}
          disabled={loading} // Disable button while loading
          aria-busy={loading} // Accessibility attribute for loading state
        >
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>
    </div>
  );
};

export default Login;