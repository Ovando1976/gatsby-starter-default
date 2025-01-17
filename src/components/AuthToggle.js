// components/AuthToggle.js

import { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
import styles from "../styles/authToggle.module.css";

const AuthToggle = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleAuthMode = () => {
    setIsLogin((prev) => !prev);
  };

  return (
    <div className={styles.authToggleContainer}>
      {isLogin ? <Login /> : <Signup />}
      <div className={styles.toggleText}>
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button onClick={toggleAuthMode} className={styles.toggleButton}>
          {isLogin ? "Sign Up" : "Log In"}
        </button>
      </div>
    </div>
  );
};

export default AuthToggle;