import React, { useEffect, useState } from "react";
import api from "../api";

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const userId = 1; // TODO: Replace with decoded JWT userId

  async function load() {
    const res = await api.get(`/contact/user/${userId}`);
    setContacts(res.data);
  }

  useEffect(() => {
    load();
  }, []);

  async function addContact() {
    await api.post("/contact/add", { userId, email, phone });
    setEmail("");
    setPhone("");
    load();
  }

  async function deleteContact(id) {
    await api.delete(`/contact/${id}`);
    load();
  }

  return (
    <div className="container">
      <h2>Emergency Contacts</h2>

      <div>
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />

        <button onClick={addContact}>Add</button>
      </div>

      <ul>
        {contacts.map((c) => (
          <li key={c.id}>
            {c.email} {c.phone}
            <button onClick={() => deleteContact(c.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
