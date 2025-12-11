// src/pages/MyBookings.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

/**
 * MyBookings.jsx
 * Shows bookings for the logged-in customer.
 * Matches bookings by customerEmail, or falls back to customer.phone / customer.name.
 */

export default function MyBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  function load() {
    setLoading(true);
    try {
      const all = JSON.parse(localStorage.getItem("farming_bookings") || "[]");
      if (!user) {
        setBookings([]);
        setLoading(false);
        return;
      }

      // primary match by email if available, fallback by phone or name
      const mine = all.filter((b) => {
        if (b.customerEmail && user.email && b.customerEmail === user.email) return true;
        if (b.customer && user.phone && b.customer.phone === user.phone) return true;
        if (b.customer && user.name && b.customer.name === user.name) return true;
        return false;
      });

      mine.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setBookings(mine);
    } catch (e) {
      console.error("load bookings error", e);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return <div style={wrap}><div style={empty}>Please login to see your bookings.</div></div>;
  }

  return (
    <div style={wrap}>
      <div style={container}>
        <h2 style={title}>My Bookings</h2>
        <p style={subtitle}>Your recent booking requests and their status.</p>

        {loading ? (
          <div style={empty}>Loading...</div>
        ) : bookings.length === 0 ? (
          <div style={empty}>No bookings found.</div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {bookings.map((b) => (
              <div key={b.id} style={card}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 18 }}>{b.toolTitle}</div>
                      <div style={{ marginTop: 8, color: "#6b7280" }}>Requested: {formatDate(b.createdAt)}</div>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <StatusBadge status={b.status} />
                      {b.method && <div style={{ marginTop: 8, fontSize: 13, color: "#6b7280" }}>{b.method === "upi" ? "Paid (UPI)" : b.method === "cash" ? "Pay cash" : b.method}</div>}
                    </div>
                  </div>

                  <div style={{ marginTop: 12, display: "grid", gap: 6 }}>
                    <div style={metaRow}><div style={metaLabel}>Name</div><div style={metaValue}>{b.customer?.name || "—"}</div></div>
                    <div style={metaRow}><div style={metaLabel}>Phone</div><div style={metaValue}>{b.customer?.phone || "—"}</div></div>
                    <div style={metaRow}><div style={metaLabel}>Address</div><div style={metaValue}>{b.customer?.address || "—"}</div></div>
                    <div style={metaRow}><div style={metaLabel}>Hours</div><div style={metaValue}>{b.hours}</div></div>
                    <div style={metaRow}><div style={metaLabel}>Total</div><div style={{ ...metaValue, fontWeight: 800, color: "#1f7a3a" }}>₹{b.amount}</div></div>
                  </div>

                  <div style={{ marginTop: 12 }}>
                    {b.status === "approved" && (
                      <div style={noticeSuccess}>
                        Your booking is confirmed. Contact owner: <strong style={{ marginLeft: 6 }}>{b.ownerName || b.ownerEmail || "Owner"}</strong>
                        <div style={{ marginTop: 6 }}>Phone: <strong>{b.ownerPhone || "Not available"}</strong></div>
                      </div>
                    )}

                    {b.status === "rejected" && (
                      <div style={noticeReject}>
                        Booking was cancelled by owner.
                      </div>
                    )}

                    {b.status === "pending_owner_approval" && (
                      <div style={noticePending}>
                        Waiting for owner confirmation.
                      </div>
                    )}

                    {b.status === "cash_pending" && (
                      <div style={noticePending}>
                        Booking saved (pay cash). Waiting for owner to approve.
                      </div>
                    )}

                    {b.status === "paid" && (
                      <div style={noticeSuccess}>
                        Payment received — booking confirmed.
                        {b.ownerPhone && <div style={{ marginTop: 6 }}>Owner phone: <strong>{b.ownerPhone}</strong></div>}
                      </div>
                    )}
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

/* helpers & small components */

function StatusBadge({ status }) {
  const map = {
    pending_owner_approval: { text: "Pending", bg: "#f3e8ff", color: "#7c3aed" },
    cash_pending: { text: "cash_pending", bg: "#fff7ed", color: "#92400e" },
    approved: { text: "Confirmed", bg: "#ecfdf5", color: "#065f46" },
    rejected: { text: "Cancelled", bg: "#fff1f2", color: "#991b1b" },
    paid: { text: "Paid", bg: "#ecfdf5", color: "#065f46" }
  };
  const s = map[status] || { text: status || "Unknown", bg: "#f8fafc", color: "#374151" };
  return <div style={{ background: s.bg, color: s.color, padding: "6px 10px", borderRadius: 999, fontWeight: 700, display: "inline-block" }}>{s.text}</div>;
}

function formatDate(d) {
  if (!d) return "-";
  try {
    return new Date(d).toLocaleString();
  } catch {
    return d;
  }
}

/* styles */
const wrap = { padding: 20, minHeight: "70vh", background: "#fafafa" };
const container = { maxWidth: 1100, margin: "0 auto" };
const title = { margin: "6px 0 4px 0", fontSize: 22, fontWeight: 800, color: "#0f172a" };
const subtitle = { margin: "0 0 10px 0", color: "#6b7280" };
const empty = { padding: 18, color: "#6b7280", background: "#fff", borderRadius: 8 };
const card = { padding: 18, borderRadius: 12, background: "#fff", border: "1px solid #eee", boxShadow: "0 8px 20px rgba(2,6,23,0.03)" };
const metaRow = { display: "flex", gap: 12, alignItems: "center" };
const metaLabel = { width: 90, color: "#6b7280", fontWeight: 700, fontSize: 13 };
const metaValue = { color: "#111827", fontSize: 14, wordBreak: "break-word" };

const noticeSuccess = { marginTop: 10, padding: 12, background: "#ecfdf5", borderRadius: 8, border: "1px solid #bbf7d0", color: "#064e3b" };
const noticeReject = { marginTop: 10, padding: 12, background: "#fff1f2", borderRadius: 8, border: "1px solid #fecaca", color: "#7f1d1d" };
const noticePending = { marginTop: 10, padding: 12, background: "#f8fafc", borderRadius: 8, border: "1px solid #e6e6e6", color: "#374151" };
