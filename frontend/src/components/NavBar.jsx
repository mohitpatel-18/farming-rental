import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SignupModal from "./SignupModal";
import LoginModal from "./LoginModal";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [showSignup, setShowSignup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    setShowProfileMenu(false);
    navigate(path);
  };

  const handleLogout = () => {
    logout?.();
    setShowProfileMenu(false);
    navigate("/");
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        <Link to="/" style={styles.brand}>
          <img src="/logo.png" alt="logo" style={{ width: 44, marginRight: 10 }} />

          <div>
            <div style={{ fontWeight: 700, color: "#1e3a2e", fontSize: 18 }}>
              Farming Rental
            </div>
            <div style={{ fontSize: 12, color: "#6b6b6b" }}>
              Rent the right farming equipment
            </div>
          </div>
        </Link>

        <div style={styles.links}>
          <Link to="/" style={styles.link}>Home</Link>
          <Link to="/tools" style={styles.link}>Tools</Link>
          <Link to="/contact" style={styles.link}>Contact</Link>
        </div>
      </div>

      <div style={styles.actions}>
        {!user && (
          <>
            <button style={styles.btnOutline} onClick={() => setShowLogin(true)}>
              Login
            </button>
            <button style={styles.btnPrimary} onClick={() => setShowSignup(true)}>
              Sign up
            </button>
          </>
        )}

        {user && (
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowProfileMenu((s) => !s)}
              style={styles.profileBtn}
              title={user.name}
              aria-haspopup="true"
              aria-expanded={showProfileMenu}
            >
              <div style={styles.avatar}>{user.name ? user.name[0].toUpperCase() : "U"}</div>
              <div style={{ marginLeft: 8 }}>{user.name ? user.name.split(" ")[0] : "User"}</div>
            </button>

            {showProfileMenu && (
              <div style={styles.dropdown}>
                <div
                  style={styles.ddItem}
                  onClick={() => handleNavigate("/profile/bookings")}
                >
                  My Bookings
                </div>

                <div
                  style={styles.ddItem}
                  onClick={() => handleNavigate("/profile/my-tools")}
                >
                  My Tools
                </div>

                <div
                  style={styles.ddItem}
                  onClick={() => handleNavigate("/profile/requests")}
                >
                  Rent Requests
                </div>

                <div
                  style={{ ...styles.ddItem, borderTop: "1px solid #f0f0f0" }}
                  onClick={handleLogout}
                >
                  Logout
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <SignupModal open={showSignup} onClose={() => setShowSignup(false)} />
      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 28px",
    borderBottom: "1px solid #eee",
    background: "#fff",
    position: "sticky",
    top: 0,
    zIndex: 20,
  },
  left: { display: "flex", alignItems: "center", gap: 18 },
  brand: { display: "flex", alignItems: "center", textDecoration: "none" },
  links: { display: "flex", gap: 12, marginLeft: 16 },
  link: { textDecoration: "none", color: "#333", padding: "6px 8px" },
  actions: { display: "flex", alignItems: "center", gap: 8 },
  btnPrimary: {
    background: "#1f7a3a",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: 6,
  },
  btnOutline: {
    background: "transparent",
    border: "1px solid #ccc",
    padding: "8px 12px",
    borderRadius: 6,
  },
  profileBtn: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    border: "1px solid #eee",
    padding: "6px 10px",
    borderRadius: 10,
    background: "#fff",
    cursor: "pointer",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: "#1f7a3a",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
  },
  dropdown: {
    position: "absolute",
    right: 0,
    marginTop: 8,
    background: "#fff",
    border: "1px solid #eee",
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
    borderRadius: 8,
    overflow: "hidden",
    minWidth: 160,
  },
  ddItem: {
    padding: "10px 14px",
    cursor: "pointer",
    whiteSpace: "nowrap",
    color: "#333",
  },
};
