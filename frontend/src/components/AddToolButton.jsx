import React, { useState } from "react";
import { useAuth } from "../context/AuthContext"; // adjust import if your path differs

export default function AddToolButton() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  // form state
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [hourly, setHourly] = useState("");
  const [imageDataUrl, setImageDataUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  function openModal() {
    if (!user) {
      alert("Please sign in to add a tool.");
      return;
    }
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
    setTitle("");
    setDesc("");
    setHourly("");
    setImageDataUrl(null);
    setLoading(false);
  }

  // read local file to base64
  function onFileChange(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageDataUrl(reader.result.toString());
    };
    reader.readAsDataURL(f);
  }

  function saveToolToLocalStorage(tool) {
    const all = JSON.parse(localStorage.getItem("farming_tools") || "[]");
    all.unshift(tool);
    localStorage.setItem("farming_tools", JSON.stringify(all));
  }

  function createBookingForTool(tool) {
    // booking shape similar to your app's bookings
    const bookings = JSON.parse(localStorage.getItem("farming_bookings") || "[]");
    const booking = {
      id: "bkg_" + Date.now() + Math.floor(Math.random() * 999),
      toolId: tool.id,
      toolTitle: tool.title,
      ownerEmail: tool.ownerEmail,
      ownerName: tool.ownerName,
      ownerPhone: tool.ownerPhone,
      customer: {
        name: user?.name || "Anonymous",
        phone: user?.phone || "",
        email: user?.email || "",
        address: "",
      },
      hours: 1,
      amount: Number(tool.hourly) || 0,
      method: "cash",
      paymentStatus: "cash_pending", // you can change to "pending" if you prefer
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    bookings.unshift(booking);
    localStorage.setItem("farming_bookings", JSON.stringify(bookings));
    return booking;
  }

  async function handleAddAndRent() {
    if (!title.trim()) return alert("Please enter tool name");
    if (!hourly || isNaN(Number(hourly))) return alert("Please enter valid hourly charges");

    setLoading(true);

    // create tool object
    const tool = {
      id: "tool_" + Date.now() + Math.floor(Math.random() * 999),
      title: title.trim(),
      description: desc.trim(),
      hourly: Number(hourly),
      image: imageDataUrl || "", // base64 data url
      ownerEmail: user?.email || "",
      ownerName: user?.name || "",
      ownerPhone: user?.phone || "",
      createdAt: new Date().toISOString(),
    };

    // save tool
    saveToolToLocalStorage(tool);

    // create booking with cash option (rent)
    const booking = createBookingForTool(tool);

    setLoading(false);
    closeModal();

    alert(`Tool added and booking created (cash). Booking id: ${booking.id}`);
    // optionally you can redirect user to profile/bookings page:
    // navigate("/profile/bookings")
    // or dispatch a state update if your parent reads localStorage live
  }

  function handleAddOnly() {
    if (!title.trim()) return alert("Please enter tool name");
    if (!hourly || isNaN(Number(hourly))) return alert("Please enter valid hourly charges");

    const tool = {
      id: "tool_" + Date.now() + Math.floor(Math.random() * 999),
      title: title.trim(),
      description: desc.trim(),
      hourly: Number(hourly),
      image: imageDataUrl || "",
      ownerEmail: user?.email || "",
      ownerName: user?.name || "",
      ownerPhone: user?.phone || "",
      createdAt: new Date().toISOString(),
    };

    saveToolToLocalStorage(tool);
    closeModal();
    alert("Tool added successfully");
  }

  // inline styles for quick drop-in (you can replace with Tailwind classes)
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
    actions: { display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 14 },
    btnPrimary: { padding: "10px 16px", background: "#137f3d", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" },
    btnGhost: { padding: "10px 16px", background: "#fff", color: "#333", border: "1px solid #ddd", borderRadius: 8, cursor: "pointer" },
    rentBtn: { padding: "10px 16px", background: "#0b5a3d", color: "#fff", borderRadius: 8, border: "none", cursor: "pointer" },
  };

  return (
    <>
      <button style={styles.floatBtn} onClick={openModal} title="Add tool">
        +
      </button>

      {open && (
        <div style={styles.modalBackdrop} onMouseDown={closeModal}>
          <div style={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0 }}>Add new tool</h3>
              <button onClick={closeModal} style={{ border: "none", background: "transparent", cursor: "pointer", fontSize: 18 }}>
                ✕
              </button>
            </div>

            <div style={{ marginTop: 10 }}>
              <div style={styles.label}>Tool name</div>
              <input style={styles.field} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. tractor" />

              <div style={styles.label}>Description</div>
              <textarea style={{ ...styles.field, minHeight: 90 }} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Short description" />

              <div style={styles.label}>Hourly charges (₹)</div>
              <input style={styles.field} value={hourly} onChange={(e) => setHourly(e.target.value)} placeholder="e.g. 499" />

              <div style={styles.label}>Image (upload from your device)</div>
              <input type="file" accept="image/*" onChange={onFileChange} style={{ marginTop: 8 }} />
              {imageDataUrl && <img alt="preview" src={imageDataUrl} style={styles.imagePreview} />}

              <div style={{ marginTop: 12, fontSize: 14, color: "#444" }}>
                Owner: <b>{user?.name || user?.email || "You"}</b>
              </div>

              <div style={styles.actions}>
                <button style={styles.btnGhost} onClick={closeModal}>Cancel</button>
                <button style={styles.btnPrimary} onClick={handleAddOnly} disabled={loading}>
                  Add tool
                </button>

                <button style={styles.rentBtn} onClick={handleAddAndRent} disabled={loading}>
                  Rent (create booking - Cash)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
