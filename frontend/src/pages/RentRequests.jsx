// src/pages/RentRequests.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function RentRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    loadRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  function loadRequests() {
    const all = JSON.parse(localStorage.getItem("farming_bookings") || "[]");
    const mine = all.filter((b) => b.ownerEmail === user?.email);

    // keep existing statuses, but ensure there is some value
    mine.forEach((b) => {
      if (!b.status) b.status = "pending";
    });

    // newest first (if createdAt missing, keep order)
    mine.sort((a, b) => {
      if (!a.createdAt || !b.createdAt) return 0;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    setRequests(mine);
  }

  function updateBooking(id, newStatus) {
    let all = JSON.parse(localStorage.getItem("farming_bookings") || "[]");

    all = all.map((b) => {
      if (b.id !== id) return b;

      // once approved, do not change it
      if (b.status === "approved") return b;

      return {
        ...b,
        status: newStatus,
        ownerPhone: user?.phone || b.ownerPhone || "Not Provided",
        ownerName: user?.name || b.ownerName || "",
        updatedAt: new Date().toISOString(),
      };
    });

    localStorage.setItem("farming_bookings", JSON.stringify(all));
    loadRequests();
  }

  // treat these statuses as "actionable" (show approve/reject)
  function isActionable(status) {
    return (
      status === "pending" ||
      status === "pending_owner_approval" ||
      status === "paid" ||
      status === "cash_pending" ||
      status === undefined ||
      status === null
    );
  }

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>Rent Requests</h2>
      <p style={styles.sub}>
        Requests from customers for your tools. Approve or reject them.
      </p>

      <div style={{ display: "grid", gap: 18 }}>
        {requests.length === 0 && <div style={styles.empty}>No rent requests yet.</div>}

        {requests.map((r) => (
          <div key={r.id} style={styles.card}>
            <div style={styles.cardTop}>
              <div>
                <div style={styles.tool}>{r.toolTitle || "Tool"}</div>
                <div style={styles.date}>
                  Requested: {r.createdAt ? new Date(r.createdAt).toLocaleString() : "—"}
                </div>
              </div>

              <div>
                <span
                  style={{
                    ...styles.status,
                    background:
                      r.status === "approved"
                        ? "#d1fae5"
                        : r.status === "rejected"
                        ? "#fee2e2"
                        : "#dbeafe",
                    color:
                      r.status === "approved"
                        ? "#065f46"
                        : r.status === "rejected"
                        ? "#991b1b"
                        : "#1e40af",
                  }}
                >
                  {(r.status || "PENDING").toString().toUpperCase()}
                </span>
              </div>
            </div>

            <div style={styles.infoBox}>
              <div><b>Name:</b> {r.customer?.name || "—"}</div>
              <div><b>Phone:</b> {r.customer?.phone || "—"}</div>
              <div><b>Address:</b> {r.customer?.address || "—"}</div>
              <div><b>Hours:</b> {r.hours ?? "—"}</div>
              <div style={{ fontWeight: 700, marginTop: 6 }}>
                Total: ₹{r.amount ?? 0}
              </div>
            </div>

            <div style={styles.actions}>
              {isActionable(r.status) && r.status !== "approved" && (
                <>
                  <button
                    style={styles.accept}
                    onClick={() => {
                      if (!confirm("Approve this booking? This cannot be undone.")) return;
                      updateBooking(r.id, "approved");
                    }}
                  >
                    Accept
                  </button>

                  <button
                    style={styles.reject}
                    onClick={() => {
                      if (!confirm("Reject this booking? This will mark it as cancelled.")) return;
                      updateBooking(r.id, "rejected");
                    }}
                  >
                    Reject
                  </button>
                </>
              )}

              {r.status === "approved" && (
                <div style={styles.alreadyApproved}>Already Approved</div>
              )}

              {r.status === "rejected" && (
                <div style={styles.rejectedText}>Rejected</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* styles */
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
