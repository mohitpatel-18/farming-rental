import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useShop } from "../context/ShopContext";
import { TOOL_CATEGORIES } from "../utils/toolUtils";

export default function AddToolButton() {
  const { user } = useAuth();
  const { addTool } = useShop();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [pricePerDay, setPricePerDay] = useState("");
  const [category, setCategory] = useState(TOOL_CATEGORIES[0]);
  const [imageDataUrl, setImageDataUrl] = useState(null);

  function openModal() {
    if (!user) {
      window.alert("Please sign in to add a tool.");
      return;
    }

    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
    setTitle("");
    setDesc("");
    setPricePerDay("");
    setCategory(TOOL_CATEGORIES[0]);
    setImageDataUrl(null);
  }

  function onFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setImageDataUrl(reader.result?.toString() || "");
    reader.readAsDataURL(file);
  }

  function validate() {
    if (!title.trim()) {
      window.alert("Please enter tool name");
      return false;
    }

    if (!pricePerDay || Number.isNaN(Number(pricePerDay))) {
      window.alert("Please enter valid daily charges");
      return false;
    }

    return true;
  }

  function handleAddOnly() {
    if (!validate()) {
      return;
    }

    addTool(
      {
        title,
        description: desc,
        pricePerDay,
        category,
        image: imageDataUrl || "",
      },
      user
    );
    closeModal();
    window.alert("Tool added successfully");
  }

  const styles = {
    floatBtn: {
      position: "fixed",
      right: 28,
      bottom: 28,
      zIndex: 1200,
      background: "#137f3d",
      color: "#fff",
      border: "none",
      width: 60,
      height: 60,
      borderRadius: 999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 28,
      cursor: "pointer",
      boxShadow: "0 6px 18px rgba(0,0,0,0.18)",
    },
    modalBackdrop: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.4)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1300,
    },
    modal: {
      width: 760,
      maxWidth: "95%",
      background: "#fff",
      borderRadius: 10,
      padding: 20,
      boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
    },
    field: { width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #ddd", marginTop: 8 },
    label: { fontWeight: 700, marginTop: 10 },
    imagePreview: { width: "100%", maxHeight: 220, objectFit: "cover", borderRadius: 6, marginTop: 8 },
    actions: { display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 14, flexWrap: "wrap" },
    btnPrimary: { padding: "10px 16px", background: "#137f3d", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" },
    btnGhost: { padding: "10px 16px", background: "#fff", color: "#333", border: "1px solid #ddd", borderRadius: 8, cursor: "pointer" },
  };

  return (
    <>
      <button style={styles.floatBtn} onClick={openModal} title="Add tool">+</button>

      {open && (
        <div style={styles.modalBackdrop} onMouseDown={closeModal}>
          <div style={styles.modal} onMouseDown={(event) => event.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0 }}>Add new tool</h3>
              <button onClick={closeModal} style={{ border: "none", background: "transparent", cursor: "pointer", fontSize: 18 }}>✕</button>
            </div>

            <div style={{ marginTop: 10 }}>
              <div style={styles.label}>Tool name</div>
              <input style={styles.field} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. tractor" />

              <div style={styles.label}>Category</div>
              <select style={styles.field} value={category} onChange={(event) => setCategory(event.target.value)}>
                {TOOL_CATEGORIES.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>

              <div style={styles.label}>Description</div>
              <textarea style={{ ...styles.field, minHeight: 90 }} value={desc} onChange={(event) => setDesc(event.target.value)} placeholder="Short description" />

              <div style={styles.label}>Daily charges (₹)</div>
              <input style={styles.field} value={pricePerDay} onChange={(event) => setPricePerDay(event.target.value)} placeholder="e.g. 499" />

              <div style={styles.label}>Image (upload from your device)</div>
              <input type="file" accept="image/*" onChange={onFileChange} style={{ marginTop: 8 }} />
              {imageDataUrl && <img alt="preview" src={imageDataUrl} style={styles.imagePreview} />}

              <div style={{ marginTop: 12, fontSize: 14, color: "#444" }}>
                Owner: <b>{user?.name || user?.email || "You"}</b>
              </div>

              <div style={styles.actions}>
                <button style={styles.btnGhost} onClick={closeModal}>Cancel</button>
                <button style={styles.btnPrimary} onClick={handleAddOnly}>Add tool</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
