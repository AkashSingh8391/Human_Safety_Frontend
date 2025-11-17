import React, { useState } from "react";
import api, { setAuthToken } from "../services/api";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css"; // <-- IMPORTANT

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CIVIL");
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  // Login handler
const handleLogin = async () => {
  try {
    const res = await api.post("/auth/login", {
      username,
      password,
      role   // CIVIL / POLICE
    });

    const token = res.data.token;

    // Save token & role
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);

    // Apply token globally to axios
    setAuthToken(token);

    // Redirect based on role
    if (role === "POLICE") navigate("/police");
    else navigate("/civil");

  } catch (err) {
    alert(err.response?.data || "Login failed");
  }
};

  return (
    <div className="login-bg">
      <div className="login-card">
        
        <h2 className="login-title">
          {isLogin ? "Login to Human Safety System" : "Create Your Account"}
        </h2>

        <div className="input-box">
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="input-box">
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Select Role */}
        <div className="role-box">
          <label>Select Role:</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="CIVIL">Civil 👩‍🦰</option>
            <option value="POLICE">Police 👮‍♂️</option>
          </select>
        </div>

        <button className="btn-primary" onClick={handleAuth}>
          {isLogin ? "Login" : "Register"}
        </button>

        {/* Toggle login / register */}
        <p className="toggle-text">
          {isLogin ? (
            <>
              New user?
              <span onClick={() => setIsLogin(false)}> Register here</span>
            </>
          ) : (
            <>
              Already have an account?
              <span onClick={() => setIsLogin(true)}> Login now</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
