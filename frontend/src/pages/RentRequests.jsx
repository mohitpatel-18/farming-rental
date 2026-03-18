import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function RentRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    loadRequests();
  }, [user]);

  function loadRequests() {
    const all = JSON.parse(localStorage.getItem("farming_bookings") || "[]");
    const mine = all.filter((booking) => booking.ownerEmail === user?.email);

    mine.forEach((booking) => {
      if (!booking.status) {
        booking.status = "pending";
      }
    });

    mine.sort((first, second) => {
      if (!first.createdAt || !second.createdAt) return 0;
      return new Date(second.createdAt) - new Date(first.createdAt);
    });

    setRequests(mine);
  }

  function updateBooking(id, newStatus) {
    let all = JSON.parse(localStorage.getItem("farming_bookings") || "[]");

    all = all.map((booking) => {
      if (booking.id !== id) {
        return booking;
      }

      if (booking.status === "approved") {
        return booking;
      }

      return {
        ...booking,
        status: newStatus,
        ownerPhone: user?.phone || booking.ownerPhone || "Not Provided",
        ownerName: user?.name || booking.ownerName || "",
        updatedAt: new Date().toISOString(),
      };
    });

    localStorage.setItem("farming_bookings", JSON.stringify(all));
    loadRequests();
  }

  function isActionable(status) {
    return !status || status === "pending";
  }

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>Rent Requests</h2>
      <p style={styles.sub}>
        Requests from customers for your tools. Approve or reject them.
      </p>

      <div style={{ display: "grid", gap: 18 }}>
        {requests.length === 0 && <div style={styles.empty}>No rent requests yet.</div>}

        {requests.map((request) => (
          <div key={request.id} style={styles.card}>
            <div style={styles.cardTop}>
              <div>
                <div style={styles.tool}>{request.toolTitle || "Tool"}</div>
                <div style={styles.date}>
                  Requested: {request.createdAt ? new Date(request.createdAt).toLocaleString() : "—"}
                </div>
              </div>

              <div>
                <span
                  style={{
                    ...styles.status,
                    background:
                      request.status === "approved"
                        ? "#d1fae5"
                        : request.status === "rejected"
                        ? "#fee2e2"
                        : "#dbeafe",
                    color:
                      request.status === "approved"
                        ? "#065f46"
                        : request.status === "rejected"
                        ? "#991b1b"
                        : "#1e40af",
                  }}
                >
                  {(request.status || "pending").toString().toUpperCase()}
                </span>
              </div>
            </div>

            <div style={styles.infoBox}>
              <div><b>Name:</b> {request.customer?.name || "—"}</div>
              <div><b>Phone:</b> {request.customer?.phone || "—"}</div>
              <div><b>Address:</b> {request.customer?.address || "—"}</div>
              <div><b>Days:</b> {request.days ?? "—"}</div>
              <div style={{ fontWeight: 700, marginTop: 6 }}>
                Total: ₹{request.totalPrice ?? request.amount ?? 0}
              </div>
            </div>

            <div style={styles.actions}>
              {isActionable(request.status) && request.status !== "approved" && (
                <>
                  <button
                    style={styles.accept}
                    onClick={() => {
                      if (!confirm("Approve this booking? This cannot be undone.")) return;
                      updateBooking(request.id, "approved");
                    }}
                  >
                    Accept
                  </button>

                  <button
                    style={styles.reject}
                    onClick={() => {
                      if (!confirm("Reject this booking? This will mark it as cancelled.")) return;
                      updateBooking(request.id, "rejected");
                    }}
                  >
                    Reject
                  </button>
                </>
              )}

              {request.status === "approved" && (
                <div style={styles.alreadyApproved}>Already Approved</div>
              )}

              {request.status === "rejected" && (
                <div style={styles.rejectedText}>Rejected</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: "30px 60px",
    background: "#fafafa",
    minHeight: "100vh",
  },
  title: { fontSize: 28, fontWeight: 800, marginBottom: 6 },
  sub: { color: "#555", marginBottom: 20 },
  empty: { color: "#666", padding: 18, background: "#fff", borderRadius: 8 },
  card: {
    background: "#fff",
    padding: 20,
    borderRadius: 12,
    border: "1px solid #eee",
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
  },
  cardTop: { display: "flex", justifyContent: "space-between", marginBottom: 12 },
  tool: { fontSize: 20, fontWeight: 700 },
  date: { color: "#666", fontSize: 13, marginTop: 3 },
  status: { padding: "6px 12px", borderRadius: 8, fontWeight: 700, fontSize: 12 },
  infoBox: { padding: "12px 0", lineHeight: "26px", color: "#333" },
  actions: { display: "flex", gap: 10, marginTop: 10 },
  accept: { padding: "10px 18px", background: "#059669", border: "none", borderRadius: 8, color: "#fff", cursor: "pointer", fontWeight: 600 },
  reject: { padding: "10px 18px", background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: 8, color: "#b91c1c", cursor: "pointer", fontWeight: 600 },
  alreadyApproved: { padding: "10px 18px", background: "#d1fae5", borderRadius: 8, fontWeight: 700, color: "#065f46" },
  rejectedText: { padding: "10px 18px", background: "#fee2e2", borderRadius: 8, fontWeight: 700, color: "#991b1b" },
};
