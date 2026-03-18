import React, { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";

function AuthIcon({ children }) {
  return <span className="auth-input__icon">{children}</span>;
}

function getStrengthLabel(password) {
  if (!password) return { label: "Add a password", tone: "empty", width: "16%" };
  if (password.length < 6) return { label: "Weak", tone: "weak", width: "33%" };
  if (password.length < 9 || !/[A-Z]/.test(password) || !/\d/.test(password)) {
    return { label: "Medium", tone: "medium", width: "66%" };
  }
  return { label: "Strong", tone: "strong", width: "100%" };
}

export default function SignupModal({ open, onClose, onSwitchToLogin }) {
  const { signup } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordStrength = useMemo(() => getStrengthLabel(form.password), [form.password]);
  const passwordsMatch = !form.confirmPassword || form.password === form.confirmPassword;
  const isFormReady = useMemo(
    () => form.name.trim() && form.email.trim() && form.password.trim() && form.confirmPassword.trim() && passwordsMatch,
    [form, passwordsMatch]
  );

  if (!open) return null;

  const closeModal = () => {
    setError(null);
    setShowPassword(false);
    setShowConfirmPassword(false);
    onClose();
  };

  const submit = (e) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      signup({ name: form.name, email: form.email, password: form.password });
      closeModal();
      setForm({ name: "", email: "", password: "", confirmPassword: "" });
    } catch (err) {
      setError(err.message || "Failed to create account");
    }
  };

  return (
    <div className="auth-modal__overlay" role="dialog" aria-modal="true" aria-labelledby="signup-modal-title">
      <div className="auth-modal auth-modal--wide">
        <button type="button" className="auth-modal__close" onClick={closeModal} aria-label="Close signup form">
          ×
        </button>

        <div className="auth-modal__badge">🌱 Join the community</div>
        <h2 id="signup-modal-title" className="auth-modal__title">Create Your Account</h2>
        <p className="auth-modal__subtitle">Sign up to access modern, reliable farming equipment whenever you need it.</p>

        <form onSubmit={submit} className="auth-form">
          <label className="auth-field">
            <span className="auth-field__label">Full Name</span>
            <span className="auth-input__wrapper">
              <AuthIcon>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" />
                  <path d="M5 20a7 7 0 0 1 14 0" />
                </svg>
              </AuthIcon>
              <input
                required
                placeholder="Enter your full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="auth-input"
              />
            </span>
          </label>

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
                placeholder="Create a password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="auth-input auth-input--with-toggle"
              />
              <button type="button" className="auth-input__toggle" onClick={() => setShowPassword((value) => !value)}>
                {showPassword ? "Hide" : "Show"}
              </button>
            </span>
            <div className="password-strength">
              <div className="password-strength__track">
                <span className={`password-strength__fill password-strength__fill--${passwordStrength.tone}`} style={{ width: passwordStrength.width }} />
              </div>
              <span className={`password-strength__text password-strength__text--${passwordStrength.tone}`}>{passwordStrength.label}</span>
            </div>
          </label>

          <label className="auth-field">
            <span className="auth-field__label">Confirm Password</span>
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
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                className="auth-input auth-input--with-toggle"
              />
              <button type="button" className="auth-input__toggle" onClick={() => setShowConfirmPassword((value) => !value)}>
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </span>
            {!passwordsMatch && <span className="auth-helper auth-helper--error">Passwords must match.</span>}
          </label>

          {error && <div className="auth-alert auth-alert--error">{error}</div>}

          <button type="submit" className="auth-button" disabled={!isFormReady}>
            Create Account
          </button>

          <p className="auth-form__footer">
            Already have an account?{" "}
            <button
              type="button"
              className="auth-link"
              onClick={() => {
                closeModal();
                onSwitchToLogin?.();
              }}
            >
              Login
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
