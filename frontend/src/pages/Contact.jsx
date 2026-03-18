import React, { useState } from "react";

const contactDetails = [
  {
    icon: "☎",
    label: "Phone",
    value: "+91 9302687986",
    helper: "Call for urgent rental and booking help.",
  },
  {
    icon: "✉",
    label: "Email",
    value: "mohitpatelpip06@gmail.com",
    helper: "We usually respond within one business day.",
  },
  {
    icon: "📍",
    label: "Address",
    value: "Farming Rental Support Center, Madhya Pradesh, India",
    helper: "Serving farmers with trusted equipment support.",
  },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function saveMessage(e) {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setNotice("Please fill in your name, email, and message.");
      return;
    }

    setNotice("");
    setBusy(true);

    setTimeout(() => {
      const existing = JSON.parse(localStorage.getItem("farming_messages") || "[]");
      existing.unshift({
        id: Date.now(),
        ...form,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem("farming_messages", JSON.stringify(existing));
      setBusy(false);
      setNotice("Thank you! Your message has been sent successfully. We'll contact you soon. (Demo UI)");
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setNotice(""), 4000);
    }, 700);
  }

  return (
    <section className="page-shell page-shell--soft">
      <div className="page-header page-header--centered">
        <span className="page-badge">📞 Contact Us</span>
        <h1>Let&apos;s grow better farming together</h1>
        <p>
          Have questions about tool rentals, availability, or support? Send us a message and our team will help you quickly.
        </p>
      </div>

      <div className="contact-layout">
        <form className="contact-card contact-card--form" onSubmit={saveMessage}>
          <div>
            <p className="section-kicker">Send us a message</p>
            <h2 className="section-title">We&apos;re here to help</h2>
          </div>

          <label className="field-group">
            <span>Name</span>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your full name"
              className="field-input"
            />
          </label>

          <label className="field-group">
            <span>Email</span>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="field-input"
            />
          </label>

          <label className="field-group">
            <span>Message</span>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Tell us how we can help you"
              className="field-input field-input--textarea"
            />
          </label>

          {notice && <div className="contact-notice">{notice}</div>}

          <button type="submit" disabled={busy} className="primary-button primary-button--full">
            {busy ? "Sending..." : "Submit Message"}
          </button>
        </form>

        <aside className="contact-card contact-card--info">
          <div>
            <p className="section-kicker">Support Details</p>
            <h2 className="section-title">Reach our team directly</h2>
            <p className="section-copy">
              Prefer a direct contact option? Use the details below for quick communication with the Farming Rental team.
            </p>
          </div>

          <div className="contact-info-list">
            {contactDetails.map((item) => (
              <div key={item.label} className="contact-info-item">
                <div className="contact-info-item__icon" aria-hidden="true">{item.icon}</div>
                <div>
                  <p className="contact-info-item__label">{item.label}</p>
                  <p className="contact-info-item__value">{item.value}</p>
                  <p className="contact-info-item__helper">{item.helper}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="contact-hours">
            <p className="contact-hours__title">Support Hours</p>
            <p>Monday - Saturday</p>
            <strong>09:00 AM - 06:00 PM</strong>
          </div>
        </aside>
      </div>
    </section>
  );
}
