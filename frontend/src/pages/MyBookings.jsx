import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function MyBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
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

      const mine = all.filter((booking) => {
        if (booking.customerEmail && user.email && booking.customerEmail === user.email) return true;
        if (booking.customer && user.phone && booking.customer.phone === user.phone) return true;
        if (booking.customer && user.name && booking.customer.name === user.name) return true;
        return false;
      });

      mine.sort((first, second) => new Date(second.createdAt || 0) - new Date(first.createdAt || 0));
      setBookings(mine);
    } catch {
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
        <p style={subtitle}>Your recent booking requests and their current status.</p>

        {loading ? (
          <div style={empty}>Loading...</div>
        ) : bookings.length === 0 ? (
          <div style={empty}>No bookings found.</div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {bookings.map((booking) => (
              <div key={booking.id} style={card}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 18 }}>{booking.toolTitle}</div>
                      <div style={{ marginTop: 8, color: "#6b7280" }}>Requested: {formatDate(booking.createdAt)}</div>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <StatusBadge status={booking.status} />
                    </div>
                  </div>

                  <div style={{ marginTop: 12, display: "grid", gap: 6 }}>
                    <div style={metaRow}><div style={metaLabel}>Name</div><div style={metaValue}>{booking.customer?.name || "—"}</div></div>
                    <div style={metaRow}><div style={metaLabel}>Phone</div><div style={metaValue}>{booking.customer?.phone || "—"}</div></div>
                    <div style={metaRow}><div style={metaLabel}>Address</div><div style={metaValue}>{booking.customer?.address || "—"}</div></div>
                    <div style={metaRow}><div style={metaLabel}>Days</div><div style={metaValue}>{booking.days ?? 1}</div></div>
                    <div style={metaRow}><div style={metaLabel}>Total</div><div style={{ ...metaValue, fontWeight: 800, color: "#1f7a3a" }}>₹{booking.totalPrice ?? booking.amount ?? 0}</div></div>
                  </div>

                  <div style={{ marginTop: 12 }}>
                    {booking.status === "approved" && (
                      <div style={noticeSuccess}>
                        Your booking is confirmed. Contact owner: <strong style={{ marginLeft: 6 }}>{booking.ownerName || booking.ownerEmail || "Owner"}</strong>
                        <div style={{ marginTop: 6 }}>Phone: <strong>{booking.ownerPhone || "Not available"}</strong></div>
                      </div>
                    )}

                    {booking.status === "rejected" && (
                      <div style={noticeReject}>
                        Booking was cancelled by owner.
                      </div>
                    )}

                    {booking.status === "pending" && (
                      <div style={noticePending}>
                        Waiting for owner confirmation.
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

function StatusBadge({ status }) {
  const map = {
    pending: { text: "Pending", bg: "#eff6ff", color: "#1d4ed8" },
    approved: { text: "Confirmed", bg: "#ecfdf5", color: "#065f46" },
    rejected: { text: "Cancelled", bg: "#fff1f2", color: "#991b1b" },
  };
  const statusStyle = map[status] || { text: status || "Unknown", bg: "#f8fafc", color: "#374151" };
  return <div style={{ background: statusStyle.bg, color: statusStyle.color, padding: "6px 10px", borderRadius: 999, fontWeight: 700, display: "inline-block" }}>{statusStyle.text}</div>;
}

function formatDate(value) {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

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
