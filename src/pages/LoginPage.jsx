import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { setAuthToken } from "../services/api";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(""); // CIVIL or POLICE

  const navigate = useNavigate();

  // ------------------------------
  //  LOGIN FUNCTION
  // ------------------------------
  const login = async () => {
    if (!role) {
      alert("Please select role: CIVIL or POLICE");
      return;
    }

    try {
      const res = await api.post("/auth/login", {
        username,
        password,
      });

      const token = res.data.token;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      setAuthToken(token);

      // Navigate based on role  
      if (role === "POLICE") navigate("/police");
      else navigate("/civil");

    } catch (err) {
      alert(err.response?.data || "Login failed");
    }
  };

  // ------------------------------
  //  REGISTER FUNCTION
  // ------------------------------
  const register = async () => {
    if (!role) {
      alert("Select a role before Register!");
      return;
    }

    try {
      await api.post("/auth/register", {
        username,
        password,
        role,
      });

      alert("Registered successfully! Now login.");

    } catch (err) {
      alert(err.response?.data || "Register failed");
    }
  };

  return (
    <div style={{ padding: 20, width: "400px" }}>
      <h2>Login / Register</h2>

      <input
        type="text"
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 10 }}
      />

      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 10 }}
      />

      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 10 }}
      >
        <option value="">Select Role</option>
        <option value="CIVIL">Civil</option>
        <option value="POLICE">Police</option>
      </select>

      <button
        onClick={login}
        style={{
          padding: "10px 20px",
          marginRight: 10,
          background: "lightgreen",
        }}
      >
        Login
      </button>

      <button
        onClick={register}
        style={{
          padding: "10px 20px",
          background: "lightblue",
        }}
      >
        Register
      </button>
    </div>
  );
};

export default LoginPage;
