
// src/pages/Contact.jsx
import React, { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function saveMessage() {
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setNotice("Please fill name, email and message.");
      return;
    }
    setNotice("");
    setBusy(true);

    // save to localStorage (demo)
    setTimeout(() => {
      const existing = JSON.parse(localStorage.getItem("farming_messages") || "[]");
      existing.unshift({
        id: Date.now(),
        ...form,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem("farming_messages", JSON.stringify(existing));
      setBusy(false);
      setNotice("Message sent — we'll reply at mohitpatelpip06@gmail.com (demo).");
      setForm({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setNotice(""), 4000);
    }, 700);
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Contact</h1>
        <p style={styles.sub}>Have questions? Fill the form or email us at <strong>mohitpatelpip06@gmail.com</strong></p>
      </div>

      <div style={styles.grid}>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Get in touch</h3>
          <div style={styles.form}>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" style={styles.input} />
            <input name="email" value={form.email} onChange={handleChange} placeholder="Your email" style={styles.input} />
            <input name="subject" value={form.subject} onChange={handleChange} placeholder="Subject (optional)" style={styles.input} />
            <textarea name="message" value={form.message} onChange={handleChange} placeholder="Your message" style={{ ...styles.input, minHeight: 120 }} />
            {notice && <div style={styles.notice}>{notice}</div>}
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={saveMessage} disabled={busy} style={styles.sendBtn}>
                {busy ? "Sending..." : "Send message"}
              </button>
              <a href="mailto:mohitpatelpip06@gmail.com" style={styles.mailBtn}>Email us</a>
            </div>
          </div>
        </div>

        <div style={styles.infoCard}>
          <h3 style={styles.cardTitle}>Our office</h3>
          <p style={styles.infoText}>Farming Rental — Rent the right farming equipment</p>

          <div style={styles.contactRow}>
            <div style={styles.contactLabel}>Email</div>
            <div>mohitpatelpip06@gmail.com</div>
          </div>

          <div style={styles.contactRow}>
            <div style={styles.contactLabel}>Phone</div>
            <div>+91 9302687986</div>
          </div>

          <div style={{ marginTop: 12, color: "#555" }}>
            <strong>Support hours:</strong> Mon–Sat, 09:00 — 18:00
          </div>

          <div style={{ marginTop: 20 }}>
            <h4 style={{ margin: 0 }}>Quick links</h4>
            <ul style={{ marginTop: 8, paddingLeft: 18, color: "#444" }}>
              <li>Profile & bookings</li>
              <li>Tools management</li>
              <li>Payment & refunds</li>
            </ul>
          </div>
        </div>
      </div>

      <div style={styles.bottomNote}>
        <small>Note — this is a demo contact form that stores messages locally (no backend).</small>
      </div>
    </div>
  );
}

/* styles */
const styles = {
  page: { padding: "32px 48px", minHeight: "80vh", background: "#fafafa" },
  header: { marginBottom: 18 },
  title: { fontSize: 28, margin: 0 },
  sub: { color: "#555", marginTop: 6 },
  grid: { display: "grid", gridTemplateColumns: "1fr 360px", gap: 20, marginTop: 18 },
  card: { background: "#fff", padding: 20, borderRadius: 10, boxShadow: "0 10px 30px rgba(2,6,23,0.06)" },
  cardTitle: { margin: 0, fontSize: 18, fontWeight: 700 },
  form: { marginTop: 14, display: "flex", flexDirection: "column", gap: 10 },
  input: { padding: "10px 12px", borderRadius: 8, border: "1px solid #e6e6e6", fontSize: 14, width: "100%", boxSizing: "border-box" },
  sendBtn: { background: "#1f7a3a", color: "#fff", border: "none", padding: "10px 14px", borderRadius: 8, cursor: "pointer", fontWeight: 700 },
  mailBtn: { padding: "10px 14px", borderRadius: 8, textDecoration: "none", border: "1px solid #e6e6e6", display: "inline-flex", alignItems: "center", color: "#1f7a3a" },
  notice: { color: "#065f46", padding: "8px 0" },

  infoCard: { background: "#fff", padding: 20, borderRadius: 10, boxShadow: "0 10px 30px rgba(2,6,23,0.04)" },
  infoText: { color: "#444" },
  contactRow: { display: "flex", gap: 10, marginTop: 12, color: "#333", alignItems: "center" },
  contactLabel: { width: 80, color: "#666", fontWeight: 700 },

  bottomNote: { maxWidth: 900, margin: "20px auto 0", color: "#777" },
};
