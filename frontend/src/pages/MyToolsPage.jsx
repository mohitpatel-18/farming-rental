import React, { useState } from "react";
import { useShop } from "../context/ShopContext";
import { useAuth } from "../context/AuthContext";

/**
 * MyToolsPage.jsx
 * (Default export) — paste whole file, save, restart dev server if overlay persists.
 */

export default function MyToolsPage() {
  const { tools, removeTool } = useShop();
  const { user } = useAuth();

  const myTools = (tools || []).filter((t) => t.ownerEmail === user?.email);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", description: "", pricePerHour: "", image: "" });

  const startEdit = (tool) => {
    setEditingId(tool.id);
    setEditForm({
      title: tool.title || "",
      description: tool.description || "",
      pricePerHour: tool.pricePerHour || "",
      image: tool.image || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ title: "", description: "", pricePerHour: "", image: "" });
  };

  const saveEdit = () => {
    try {
      const all = JSON.parse(localStorage.getItem("farming_tools") || "[]");
      const updated = all.map((t) => {
        if (t.id === editingId) {
          return { ...t, ...editForm, pricePerHour: Number(editForm.pricePerHour || 0) };
        }
        return t;
      });
      localStorage.setItem("farming_tools", JSON.stringify(updated));
      // quick refresh to rehydrate ShopContext
      setTimeout(() => window.location.reload(), 60);
    } catch (err) {
      console.error("saveEdit error", err);
      alert("Save failed — check console");
    }
  };

  const confirmAndRemove = (id) => {
    if (!confirm("Remove this tool?")) return;
    removeTool(id);
  };

  if (!user) return <div style={{ padding: 20 }}>Please login to view your tools.</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ marginTop: 0 }}>My Tools</h2>
      <p style={{ color: "#666" }}>Manage your tools listed for rent.</p>

      {editingId && (
        <div style={editorBox}>
          <h3 style={{ marginTop: 0 }}>Edit tool</h3>

          <label style={label}>Title</label>
          <input style={input} value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />

          <label style={label}>Description</label>
          <input style={input} value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />

          <label style={label}>Price per hour (₹)</label>
          <input style={input} type="number" value={editForm.pricePerHour} onChange={(e) => setEditForm({ ...editForm, pricePerHour: e.target.value })} />

          <label style={label}>Image (Data URL or leave)</label>
          <input style={input} value={editForm.image} onChange={(e) => setEditForm({ ...editForm, image: e.target.value })} placeholder="paste DataURL" />

          <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
            <button style={primaryBtn} onClick={saveEdit}>Save</button>
            <button style={outlineBtn} onClick={cancelEdit}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ marginTop: 12 }}>
        {myTools.length === 0 ? (
          <div style={{ color: "#666" }}>You haven't added any tools yet.</div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {myTools.map((t) => (
              <div key={t.id} style={card}>
                {t.image && <img src={t.image} alt={t.title} style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 8 }} />}

                <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: 18 }}>{t.title}</div>
                    <div style={{ color: "#666", marginTop: 6 }}>{t.description}</div>
                    <div style={{ marginTop: 6, fontWeight: 700, color: "#1f7a3a" }}>₹{t.pricePerHour}/hour</div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginLeft: 12 }}>
                    <button style={smallBtn} onClick={() => startEdit(t)}>Edit</button>
                    <button style={removeBtn} onClick={() => confirmAndRemove(t.id)}>Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- styles ---------- */
const card = { borderRadius: 12, padding: 12, border: "1px solid #f0f0f0", background: "#fff", boxShadow: "0 6px 18px rgba(12,12,12,0.04)" };
const editorBox = { marginTop: 18, marginBottom: 18, padding: 14, borderRadius: 10, border: "1px solid #eee", background: "#fff" };
const label = { display: "block", marginTop: 8, marginBottom: 6, fontSize: 13, fontWeight: 700, color: "#444" };
const input = { padding: "10px 12px", borderRadius: 8, border: "1px solid #ddd", width: "100%", boxSizing: "border-box" };
const primaryBtn = { background: "#1f7a3a", color: "#fff", padding: "8px 12px", borderRadius: 8, border: "none", cursor: "pointer" };
const outlineBtn = { padding: "8px 12px", borderRadius: 8, background: "transparent", border: "1px solid #ddd", cursor: "pointer" };
const smallBtn = { padding: "6px 10px", borderRadius: 8, border: "1px solid #ddd", background: "transparent", cursor: "pointer" };
const removeBtn = { padding: "6px 10px", borderRadius: 8, background: "#fff", border: "1px solid #f2c6c6", color: "#d04444", cursor: "pointer" };
