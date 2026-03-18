import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useShop } from "../context/ShopContext";
import { TOOL_CATEGORIES } from "../utils/toolUtils";

const EMPTY_PROFILE = { name: "", gender: "", phone: "", email: "", address: "" };
const EMPTY_TOOL_FORM = { title: "", description: "", pricePerDay: "", category: TOOL_CATEGORIES[0], image: "" };

const inputStyles = {
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid #ddd",
  width: "100%",
  boxSizing: "border-box",
};

const tabButtonStyles = (isActive) => ({
  padding: "8px 12px",
  borderRadius: 8,
  border: isActive ? "none" : "1px solid #ddd",
  background: isActive ? "#1f7a3a" : "#fff",
  color: isActive ? "#fff" : "#333",
});

export default function Profile() {
  const { user, logout, updateProfile } = useAuth();
  const { tools, addTool, removeTool } = useShop();
  const [activeTab, setActiveTab] = useState("profile");
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState(EMPTY_PROFILE);
  const [toolForm, setToolForm] = useState(EMPTY_TOOL_FORM);
  const [previewDays, setPreviewDays] = useState(1);
  const [previewImage, setPreviewImage] = useState("");
  const messageTimeoutRef = useRef(null);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        gender: user.gender || "",
        phone: user.phone || "",
        email: user.email || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const myTools = useMemo(
    () => tools.filter((tool) => tool.ownerEmail === user?.email),
    [tools, user?.email]
  );

  const showMessage = (nextMessage) => {
    setMessage(nextMessage);
    window.clearTimeout(messageTimeoutRef.current);
    messageTimeoutRef.current = window.setTimeout(() => setMessage(""), 2000);
  };

  useEffect(() => () => window.clearTimeout(messageTimeoutRef.current), []);

  const handleProfileSubmit = (event) => {
    event.preventDefault();

    try {
      updateProfile(form);
      setEditing(false);
      showMessage("Profile updated.");
    } catch (error) {
      showMessage(error.message || "Failed to update profile.");
    }
  };

  const resetToolForm = () => {
    setToolForm(EMPTY_TOOL_FORM);
    setPreviewImage("");
    setPreviewDays(1);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const image = reader.result?.toString() || "";
      setToolForm((currentForm) => ({ ...currentForm, image }));
      setPreviewImage(image);
    };
    reader.readAsDataURL(file);
  };

  const handleAddTool = (event) => {
    event.preventDefault();

    if (!user) {
      showMessage("Login to add tools.");
      return;
    }

    if (!toolForm.title.trim()) {
      showMessage("Enter tool name.");
      return;
    }

    addTool(
      {
        title: toolForm.title,
        description: toolForm.description,
        category: toolForm.category,
        image: toolForm.image,
        pricePerDay: toolForm.pricePerDay,
      },
      user
    );

    resetToolForm();
    setActiveTab("mytools");
    showMessage("Tool added.");
  };

  if (!user) {
    return <div style={{ padding: 24 }}>Please login to view profile.</div>;
  }

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: 800, maxWidth: "96%" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <button onClick={() => setActiveTab("profile")} style={tabButtonStyles(activeTab === "profile")}>Profile</button>
            <button onClick={() => setActiveTab("add")} style={tabButtonStyles(activeTab === "add")}>Add Tools</button>
            <button onClick={() => setActiveTab("mytools")} style={tabButtonStyles(activeTab === "mytools")}>My Tools</button>
          </div>

          <div style={{ background: "#fff", padding: 18, borderRadius: 12, border: "1px solid #f0f0f0", boxShadow: "0 8px 20px rgba(0,0,0,0.04)" }}>
            {activeTab === "profile" && (
              <div>
                <h3 style={{ marginTop: 0 }}>Profile</h3>
                {!editing ? (
                  <div>
                    {Object.entries(form).map(([field, value]) => (
                      <div key={field} style={{ marginBottom: 8 }}>
                        <strong>{field[0].toUpperCase() + field.slice(1)}:</strong>
                        <span style={{ marginLeft: 8 }}>{value || "-"}</span>
                      </div>
                    ))}

                    <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                      <button style={{ background: "#1f7a3a", color: "#fff", padding: "8px 12px", border: "none", borderRadius: 8 }} onClick={() => setEditing(true)}>Edit Profile</button>
                      <button style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd" }} onClick={logout}>Logout</button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleProfileSubmit}>
                    <label style={{ display: "block", marginBottom: 6 }}>Name</label>
                    <input style={inputStyles} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />

                    <label style={{ display: "block", marginTop: 8, marginBottom: 6 }}>Gender</label>
                    <select style={inputStyles} value={form.gender} onChange={(event) => setForm({ ...form, gender: event.target.value })}>
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>

                    <label style={{ display: "block", marginTop: 8, marginBottom: 6 }}>Phone</label>
                    <input style={inputStyles} value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />

                    <label style={{ display: "block", marginTop: 8, marginBottom: 6 }}>Email</label>
                    <input style={inputStyles} type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />

                    <label style={{ display: "block", marginTop: 8, marginBottom: 6 }}>Address</label>
                    <textarea style={{ ...inputStyles, minHeight: 80 }} value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} />

                    <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                      <button type="submit" style={{ background: "#1f7a3a", color: "#fff", padding: "8px 12px", border: "none", borderRadius: 8 }}>Update</button>
                      <button type="button" style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd" }} onClick={() => setEditing(false)}>Cancel</button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {activeTab === "add" && (
              <div>
                <h3 style={{ marginTop: 0 }}>Add Tool</h3>

                <label style={{ fontWeight: 600 }}>Upload Image</label>
                <div style={{ border: "2px dashed #ccc", borderRadius: 10, height: 140, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10, position: "relative" }}>
                  {previewImage ? <img src={previewImage} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ color: "#777" }}>Choose image</span>}
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{ position: "absolute", width: "100%", height: "100%", opacity: 0, cursor: "pointer" }} />
                </div>

                <form onSubmit={handleAddTool} style={{ display: "grid", gap: 8 }}>
                  <input style={inputStyles} placeholder="Tool name" value={toolForm.title} onChange={(event) => setToolForm({ ...toolForm, title: event.target.value })} />
                  <input style={inputStyles} placeholder="Short description" value={toolForm.description} onChange={(event) => setToolForm({ ...toolForm, description: event.target.value })} />
                  <select style={inputStyles} value={toolForm.category} onChange={(event) => setToolForm({ ...toolForm, category: event.target.value })}>
                    {TOOL_CATEGORIES.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <input style={inputStyles} placeholder="Price per day (₹)" type="number" value={toolForm.pricePerDay} onChange={(event) => setToolForm({ ...toolForm, pricePerDay: event.target.value })} />

                  <label style={{ marginTop: 6 }}>Days preview</label>
                  <select style={inputStyles} value={previewDays} onChange={(event) => setPreviewDays(Number(event.target.value))}>
                    {Array.from({ length: 12 }, (_, index) => index + 1).map((dayCount) => <option key={dayCount} value={dayCount}>{dayCount} day{dayCount > 1 ? "s" : ""}</option>)}
                  </select>

                  <div>
                    <div style={{ color: "#666", fontSize: 13 }}>Total preview</div>
                    <div style={{ fontWeight: 800, fontSize: 18, color: "#1f7a3a" }}>₹{Number(toolForm.pricePerDay || 0) * previewDays}</div>
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>
                    <button type="submit" style={{ background: "#1f7a3a", color: "#fff", padding: "8px 12px", border: "none", borderRadius: 8 }}>Add Tool</button>
                    <button type="button" style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd" }} onClick={resetToolForm}>Reset</button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === "mytools" && (
              <div>
                <h3 style={{ marginTop: 0 }}>My Tools</h3>
                <div style={{ display: "grid", gap: 12, marginTop: 8 }}>
                  {myTools.length === 0 ? (
                    <div style={{ color: "#666" }}>You have not added any tools yet.</div>
                  ) : (
                    myTools.map((tool) => (
                      <div key={tool.id} style={{ border: "1px solid #eee", borderRadius: 8, padding: 12, display: "flex", gap: 12, alignItems: "center" }}>
                        {tool.image && <img src={tool.image} alt={tool.title} style={{ width: 120, height: 80, objectFit: "cover", borderRadius: 6 }} />}
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 800 }}>{tool.title}</div>
                          <div style={{ color: "#666", marginTop: 6 }}>{tool.description}</div>
                          <div style={{ marginTop: 6, color: "#64748b", fontWeight: 600 }}>{tool.category}</div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          <div style={{ fontWeight: 700, color: "#1f7a3a" }}>₹{tool.pricePerDay}/day</div>
                          <button style={{ padding: "6px 10px", borderRadius: 8, background: "#fff", border: "1px solid #f2c6c6", color: "#d23a3a" }} onClick={() => removeTool(tool.id)}>Remove</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {message && <div style={{ marginTop: 10, color: "#1f7a3a" }}>{message}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
