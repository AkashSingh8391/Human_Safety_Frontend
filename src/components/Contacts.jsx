import React, { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadUser() {
      try {
        const me = await api.get("/auth/me");
        setUserId(me.data.userId);
        await loadContacts(me.data.userId);
      } catch (err) {
        console.error("Auth Error:", err);
        alert("Failed to load user. Please login again.");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  async function loadContacts(uid) {
    try {
      const res = await api.get(`/contact/user/${uid}`);
      setContacts(res.data);
    } catch (err) {
      console.error("Contact Load Error:", err);
      alert("Error loading contacts.");
    }
  }

  async function addContact() {
    if (!userId) { alert("User not loaded yet!"); return; }
    if (!email && !phone) { alert("Email or phone required"); return; }
    try {
      await api.post("/contact/add", { userId, email, phone });
      setEmail("");
      setPhone("");
      loadContacts(userId);
    } catch (err) {
      console.error("Add Contact Error:", err);
      alert("Failed to add contact");
    }
  }

  async function deleteContact(id) {
    try {
      await api.delete(`/contact/${id}`);
      loadContacts(userId);
    } catch (err) {
      console.error("Delete Error:", err);
      alert("Failed to delete contact");
    }
  }

  if (loading) return <h3>Loading...</h3>;

  return (
    <div>
      <h2>Emergency Contacts</h2>

      <input placeholder="Email (optional)" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Phone (optional)" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <button onClick={addContact}>Add</button>

      <ul>
        {contacts.length === 0 && <p>No contacts added yet.</p>}
        {contacts.map((c) => (
          <li key={c.id}>
            {c.email || "No Email"} — {c.phone || "No Phone"}
            <button onClick={() => deleteContact(c.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
