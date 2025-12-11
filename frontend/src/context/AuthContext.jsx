import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("farming_auth_user");
      if (saved) setUser(JSON.parse(saved));
    } catch (e) {
      console.error("Failed to load auth user", e);
    }
  }, []);

  const signup = ({ name, email, password }) => {
    const users = JSON.parse(localStorage.getItem("farming_users") || "[]");
    if (users.find((u) => u.email === email)) {
      throw new Error("User with this email already exists.");
    }
    const newUser = { id: Date.now(), name, email, password };
    users.push(newUser);
    localStorage.setItem("farming_users", JSON.stringify(users));
    localStorage.setItem("farming_auth_user", JSON.stringify(newUser));
    setUser(newUser);
    return newUser;
  };

  const login = ({ email, password }) => {
    const users = JSON.parse(localStorage.getItem("farming_users") || "[]");
    const found = users.find((u) => u.email === email && u.password === password);
    if (!found) {
      throw new Error("Invalid email or password.");
    }
    localStorage.setItem("farming_auth_user", JSON.stringify(found));
    setUser(found);
    return found;
  };

  const logout = () => {
    localStorage.removeItem("farming_auth_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
