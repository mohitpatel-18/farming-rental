// src/pages/AdminLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext";

export default function AdminLogin() {
  const { login } = useShop();            // use login from context
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    const res = login(email, password);  // login is synchronous in our context
    if (!res.success) {
      setError(res.message || "Login failed");
      return;
    }
    // success -> user auto-set in context; navigate to admin area or profile
    navigate("/profile");
  }

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white border rounded">
      <h2 className="text-2xl font-bold mb-4">Admin Login</h2>

      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2 bg-blue-50"
        />

        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />

        {error && <div className="text-sm text-red-600">{error}</div>}

        <button type="submit" className="w-full py-3 bg-yellow-600 text-white rounded">Admin Sign In</button>
      </form>
    </div>
  );
}
