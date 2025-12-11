// src/components/RentModal.jsx
import React, { useEffect, useState } from "react";

/**
 * RentModal (styled)
 *
 * Props:
 *  - open (bool)
 *  - onClose (fn)
 *  - tool (object) { id, title, pricePerHour, ownerEmail }
 *
 * Behavior:
 *  - Only "Pay Cash" flow (no UPI). Saves booking to localStorage 'farming_bookings'
 *  - status: "cash_pending", method: "cash"
 *  - Shows a nicer, centered card with larger typography and subtle shadow
 */

export default function RentModal({ open, onClose, tool }) {
  const [customer, setCustomer] = useState({ name: "", phone: "", address: "" });
  const [hours, setHours] = useState(1);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!open) {
      // reset a bit when closed
      setMsg("");
      setLoading(false);
      setHours(1);
    } else {
      // if tool exists and we have local "user" info in localStorage, prefill (optional)
      try {
        const auth = JSON.parse(localStorage.getItem("farming_auth") || "null");
        if (auth && auth.name) {
          setCustomer((c) => ({ ...c, name: auth.name || c.name, phone: auth.phone || c.phone }));
        }
      } catch (e) {}
    }
  }, [open]);

  if (!open || !tool) return null;

  const pricePerHour = Number(tool.pricePerHour || 0);
  const total = pricePerHour * Number(hours || 1);

  function saveBooking() {
    const existing = JSON.parse(localStorage.getItem("farming_bookings") || "[]");
    const booking = {
      id: Date.now(),
      toolId: tool.id,
      toolTitle: tool.title,
      ownerEmail: tool.ownerEmail,
      customer,
      hours,
      amount: total,
      method: "cash", // only cash
      status: "cash_pending",
      createdAt: new Date().toISOString(),
    };
    existing.unshift(booking);
    localStorage.setItem("farming_bookings", JSON.stringify(existing));
    return booking;
  }

  async function handleConfirm() {
    // validation
    if (!customer.name.trim() || !customer.phone.trim() || !customer.address.trim()) {
      setMsg("Please enter name, phone and address.");
      return;
    }
    setMsg("");
    setLoading(true);

    // Simulate small delay
    await new Promise((r) => setTimeout(r, 700));

    try {
      saveBooking();
      setLoading(false);
      setMsg("Booking saved. Please collect cash on delivery/pickup.");
      setTimeout(() => {
        setMsg("");
        onClose();
      }, 900);
    } catch (e) {
      console.error(e);
      setLoading(false);
      setMsg("Something went wrong. Try again.");
    }
  }

  return (
    <div style={styles.overlay} onMouseDown={onClose}>
      <div style={styles.card} onMouseDown={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <div>
            <div style={styles.title}>{tool.title} — <span style={styles.subTitle}>Rent</span></div>
            <div style={styles.small}>Fill renter details & confirm cash booking</div>
          </div>
          <button onClick={onClose} style={styles.close}>✕</button>
        </div>

        <div style={styles.content}>
          <div style={styles.left}>
            <input
              style={styles.input}
              placeholder="Name"
              value={customer.name}
              onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
            />
            <input
              style={styles.input}
              placeholder="Phone"
              value={customer.phone}
              onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
            />
            <textarea
              style={{ ...styles.input, minHeight: 84, resize: "vertical" }}
              placeholder="Address"
              value={customer.address}
              onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
            />
            <div style={{ marginTop: 8 }}>
              <label style={{ display: "block", marginBottom: 6, fontWeight: 700 }}>Hours</label>
              <select
                style={styles.select}
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
              >
                {Array.from({ length: 24 }, (_, i) => i + 1).map((h) => (
                  <option key={h} value={h}>{h} hour{h>1 ? "s" : ""}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={styles.right}>
            <div style={styles.priceBox}>
              <div style={{ color: "#666", marginBottom: 6 }}>Total</div>
              <div style={styles.total}>₹{total}</div>
              <div style={{ color: "#888", marginTop: 6, fontSize: 13 }}>({hours} × ₹{pricePerHour}/hr)</div>
            </div>

            <div style={{ marginTop: 16 }}>
              <div style={{ marginBottom: 8, fontWeight: 700 }}>Payment method</div>
              <div style={styles.paymentNote}>Only <strong>Pay Cash</strong> available — pay the owner when equipment is delivered / picked up.</div>
            </div>

            {msg && <div style={styles.msg}>{msg}</div>}

            <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
              <button onClick={handleConfirm} disabled={loading} style={styles.confirmBtn}>
                {loading ? "Saving..." : "Confirm booking — Pay cash"}
              </button>
              <button onClick={onClose} style={styles.cancelBtn}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------ styles ------------ */
const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(10,12,14,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 200,
    padding: 20,
  },
  card: {
    width: 820,
    maxWidth: "100%",
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 40px 100px rgba(2,6,23,0.45)",
    overflow: "hidden",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
    borderBottom: "1px solid #f0f0f0",
  },
  title: { fontSize: 18, fontWeight: 800 },
  subTitle: { fontWeight: 600, color: "#666", fontSize: 14 },
  small: { color: "#666", fontSize: 13, marginTop: 6 },
  close: {
    background: "transparent",
    border: "none",
    fontSize: 18,
    cursor: "pointer",
    padding: "6px 8px",
    color: "#444",
  },

  content: { display: "flex", gap: 18, padding: 18 },
  left: { flex: 1, display: "flex", flexDirection: "column", gap: 10 },
  right: { width: 260, display: "flex", flexDirection: "column" },

  input: {
    padding: "12px 14px",
    borderRadius: 8,
    border: "1px solid #e6e6e6",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
    width: "100%",
  },

  select: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #e6e6e6",
    fontSize: 14,
  },

  priceBox: {
    background: "#fafaf9",
    border: "1px solid #f0f0f0",
    padding: 14,
    borderRadius: 8,
    textAlign: "center",
  },
  total: { fontSize: 22, fontWeight: 900, color: "#0b6b2b", marginTop: 4 },

  paymentNote: { color: "#666", fontSize: 13 },

  msg: { marginTop: 12, color: "#065f46", fontWeight: 700 },

  confirmBtn: {
    background: "#1f7a3a",
    color: "#fff",
    border: "none",
    padding: "11px 14px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 800,
    flex: 1,
  },
  cancelBtn: {
    background: "transparent",
    border: "1px solid #e6e6e6",
    padding: "10px 12px",
    borderRadius: 8,
    cursor: "pointer",
    color: "#333",
    minWidth: 110,
  },
};
