import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SignupModal from "./SignupModal";
import LoginModal from "./LoginModal";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

const links = [
  { to: "/", label: "Home" },
  { to: "/tools", label: "Tools" },
  { to: "/contact", label: "Contact" },
  { to: "/reviews", label: "Reviews" },
];

export default function Navbar() {
  const [showSignup, setShowSignup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path) => {
    setShowProfileMenu(false);
    setMobileOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    logout?.();
    setShowProfileMenu(false);
    setMobileOpen(false);
    navigate("/");
  };

  const navLinkClass = (to) =>
    `rounded-full px-4 py-2 text-sm font-medium transition ${location.pathname === to ? "bg-green-100 text-green-800" : "text-slate-600 hover:bg-green-50 hover:text-green-800"}`;

  return (
    <>
      <nav className="sticky top-0 z-30 border-b border-green-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Farming Rental logo" className="h-12 w-12 rounded-2xl border border-green-100 bg-green-50 p-2" />
            <div>
              <div className="text-lg font-semibold tracking-tight text-slate-900">Farming Rental</div>
              <div className="text-sm text-slate-500">Reliable equipment for every season</div>
            </div>
          </Link>

          <div className="hidden items-center gap-2 md:flex">
            {links.map((item) => (
              <Link key={item.to} to={item.to} className={navLinkClass(item.to)}>
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            {!user ? (
              <>
                <button
                  type="button"
                  className="rounded-full border border-green-200 px-4 py-2 text-sm font-semibold text-green-800 transition hover:bg-green-50"
                  onClick={() => setShowLogin(true)}
                >
                  Login
                </button>
                <button
                  type="button"
                  className="rounded-full bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800"
                  onClick={() => setShowSignup(true)}
                >
                  Sign up
                </button>
              </>
            ) : (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowProfileMenu((value) => !value)}
                  className="flex items-center gap-3 rounded-full border border-green-100 bg-white px-3 py-2 shadow-sm transition hover:border-green-200"
                  aria-haspopup="true"
                  aria-expanded={showProfileMenu}
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-700 text-sm font-bold text-white">
                    {user.name ? user.name[0].toUpperCase() : "U"}
                  </span>
                  <span className="text-sm font-semibold text-slate-700">{user.name ? user.name.split(" ")[0] : "User"}</span>
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-3 min-w-[200px] overflow-hidden rounded-2xl border border-green-100 bg-white shadow-xl">
                    {[
                      ["My Bookings", "/profile/bookings"],
                      ["My Tools", "/profile/my-tools"],
                      ["Rent Requests", "/profile/requests"],
                    ].map(([label, path]) => (
                      <button
                        key={path}
                        type="button"
                        className="block w-full px-4 py-3 text-left text-sm font-medium text-slate-600 transition hover:bg-green-50 hover:text-green-800"
                        onClick={() => handleNavigate(path)}
                      >
                        {label}
                      </button>
                    ))}
                    <button
                      type="button"
                      className="block w-full border-t border-green-100 px-4 py-3 text-left text-sm font-medium text-slate-600 transition hover:bg-green-50 hover:text-green-800"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-green-200 text-green-800 md:hidden"
            onClick={() => setMobileOpen((value) => !value)}
            aria-label="Toggle menu"
          >
            <span className="text-xl">☰</span>
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t border-green-100 bg-white px-4 py-4 md:hidden sm:px-6">
            <div className="flex flex-col gap-2">
              {links.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={navLinkClass(item.to)}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="mt-4 flex flex-col gap-3">
              {!user ? (
                <>
                  <button
                    type="button"
                    className="rounded-full border border-green-200 px-4 py-2 text-sm font-semibold text-green-800"
                    onClick={() => {
                      setMobileOpen(false);
                      setShowLogin(true);
                    }}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    className="rounded-full bg-green-700 px-4 py-2.5 text-sm font-semibold text-white"
                    onClick={() => {
                      setMobileOpen(false);
                      setShowSignup(true);
                    }}
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  <button type="button" className="rounded-full border border-green-200 px-4 py-2 text-left text-sm font-semibold text-slate-700" onClick={() => handleNavigate("/profile/bookings")}>
                    My Bookings
                  </button>
                  <button type="button" className="rounded-full border border-green-200 px-4 py-2 text-left text-sm font-semibold text-slate-700" onClick={() => handleNavigate("/profile/my-tools")}>
                    My Tools
                  </button>
                  <button type="button" className="rounded-full border border-green-200 px-4 py-2 text-left text-sm font-semibold text-slate-700" onClick={() => handleNavigate("/profile/requests")}>
                    Rent Requests
                  </button>
                  <button type="button" className="rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white" onClick={handleLogout}>
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <SignupModal open={showSignup} onClose={() => setShowSignup(false)} />
      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
}
