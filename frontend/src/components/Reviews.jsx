// src/components/Reviews.jsx
import React, { useEffect, useState } from "react";

/**
 * Simple reviews component:
 * - reads/writes `farming_reviews` in localStorage
 * - seeds demo reviews if none exist
 * - shows list of reviews with stars, author, date and text
 */

export default function Reviews({ limit = 5 }) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    loadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function seedDemo() {
    const demo = [
      {
        id: Date.now() - 2000,
        name: "Ramesh",
        rating: 5,
        text: "Perfect tractor — highly recommended! Fast pickup & friendly owner.",
        date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      },
      {
        id: Date.now() - 1000,
        name: "Sita",
        rating: 4,
        text: "Good service & on-time. Price reasonable.",
        date: new Date().toISOString(),
      },
    ];
    localStorage.setItem("farming_reviews", JSON.stringify(demo));
    return demo;
  }

  function loadReviews() {
    try {
      const raw = localStorage.getItem("farming_reviews");
      let list = raw ? JSON.parse(raw) : null;
      if (!list || !Array.isArray(list) || list.length === 0) {
        list = seedDemo();
      }
      // sort newest first
      list = list.sort((a, b) => (a.date > b.date ? -1 : 1));
      setReviews(list.slice(0, limit));
    } catch (e) {
      console.error("Failed to load reviews:", e);
      const demo = seedDemo();
      setReviews(demo.slice(0, limit));
    }
  }

  if (!reviews || reviews.length === 0) return null;

  return (
    <section style={styles.wrap}>
      <h3 style={styles.title}>What customers say</h3>
      <div style={styles.grid}>
        {reviews.map((r) => (
          <article key={r.id} style={styles.card}>
            <div style={styles.cardTop}>
              <div style={styles.name}>{r.name}</div>
              <div style={styles.stars}>{renderStars(r.rating)}</div>
            </div>

            <div style={styles.date}>{new Date(r.date).toLocaleDateString()}</div>

            <p style={styles.text}>{r.text}</p>
          </article>
        ))}
      </div>
      <div style={styles.note}>⭐ Average rating from customers</div>
    </section>
  );
}

/* small helper */
function renderStars(n) {
  n = Math.max(0, Math.min(5, Number(n) || 0));
  const full = "★".repeat(n);
  const empty = "☆".repeat(5 - n);
  return <span style={{ letterSpacing: 1 }}>{full}{empty}</span>;
}

/* styles */
const styles = {
  wrap: {
    marginTop: 36,
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 12,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 12,
    alignItems: "start",
  },
  card: {
    background: "#fff",
    borderRadius: 10,
    padding: 14,
    boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
    border: "1px solid #f0f0f0",
    minHeight: 120,
  },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  name: { fontWeight: 700 },
  stars: { color: "#F59E0B", fontSize: 16 },
  date: { color: "#777", fontSize: 12, marginTop: 6 },
  text: { marginTop: 10, color: "#333", lineHeight: 1.45 },
  note: { marginTop: 12, color: "#666", fontSize: 13 },
};
