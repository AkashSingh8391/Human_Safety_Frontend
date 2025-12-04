import React, { useEffect, useState } from "react";
import api from "../api";

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    api.get("/auth/me").then((res) => {
      setUserId(res.data.userId);
      loadContacts(res.data.userId);
    });
  }, []);

  async function loadContacts(uid) {
    const res = await api.get(`/contact/user/${uid}`);
    setContacts(res.data);
  }

  async function addContact() {
    await api.post("/contact/add", { userId, email, phone });
    loadContacts(userId);
  }

  async function deleteContact(id) {
    await api.delete(`/contact/${id}`);
    loadContacts(userId);
  }

  return (
    <div>
      <h2>Emergency Contacts</h2>

      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Phone" onChange={(e) => setPhone(e.target.value)} />
      <button onClick={addContact}>Add</button>

      <ul>
        {contacts.map((c) => (
          <li key={c.id}>
            {c.email} - {c.phone}
            <button onClick={() => deleteContact(c.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
