import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function LoginModal({ open, onClose }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);

  if (!open) return null;

  const submit = (e) => {
    e.preventDefault();
    setError(null);
    try {
      login(form);
      onClose();
      setForm({ email: "", password: "" });
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        <h3 style={{ margin: 0 }}>Login</h3>
        <p style={{ marginTop: 6, marginBottom: 12, color: "#666" }}>Use the email and password you signed up with.</p>

        <form onSubmit={submit} style={{ display: "grid", gap: 10 }}>
          <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input required type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          {error && <div style={{ color: "red" }}>{error}</div>}
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button type="submit" style={{ flex: 1, background: "#1f7a3a", color: "#fff", padding: "10px", border: "none", borderRadius: 6 }}>Login</button>
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
const modal = { width: 360, background: "#fff", padding: 18, borderRadius: 8, boxShadow: "0 6px 24px rgba(0,0,0,0.12)" };
