import React, { useMemo, useState } from "react";
import AddToolButton from "../components/AddToolButton";
import { useAuth } from "../context/AuthContext";
import { useShop } from "../context/ShopContext";
import { TOOL_CATEGORIES } from "../utils/toolUtils";

const EMPTY_EDIT_FORM = {
  title: "",
  description: "",
  pricePerDay: "",
  category: TOOL_CATEGORIES[0],
  image: "",
};

export default function MyToolsPage() {
  const { tools, removeTool, updateTool } = useShop();
  const { user } = useAuth();
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(EMPTY_EDIT_FORM);

  const myTools = useMemo(
    () => tools.filter((tool) => tool.ownerEmail === user?.email),
    [tools, user?.email]
  );

  const startEdit = (tool) => {
    setEditingId(tool.id);
    setEditForm({
      title: tool.title,
      description: tool.description,
      pricePerDay: tool.pricePerDay,
      category: tool.category,
      image: tool.image,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(EMPTY_EDIT_FORM);
  };

  const saveEdit = () => {
    updateTool(editingId, editForm);
    cancelEdit();
  };

  const confirmAndRemove = (id) => {
    if (!window.confirm("Remove this tool?")) {
      return;
    }

    removeTool(id);
  };

  if (!user) {
    return <div style={{ padding: 20 }}>Please login to view your tools.</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ marginTop: 0 }}>My Tools</h2>
      <p style={{ color: "#666" }}>Manage your tools listed for rent.</p>

      {editingId && (
        <div style={editorBox}>
          <h3 style={{ marginTop: 0 }}>Edit tool</h3>

          <label style={label}>Title</label>
          <input style={input} value={editForm.title} onChange={(event) => setEditForm({ ...editForm, title: event.target.value })} />

          <label style={label}>Description</label>
          <input style={input} value={editForm.description} onChange={(event) => setEditForm({ ...editForm, description: event.target.value })} />

          <label style={label}>Category</label>
          <select style={input} value={editForm.category} onChange={(event) => setEditForm({ ...editForm, category: event.target.value })}>
            {TOOL_CATEGORIES.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>

          <label style={label}>Price per day (₹)</label>
          <input style={input} type="number" value={editForm.pricePerDay} onChange={(event) => setEditForm({ ...editForm, pricePerDay: event.target.value })} />

          <label style={label}>Image (Data URL or leave)</label>
          <input style={input} value={editForm.image} onChange={(event) => setEditForm({ ...editForm, image: event.target.value })} placeholder="paste image DataURL" />

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
            {myTools.map((tool) => (
              <div key={tool.id} style={card}>
                {tool.image && <img src={tool.image} alt={tool.title} style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 8 }} />}

                <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: 18 }}>{tool.title}</div>
                    <div style={{ color: "#666", marginTop: 6 }}>{tool.description}</div>
                    <div style={{ marginTop: 6, color: "#64748b", fontWeight: 600 }}>{tool.category}</div>
                    <div style={{ marginTop: 6, fontWeight: 700, color: "#1f7a3a" }}>₹{tool.pricePerDay}/day</div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginLeft: 12 }}>
                    <button style={smallBtn} onClick={() => startEdit(tool)}>Edit</button>
                    <button style={removeBtn} onClick={() => confirmAndRemove(tool.id)}>Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddToolButton />
    </div>
  );
}

const card = {
  borderRadius: 12,
  padding: 12,
  border: "1px solid #f0f0f0",
  background: "#fff",
  boxShadow: "0 6px 18px rgba(12,12,12,0.04)",
};
const editorBox = {
  marginTop: 18,
  marginBottom: 18,
  padding: 14,
  borderRadius: 10,
  border: "1px solid #eee",
  background: "#fff",
};
const label = { display: "block", marginTop: 8, marginBottom: 6, fontSize: 13, fontWeight: 700, color: "#444" };
const input = { padding: "10px 12px", borderRadius: 8, border: "1px solid #ddd", width: "100%", boxSizing: "border-box" };
const primaryBtn = { background: "#1f7a3a", color: "#fff", padding: "8px 12px", borderRadius: 8, border: "none", cursor: "pointer" };
const outlineBtn = { padding: "8px 12px", borderRadius: 8, background: "transparent", border: "1px solid #ddd", cursor: "pointer" };
const smallBtn = { padding: "6px 10px", borderRadius: 8, border: "1px solid #ddd", background: "transparent", cursor: "pointer" };
const removeBtn = { padding: "6px 10px", borderRadius: 8, background: "#fff", border: "1px solid #f2c6c6", color: "#d04444", cursor: "pointer" };
