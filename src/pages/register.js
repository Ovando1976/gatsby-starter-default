import React, { useState } from "react";
import { navigate, Link } from "gatsby";
import { useDispatch, useSelector } from "react-redux";
import {
  setUserAction,
  setErrorAction,
  setLoadingAction,
  setSuccessAction,
} from "../../store/actions";
import { getFirebaseAuth, getFirebaseFirestore, getFirebaseStorage } from "firebaseConfig";

const auth = getFirebaseAuth();
const db = getFirebaseFirestore();
const storage = getFirebaseStorage(); 

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch();

  const error = useSelector((state) => state.error);
  const loading = useSelector((state) => state.loading);
  const success = useSelector((state) => state.success);

  // Password validation logic
  const isValidPassword = (pass) => {
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(pass);
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      dispatch(setErrorAction("Passwords do not match"));
      return;
    }

    if (!isValidPassword(password)) {
      dispatch(
        setErrorAction(
          "Password must be at least 8 characters long and include at least one letter and one number"
        )
      );
      return;
    }

    dispatch(setLoadingAction(true));
    try {
      // Firebase sign-up using auth from firebaseConfig
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      dispatch(setUserAction(userCredential.user));
      dispatch(setSuccessAction(true));
      navigate("/dashboard"); // Redirect to dashboard
    } catch (err) {
      dispatch(setErrorAction(err.message || "Registration failed."));
    } finally {
      dispatch(setLoadingAction(false));
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <label>
          Email:
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <label>
          Confirm Password:
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {success && (
        <>
          <p style={{ color: "green" }}>Registration successful!</p>
          <Link to="/dashboard">
            <button>Proceed to Dashboard</button>
          </Link>
        </>
      )}

      <Link to="/login">
        <button>Already have an account? Login here</button>
      </Link>
      <Link to="/">
        <button>Back to Home</button>
      </Link>
    </div>
  );
}