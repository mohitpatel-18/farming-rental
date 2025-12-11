// src/context/UserContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

/**
 * Simple in-memory user store for demo.
 * Replace with API calls (fetch/axios) to backend when available.
 */

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null); // logged-in user object or null
  const [users, setUsers] = useState([]); // registered users list (demo)

  // load from localStorage on init (so signup/login persists across reloads)
  useEffect(() => {
    const savedUsers = localStorage.getItem("demo_users");
    const savedCurrent = localStorage.getItem("demo_current_user");
    if (savedUsers) setUsers(JSON.parse(savedUsers));
    if (savedCurrent) setUser(JSON.parse(savedCurrent));
  }, []);

  useEffect(() => {
    localStorage.setItem("demo_users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (user) localStorage.setItem("demo_current_user", JSON.stringify(user));
    else localStorage.removeItem("demo_current_user");
  }, [user]);

  // registerUser: {name,email,password,role}
  function registerUser({ name, email, password, role = "user" }) {
    // simple validation
    if (!name || !email || !password) {
      throw new Error("All fields required");
    }
    // check already exists
    const exists = users.find(u => u.email === email.toLowerCase());
    if (exists) {
      throw new Error("Email already registered");
    }
    const newUser = {
      id: Date.now().toString(),
      name,
      email: email.toLowerCase(),
      password, // NOTE: plaintext for demo only — do NOT store plain passwords in production
      role,
      phone: "",
      address: "",
    };
    const next = [...users, newUser];
    setUsers(next);
    setUser({ ...newUser, password: undefined }); // set current user (omit password)
    return { ...newUser, password: undefined };
  }

  // loginUser: {email,password} -> returns user
  function loginUser({ email, password }) {
    const found = users.find(u => u.email === (email || "").toLowerCase());
    if (!found) throw new Error("User not found");
    if (found.password !== password) throw new Error("Invalid credentials");
    setUser({ ...found, password: undefined });
    return { ...found, password: undefined };
  }

  // logout
  function logout() {
    setUser(null);
  }

  // updateUser: partial fields to update (for profile edit)
  function updateUser(updates = {}) {
    if (!user) throw new Error("No logged in user");
    const updated = { ...user, ...updates };
    // update users array too
    setUsers(prev => prev.map(u => (u.email === user.email ? { ...u, ...updates } : u)));
    setUser(updated);
    return updated;
  }

  // get user by id/email (helper)
  function getUserByEmail(email) {
    return users.find(u => u.email === (email || "").toLowerCase()) || null;
  }

  return (
    <UserContext.Provider value={{
      user,
      users,
      registerUser,
      loginUser,
      logout,
      updateUser,
      getUserByEmail,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) {
    // helpful error if provider not mounted
    throw new Error("useUser must be used inside a <UserProvider>");
  }
  return ctx;
}
