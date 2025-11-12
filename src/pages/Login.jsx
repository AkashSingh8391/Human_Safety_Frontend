import React, { useState } from "react";
import api, { setAuthToken } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CIVIL"); // CIVIL or POLICE
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", { username, password });
      const token = res.data.token;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      setAuthToken(token);
      if (role === "CIVIL") navigate("/civil");
      else navigate("/police");
    } catch (err) {
      alert("Login failed");
    }
  };

  const handleRegister = async () => {
    try {
      await api.post("/auth/register", { username, password, role });
      alert("Registered. Now login.");
    } catch (err) {
      alert("Register failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Human Safety - Login / Register</h2>
      <div>
        <input placeholder="username" value={username} onChange={e=>setUsername(e.target.value)} />
      </div>
      <div>
        <input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      </div>
      <div>
        <select value={role} onChange={e=>setRole(e.target.value)}>
          <option value="CIVIL">Civil</option>
          <option value="POLICE">Police</option>
        </select>
      </div>
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}
