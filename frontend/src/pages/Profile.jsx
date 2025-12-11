import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useShop } from "../context/ShopContext";

export default function Profile() {
  const { user, logout } = useAuth();
  const { tools, addTool, removeTool } = useShop();

  const [activeTab, setActiveTab] = useState("profile"); // 'profile' | 'add' | 'mytools'
  const [editing, setEditing] = useState(false);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({ name: "", gender: "", phone: "", email: "", address: "" });

  // Add Tool form state
  const [toolForm, setToolForm] = useState({ title: "", description: "", pricePerHour: "", image: "" });
  const [hours, setHours] = useState(1);
  const [previewImg, setPreviewImg] = useState("");

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        gender: user.gender || "",
        phone: user.phone || "",
        email: user.email || "",
        address: user.address || ""
      });
    }
  }, [user]);

  const updateProfile = () => {
    try {
      const users = JSON.parse(localStorage.getItem("farming_users") || "[]");
      const idx = users.findIndex((u) => u.email === (user && user.email));
      let updatedUser;
      if (idx >= 0) {
        users[idx] = { ...users[idx], ...form };
        updatedUser = users[idx];
      } else {
        updatedUser = { ...(user || {}), ...form };
      }
      localStorage.setItem("farming_users", JSON.stringify(users));
      localStorage.setItem("farming_auth_user", JSON.stringify(updatedUser));
      setMsg("Profile updated.");
      setEditing(false);
      setTimeout(() => setMsg(""), 2000);
    } catch (e) {
      console.error(e);
      setMsg("Failed to update.");
      setTimeout(() => setMsg(""), 2000);
    }
  };

  // Image upload for tool (Base64)
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setToolForm((s) => ({ ...s, image: reader.result }));
      setPreviewImg(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const addToolHandler = (e) => {
    e.preventDefault();
    if (!user) {
      setMsg("Login to add tools.");
      setTimeout(() => setMsg(""), 2000);
      return;
    }
    if (!toolForm.title) {
      setMsg("Enter tool name.");
      setTimeout(() => setMsg(""), 2000);
      return;
    }

    addTool({
      title: toolForm.title,
      description: toolForm.description,
      pricePerHour: Number(toolForm.pricePerHour || 0),
      image: toolForm.image,
      ownerEmail: user.email
    });

    setToolForm({ title: "", description: "", pricePerHour: "", image: "" });
    setPreviewImg("");
    setHours(1);
    setMsg("Tool added.");
    setTimeout(() => setMsg(""), 2000);

    // switch to mytools tab to show added items instantly
    setActiveTab("mytools");
  };

  if (!user) return <div style={{ padding: 24 }}>Please login to view profile.</div>;

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: 800, maxWidth: "96%" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <button onClick={() => setActiveTab("profile")} style={{ padding: "8px 12px", borderRadius: 8, border: activeTab === "profile" ? "none" : "1px solid #ddd", background: activeTab === "profile" ? "#1f7a3a" : "#fff", color: activeTab === "profile" ? "#fff" : "#333" }}>Profile</button>
            <button onClick={() => setActiveTab("add")} style={{ padding: "8px 12px", borderRadius: 8, border: activeTab === "add" ? "none" : "1px solid #ddd", background: activeTab === "add" ? "#1f7a3a" : "#fff", color: activeTab === "add" ? "#fff" : "#333" }}>Add Tools</button>
            <button onClick={() => setActiveTab("mytools")} style={{ padding: "8px 12px", borderRadius: 8, border: activeTab === "mytools" ? "none" : "1px solid #ddd", background: activeTab === "mytools" ? "#1f7a3a" : "#fff", color: activeTab === "mytools" ? "#fff" : "#333" }}>My Tools</button>
          </div>

          <div style={{ background: "#fff", padding: 18, borderRadius: 12, border: "1px solid #f0f0f0", boxShadow: "0 8px 20px rgba(0,0,0,0.04)" }}>
            {activeTab === "profile" && (
              <div>
                <h3 style={{ marginTop: 0 }}>Profile</h3>
                {!editing ? (
                  <div>
                    <div style={{ marginBottom: 8 }}><strong>Name:</strong> <span style={{ marginLeft: 8 }}>{form.name || "-"}</span></div>
                    <div style={{ marginBottom: 8 }}><strong>Gender:</strong> <span style={{ marginLeft: 8 }}>{form.gender || "-"}</span></div>
                    <div style={{ marginBottom: 8 }}><strong>Phone:</strong> <span style={{ marginLeft: 8 }}>{form.phone || "-"}</span></div>
                    <div style={{ marginBottom: 8 }}><strong>Email:</strong> <span style={{ marginLeft: 8 }}>{form.email || "-"}</span></div>
                    <div style={{ marginBottom: 8 }}><strong>Address:</strong> <span style={{ marginLeft: 8 }}>{form.address || "-"}</span></div>

                    <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                      <button style={{ background: "#1f7a3a", color: "#fff", padding: "8px 12px", border: "none", borderRadius: 8 }} onClick={() => setEditing(true)}>Edit Profile</button>
                      <button style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd" }} onClick={() => logout()}>Logout</button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={(e) => { e.preventDefault(); updateProfile(); }}>
                    <label style={{ display: "block", marginBottom: 6 }}>Name</label>
                    <input style={input} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />

                    <label style={{ display: "block", marginTop: 8, marginBottom: 6 }}>Gender</label>
                    <select style={input} value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>

                    <label style={{ display: "block", marginTop: 8, marginBottom: 6 }}>Phone</label>
                    <input style={input} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />

                    <label style={{ display: "block", marginTop: 8, marginBottom: 6 }}>Email</label>
                    <input style={input} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />

                    <label style={{ display: "block", marginTop: 8, marginBottom: 6 }}>Address</label>
                    <textarea style={{ ...input, minHeight: 80 }} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />

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
                  {previewImg ? <img src={previewImg} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ color: "#777" }}>Choose image</span>}
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{ position: "absolute", width: "100%", height: "100%", opacity: 0, cursor: "pointer" }} />
                </div>

                <form onSubmit={addToolHandler} style={{ display: "grid", gap: 8 }}>
                  <input style={input} placeholder="Tool name" value={toolForm.title} onChange={(e) => setToolForm({ ...toolForm, title: e.target.value })} />
                  <input style={input} placeholder="Short description" value={toolForm.description} onChange={(e) => setToolForm({ ...toolForm, description: e.target.value })} />
                  <input style={input} placeholder="Price per hour (₹)" type="number" value={toolForm.pricePerHour} onChange={(e) => setToolForm({ ...toolForm, pricePerHour: e.target.value })} />

                  <label style={{ marginTop: 6 }}>Hours preview</label>
                  <select style={input} value={hours} onChange={(e) => setHours(Number(e.target.value))}>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => <option key={h} value={h}>{h} hour{h>1?'s':''}</option>)}
                  </select>

                  <div>
                    <div style={{ color: "#666", fontSize: 13 }}>Total preview</div>
                    <div style={{ fontWeight: 800, fontSize: 18, color: "#1f7a3a" }}>₹{(Number(toolForm.pricePerHour||0) * hours)}</div>
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>
                    <button type="submit" style={{ background: "#1f7a3a", color: "#fff", padding: "8px 12px", border: "none", borderRadius: 8 }}>Add Tool</button>
                    <button type="button" style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd" }} onClick={() => { setToolForm({ title: "", description: "", pricePerHour: "", image: "" }); setPreviewImg(""); setHours(1); }}>Reset</button>
                  </div>
                </form>

                {msg && <div style={{ marginTop: 10, color: "#1f7a3a" }}>{msg}</div>}
              </div>
            )}

            {activeTab === "mytools" && (
              <div>
                <h3 style={{ marginTop: 0 }}>My Tools</h3>
                <div style={{ display: "grid", gap: 12, marginTop: 8 }}>
                  {tools.filter(t => t.ownerEmail === user.email).length === 0 ? (
                    <div style={{ color: "#666" }}>You have not added any tools yet.</div>
                  ) : (
                    tools.filter(t => t.ownerEmail === user.email).map(t => (
                      <div key={t.id} style={{ border: "1px solid #eee", borderRadius: 8, padding: 12, display: "flex", gap: 12, alignItems: "center" }}>
                        {t.image && <img src={t.image} alt={t.title} style={{ width: 120, height: 80, objectFit: "cover", borderRadius: 6 }} />}
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 800 }}>{t.title}</div>
                          <div style={{ color: "#666", marginTop: 6 }}>{t.description}</div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          <div style={{ fontWeight: 700, color: "#1f7a3a" }}>₹{t.pricePerHour}/hr</div>
                          <div style={{ display: "flex", gap: 8 }}>
                            <button style={{ padding: "6px 10px", borderRadius: 8, background: "#fff", border: "1px solid #ddd" }}>Edit</button>
                            <button style={{ padding: "6px 10px", borderRadius: 8, background: "#fff", border: "1px solid #f2c6c6", color: "#d23a3a" }} onClick={() => removeTool(t.id)}>Remove</button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

/* common styles */
const input = { padding: "10px 12px", borderRadius: 8, border: "1px solid #ddd", width: "100%", boxSizing: "border-box" };
