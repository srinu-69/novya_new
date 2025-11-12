import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      const { access_token, username, user_id } = response.data;

      // Store JWT token and user info
      localStorage.setItem("token", access_token);
      localStorage.setItem("username", username);
      localStorage.setItem("user_id", user_id);
      localStorage.setItem("loggedIn", true);

      setIsLoggedIn(true);
      navigate("/studyroom"); // redirect to StudyRoom
    } catch (err) {
      if (err.response && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Something went wrong. Try again.");
      }
    }
  };

  return (
    <div style={{ padding: "50px" }}>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br /><br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />
      <button onClick={handleLogin}>Login</button>
      <p>
        Don't have an account?{" "}
        <span
          onClick={() => navigate("/signup")}
          style={{ color: "blue", cursor: "pointer" }}
        >
          Sign Up
        </span>
      </p>
    </div>
  );
};

export default Login;
