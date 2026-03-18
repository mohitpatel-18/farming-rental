import React, { useEffect, useMemo, useState } from "react";

const AUTH_STORAGE_KEY = "farming_auth_user";
const BOOKINGS_STORAGE_KEY = "farming_bookings";

export default function RentModal({ open, onClose, onBooked, tool }) {
  const [customer, setCustomer] = useState({ name: "", phone: "", address: "", email: "" });
  const [days, setDays] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!open) {
      setMessage("");
      setLoading(false);
      setDays(1);
      return;
    }

    try {
      const authUser = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) || "null");
      if (authUser) {
        setCustomer((currentCustomer) => ({
          ...currentCustomer,
          name: authUser.name || currentCustomer.name,
          phone: authUser.phone || currentCustomer.phone,
          email: authUser.email || currentCustomer.email,
          address: authUser.address || currentCustomer.address,
        }));
      }
    } catch {
      // Ignore invalid storage values and let the renter fill the form manually.
    }
  }, [open]);

  const title = tool?.title || tool?.name || "Tool";
  const pricePerDay = Number(tool?.pricePerDay || tool?.pricePerHour || tool?.hourly || tool?.price || 0);
  const total = useMemo(() => pricePerDay * Number(days || 1), [days, pricePerDay]);

  if (!open || !tool) {
    return null;
  }

  function saveBooking() {
    const existingBookings = JSON.parse(localStorage.getItem(BOOKINGS_STORAGE_KEY) || "[]");
    const booking = {
      id: Date.now(),
      toolId: tool.id,
      userId: customer.email || customer.phone || customer.name,
      toolTitle: title,
      ownerEmail: tool.ownerEmail,
      ownerName: tool.ownerName,
      ownerPhone: tool.ownerPhone,
      customer,
      customerEmail: customer.email,
      days,
      totalPrice: total,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    existingBookings.unshift(booking);
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(existingBookings));
    return booking;
  }

  async function handleConfirm() {
    if (!customer.name.trim() || !customer.phone.trim() || !customer.address.trim()) {
      setMessage("Please enter name, phone and address.");
      return;
    }

    setMessage("");
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 700));

    try {
      saveBooking();
      onBooked?.();
      setLoading(false);
      setMessage("Booking saved successfully.");
      setTimeout(() => {
        setMessage("");
        onClose();
      }, 900);
    } catch {
      setLoading(false);
      setMessage("Something went wrong. Try again.");
    }
  }

  return (
    <div style={styles.overlay} onMouseDown={onClose}>
      <div style={styles.card} onMouseDown={(event) => event.stopPropagation()}>
        <div style={styles.header}>
          <div>
            <div style={styles.title}>
              {title} — <span style={styles.subTitle}>Book</span>
            </div>
            <div style={styles.small}>Fill renter details, choose the number of days, and confirm your booking.</div>
          </div>
          <button onClick={onClose} style={styles.close}>✕</button>
        </div>

        <div style={styles.content}>
          <div style={styles.left}>
            <input style={styles.input} placeholder="Name" value={customer.name} onChange={(event) => setCustomer({ ...customer, name: event.target.value })} />
            <input style={styles.input} placeholder="Phone" value={customer.phone} onChange={(event) => setCustomer({ ...customer, phone: event.target.value })} />
            <input style={styles.input} placeholder="Email (optional)" value={customer.email} onChange={(event) => setCustomer({ ...customer, email: event.target.value })} />
            <textarea style={{ ...styles.input, minHeight: 84, resize: "vertical" }} placeholder="Address" value={customer.address} onChange={(event) => setCustomer({ ...customer, address: event.target.value })} />
            <div style={{ marginTop: 8 }}>
              <label style={{ display: "block", marginBottom: 6, fontWeight: 700 }}>Booking duration</label>
              <select style={styles.select} value={days} onChange={(event) => setDays(Number(event.target.value))}>
                {Array.from({ length: 30 }, (_, index) => index + 1).map((value) => (
                  <option key={value} value={value}>{value} day{value > 1 ? "s" : ""}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={styles.right}>
            <div style={styles.priceBox}>
              <div style={{ color: "#666", marginBottom: 6 }}>Total price</div>
              <div style={styles.total}>₹{total}</div>
              <div style={{ color: "#888", marginTop: 6, fontSize: 13 }}>({days} × ₹{pricePerDay}/day)</div>
            </div>

            <div style={{ marginTop: 16, color: "#475569", fontSize: 14, lineHeight: 1.6 }}>
              Submit your booking request now. The owner can review and confirm it from their requests page.
            </div>

            {message && <div style={styles.msg}>{message}</div>}

            <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
              <button onClick={handleConfirm} disabled={loading} style={styles.confirmBtn}>{loading ? "Saving..." : "Book Now"}</button>
              <button onClick={onClose} style={styles.cancelBtn}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
  content: { display: "flex", gap: 18, padding: 18, flexWrap: "wrap" },
  left: { flex: "1 1 320px", display: "flex", flexDirection: "column", gap: 10 },
  right: { flex: "0 0 260px", display: "flex", flexDirection: "column" },
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
