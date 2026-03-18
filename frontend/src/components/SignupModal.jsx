import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function SignupModal({ open, onClose }) {
  const { signup } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null);

  if (!open) return null;

  const submit = (e) => {
    e.preventDefault();
    setError(null);
    try {
      signup(form);
      onClose();
      setForm({ name: "", email: "", password: "" });
    } catch (err) {
      setError(err.message || "Failed to create account");
    }
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        <h3 style={{ margin: 0 }}>Create an account</h3>
        <p style={{ marginTop: 6, marginBottom: 12, color: "#666" }}>Join to list tools or rent equipment.</p>

        <form onSubmit={submit} style={{ display: "grid", gap: 10 }}>
          <input required placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input required type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          {error && <div style={{ color: "red" }}>{error}</div>}
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button type="submit" style={{ flex: 1, background: "#1f7a3a", color: "#fff", padding: "10px", border: "none", borderRadius: 6 }}>Create account</button>
            <button type="button" onClick={onClose} style={{ padding: "10px", borderRadius: 6 }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const overlay = {
  position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60
};
const modal = { width: 380, background: "#fff", padding: 18, borderRadius: 8, boxShadow: "0 6px 24px rgba(0,0,0,0.12)" };
