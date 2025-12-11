// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Home page: Hero + Tools preview (shows up to 6 tools).
 * Reads tools from localStorage (tries several keys).
 *
 * Tool shape expected (from your add tool UI):
 *  { id, title, description, pricePerHour, imageUrl, ownerEmail, ... }
 *
 * Fallback image used when tool has no image.
 */

const FALLBACK = "/src/assets/tractor-hero.jpg";

export default function Home() {
  const navigate = useNavigate();
  const [tools, setTools] = useState([]);

  useEffect(() => {
    loadTools();
  }, []);

  function loadTools() {
    // try a few possible storage keys (covers different implementations)
    const tryKeys = ["farming_tools", "tools", "my_tools", "farming_items"];
    let all = [];
    for (const k of tryKeys) {
      const raw = localStorage.getItem(k);
      if (!raw) continue;
      try {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) {
          all = arr;
          break;
        }
      } catch (e) {
        // ignore parse errors
      }
    }

    // if still empty, maybe your tools are stored inside bookings or other key.
    // keep all = [] then show empty state.
    // take newest 6
    const visible = (all || []).slice(0, 6);
    setTools(visible);
  }

  return (
    <div style={{ background: "#fafafa", minHeight: "100vh" }}>
      <div style={styles.container}>
        {/* HERO */}
        <div style={styles.heroWrap}>
          <div style={styles.heroCard}>
            <div style={styles.heroLeft}>
              <div style={{ color: "#16a34a", fontWeight: 700, fontSize: 14 }}>TOP EQUIPMENT</div>
              <h1 style={styles.heroTitle}>Rent Farming Equipment Easily</h1>
              <p style={styles.heroText}>
                Affordable tractors, tillers, and tools — delivered directly to your farm.
              </p>

              <div style={{ marginTop: 18 }}>
                <button style={styles.rentBtn} onClick={() => navigate("/tools")}>
                  Rent Now
                </button>
              </div>
            </div>

            <div
              style={{
                ...styles.heroImage,
                backgroundImage: `url(${FALLBACK})`,
              }}
            />
          </div>
        </div>

        {/* TOOLS PREVIEW */}
        <section style={{ maxWidth: 1100, margin: "36px auto 72px" }}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Latest Equipment</h2>
            <button style={styles.viewMore} onClick={() => navigate("/tools")}>
              View more
            </button>
          </div>

          {tools.length === 0 ? (
            <div style={styles.empty}>No equipment listed yet — click "View more" to add tools from your profile.</div>
          ) : (
            <div style={styles.grid}>
              {tools.map((t, i) => (
                <ToolCard key={t.id || i} tool={t} onClick={() => navigate("/tools")} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

/* little reusable tool card */
function ToolCard({ tool, onClick }) {
  const img = tool.imageUrl || tool.image || tool.photo || "/src/assets/tractor-hero.jpg";
  const title = tool.title || tool.name || "Untitled tool";
  const desc = tool.description || tool.shortDescription || "";
  const price = tool.pricePerHour ?? tool.price ?? tool.hourly ?? "";

  return (
    <div style={cardStyles.card}>
      <div style={{ ...cardStyles.media, backgroundImage: `url(${img})` }} />
      <div style={cardStyles.body}>
        <div style={cardStyles.title}>{title}</div>
        <div style={cardStyles.desc}>{desc}</div>

        <div style={cardStyles.row}>
          <div style={cardStyles.price}>₹{price ? price : "—"}/hour</div>
          <button style={cardStyles.cta} onClick={onClick}>
            View
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- styles ------------------- */

const styles = {
  container: { maxWidth: 1200, margin: "32px auto", padding: "0 20px" },
  heroWrap: { marginTop: 6 },
  heroCard: {
    display: "grid",
    gridTemplateColumns: "1fr 420px",
    gap: 0,
    background: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    border: "1px solid #eee",
    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
  },
  heroLeft: { padding: 36, maxWidth: 700 },
  heroTitle: { fontSize: 44, fontWeight: 700, margin: "12px 0 8px", color: "#0f172a", lineHeight: 1.02 },
  heroText: { color: "#6b7280", maxWidth: 560, marginTop: 6, fontSize: 16 },
  rentBtn: {
    background: "#1f7a3a",
    color: "#fff",
    border: "none",
    padding: "12px 18px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 700,
  },
  heroImage: {
    minHeight: 320,
    backgroundSize: "cover",
    backgroundPosition: "center",
  },

  sectionHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  sectionTitle: { margin: 0, fontSize: 22, fontWeight: 700 },
  viewMore: {
    background: "transparent",
    border: "1px solid #e6e6e6",
    padding: "8px 12px",
    borderRadius: 8,
    cursor: "pointer",
    color: "#1f7a3a",
    fontWeight: 700,
  },

  empty: {
    padding: 24,
    borderRadius: 10,
    background: "#fff",
    border: "1px dashed #eee",
    color: "#777",
  },

  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 18 },
};

/* small card styles */
const cardStyles = {
  card: { background: "#fff", border: "1px solid #eee", borderRadius: 10, overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 6px 20px rgba(0,0,0,0.04)" },
  media: { height: 160, backgroundSize: "cover", backgroundPosition: "center" },
  body: { padding: 14, display: "flex", flexDirection: "column", gap: 8, flex: 1 },
  title: { fontWeight: 700, fontSize: 16 },
  desc: { color: "#666", fontSize: 14, minHeight: 38 },
  row: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" },
  price: { color: "#065f46", fontWeight: 800 },
  cta: { background: "#1f7a3a", color: "#fff", padding: "8px 12px", border: "none", borderRadius: 8, cursor: "pointer" },
};
