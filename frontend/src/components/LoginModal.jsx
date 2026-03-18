import React, { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";

function AuthIcon({ children }) {
  return <span className="auth-input__icon">{children}</span>;
}

export default function LoginModal({ open, onClose, onSwitchToSignup }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const isFormReady = useMemo(() => form.email.trim() && form.password.trim(), [form.email, form.password]);

  if (!open) return null;

  const closeModal = () => {
    setError(null);
    setShowPassword(false);
    onClose();
  };

  const submit = (e) => {
    e.preventDefault();
    setError(null);
    try {
      login(form);
      closeModal();
      setForm({ email: "", password: "" });
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="auth-modal__overlay" role="dialog" aria-modal="true" aria-labelledby="login-modal-title">
      <div className="auth-modal">
        <button type="button" className="auth-modal__close" onClick={closeModal} aria-label="Close login form">
          ×
        </button>

        <div className="auth-modal__badge">🌿 Farming Rental</div>
        <h2 id="login-modal-title" className="auth-modal__title">Welcome Back</h2>
        <p className="auth-modal__subtitle">Login to manage your rentals, tools, and bookings in one place.</p>

        <form onSubmit={submit} className="auth-form">
          <label className="auth-field">
            <span className="auth-field__label">Email Address</span>
            <span className="auth-input__wrapper">
              <AuthIcon>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M4 6.5h16v11H4z" />
                  <path d="m5 8 7 5 7-5" />
                </svg>
              </AuthIcon>
              <input
                required
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="auth-input"
              />
            </span>
          </label>

          <label className="auth-field">
            <span className="auth-field__label">Password</span>
            <span className="auth-input__wrapper">
              <AuthIcon>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M7 10V7a5 5 0 0 1 10 0v3" />
                  <rect x="5" y="10" width="14" height="10" rx="2" />
                  <path d="M12 14v2" />
                </svg>
              </AuthIcon>
              <input
                required
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="auth-input auth-input--with-toggle"
              />
              <button
                type="button"
                className="auth-input__toggle"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </span>
          </label>

          <div className="auth-form__meta">
            <button type="button" className="auth-link auth-link--ghost">Forgot Password?</button>
          </div>

          {error && <div className="auth-alert auth-alert--error">{error}</div>}

          <button type="submit" className="auth-button" disabled={!isFormReady}>
            Login
          </button>

          <p className="auth-form__footer">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              className="auth-link"
              onClick={() => {
                closeModal();
                onSwitchToSignup?.();
              }}
            >
              Sign Up
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
