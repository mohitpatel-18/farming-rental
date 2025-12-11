// src/components/Hero.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Reviews from "../components/Reviews"; // ensure path is correct

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section style={container}>
      <div style={card}>
        <div style={left}>
          <h4 style={eyebrow}>TOP EQUIPMENT</h4>
          <h1 style={headline}>Rent Farming Equipment Easily</h1>
          <p style={sub}>Affordable tractors, tillers, and tools — delivered directly to your farm.</p>

          <button style={cta} onClick={() => navigate("/tools")}>Rent Now</button>
        </div>

        <div style={imageWrap}>
          <img
            alt="tractor"
            src="/src/assets/tractor-hero.jpg"
            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }}
          />
        </div>
      </div>

      {/* Latest equipment heading + placeholder cards */}
      <div style={latestWrap}>
        <h2 style={latestTitle}>Latest Equipment</h2>

        {/* Preview single card (home preview) */}
        <div style={previewRow}>
          <div style={previewCard}>
            <img src="/src/assets/tractor-hero.jpg" alt="tractor" style={previewImg} />
            <div style={{ padding: 12 }}>
              <div style={{ fontWeight: 700, fontSize: 16 }}>tractor</div>
              <div style={{ color: "#777", marginTop: 6 }}>swaraj -555</div>
              <div style={{ marginTop: 10, fontWeight: 700, color: "#116530" }}>₹499/hour</div>
              <div style={{ marginTop: 12 }}>
                <button style={viewBtn} onClick={() => navigate("/tools")}>View</button>
              </div>
            </div>
          </div>

          <div style={{ marginLeft: 24 }}>
            <button style={viewMoreBtn} onClick={() => navigate("/tools")}>View more</button>
          </div>
        </div>

        {/* Reviews area (home preview) */}
        <Reviews limit={3} />
      </div>
    </section>
  );
}

/* styles (JS objects) */
const container = { maxWidth: 1200, margin: "40px auto", padding: "0 20px" };
const card = { display: "grid", gridTemplateColumns: "1fr 420px", gap: 24, background: "#fff", padding: 22, borderRadius: 10, boxShadow: "0 18px 40px rgba(0,0,0,0.06)", alignItems: "center" };
const left = {};
const eyebrow = { color: "#16a34a", fontWeight: 700, letterSpacing: 1 };
const headline = { fontSize: 48, lineHeight: 1.02, marginTop: 8, marginBottom: 10, fontFamily: "Georgia, serif" };
const sub = { color: "#666", marginBottom: 18 };
const cta = { background: "#196f2d", color: "#fff", padding: "12px 18px", border: "none", borderRadius: 8, cursor: "pointer" };
const imageWrap = { width: "100%", height: 280, overflow: "hidden", borderRadius: 8 };
const latestWrap = { marginTop: 32 };
const latestTitle = { fontSize: 22, fontWeight: 800, marginBottom: 14 };
const previewRow = { display: "flex", alignItems: "flex-start", gap: 24 };
const previewCard = { width: 320, borderRadius: 10, overflow: "hidden", boxShadow: "0 8px 28px rgba(0,0,0,0.06)", background: "#fff", border: "1px solid #f0f0f0" };
const previewImg = { width: "100%", height: 150, objectFit: "cover" };
const viewBtn = { background: "#1f7a3a", color: "#fff", padding: "8px 12px", border: "none", borderRadius: 8, cursor: "pointer" };
const viewMoreBtn = { background: "#fff", border: "1px solid #e6f0e6", padding: "8px 12px", borderRadius: 8, cursor: "pointer", color: "#196f2d" };
