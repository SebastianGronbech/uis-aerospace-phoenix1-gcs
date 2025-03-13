import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../style.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    console.log("Sending data:", {
      username: username,
      passwordHash: password,
    });

    try {
      const response = await axios.post("http://localhost:5017/api/auth/login", {
        username: username,
        passwordHash: password,
      });

      console.log("Login successful:", response.data);
      localStorage.setItem("token", response.data.token);

      
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Login error:", err.response?.data);
      setError("Invalid username or password");
    }
  };

  return (
    <div className="login-wrapper">
      {/* ✅ Logo moved outside the login box */}
      <img src="/image.png" alt="App Logo" className="logo" />

    <div>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
    </div>
    
  );
};

export default Login;
