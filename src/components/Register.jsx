import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function register(e) {
    e.preventDefault();
    try {
      await api.post("/auth/register", { email, password });
      alert("Registered! Please login.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Registration Failed");
    }
  }

  return (
    <div className="container">
      <h2>Register</h2>

      <form onSubmit={register}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Register</button>
      </form>

      <p style={{cursor:"pointer", color:"blue"}} onClick={() => navigate("/login")}>Already Have Account?</p>
    </div>
  );
}
