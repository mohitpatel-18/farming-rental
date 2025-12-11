import React from "react";
import { useShop } from "../context/ShopContext";

export default function LatestCollection() {
  const { tools } = useShop();

  return (
    <section className="max-w-6xl mx-auto px-6 mt-12">
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Latest Collections</h2>

      {(!tools || tools.length === 0) ? (
        <p style={{ color: "#666" }}>No equipment listed yet.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px,1fr))", gap: 16, marginTop: 12 }}>
          {tools.map((tool) => (
            <div key={tool.id} style={{ border: "1px solid #eee", borderRadius: 10, overflow: "hidden", background: "#fff", boxShadow: "0 8px 20px rgba(0,0,0,0.04)" }}>
              {tool.image ? (
                <img src={tool.image} alt={tool.title} style={{ width: "100%", height: 160, objectFit: "cover" }} />
              ) : null}

              <div style={{ padding: 12 }}>
                <div style={{ fontWeight: 800, fontSize: 16 }}>{tool.title}</div>
                <div style={{ color: "#666", marginTop: 6 }}>{tool.description}</div>
                <div style={{ marginTop: 10, fontWeight: 700, color: "#1f7a3a" }}>₹{tool.pricePerHour}/hour</div>
                <button style={{ marginTop: 10, padding: "8px 12px", background: "#1f7a3a", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}>
                  Rent Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
