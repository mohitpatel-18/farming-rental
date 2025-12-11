// src/pages/Tools.jsx
import React, { useState } from "react";
import { useShop } from "../context/ShopContext";
import { useAuth } from "../context/AuthContext";
import RentModal from "../components/RentModal";

export default function Tools() {
  const { tools } = useShop();
  const { user } = useAuth();

  const [rentTool, setRentTool] = useState(null); // tool object for modal
  const [msg, setMsg] = useState("");

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginTop: 0 }}>Tools</h2>
      <p style={{ color: "#666", marginTop: 6 }}>List and manage tools.</p>

      <div style={{ marginTop: 18 }}>
        {tools.length === 0 ? (
          <div style={{ color: "#666", padding: 12 }}>No tools yet.</div>
        ) : (
          <div style={{ display: "grid", gap: 14 }}>
            {tools.map((t) => (
              <div key={t.id} style={card}>
                {t.image && <img src={t.image} alt={t.title} style={{ width: "100%", height: 240, objectFit: "cover", borderRadius: 8 }} />}

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginTop: 10 }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 18 }}>{t.title}</div>
                    <div style={{ color: "#666", marginTop: 6 }}>{t.description}</div>
                    <div style={{ marginTop: 10, fontWeight: 700, color: "#1f7a3a" }}>₹{t.pricePerHour}/hour</div>
                    <div style={{ color: "#888", marginTop: 6, fontSize: 13 }}>{t.ownerEmail}</div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <button style={rentBtn} onClick={() => setRentTool(t)}>Rent</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <RentModal open={!!rentTool} onClose={() => setRentTool(null)} tool={rentTool} />
      {msg && <div style={{ marginTop: 12, color: "#1f7a3a" }}>{msg}</div>}
    </div>
  );
}

const card = { borderRadius: 12, padding: 14, border: "1px solid #f0f0f0", boxShadow: "0 6px 18px rgba(12,12,12,0.04)", background: "#fff" };
const rentBtn = { padding: "8px 12px", borderRadius: 8, background: "#1f7a3a", color: "#fff", border: "none", cursor: "pointer" };
