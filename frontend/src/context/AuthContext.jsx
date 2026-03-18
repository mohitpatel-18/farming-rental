import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);
const USERS_STORAGE_KEY = "farming_users";
const SESSION_STORAGE_KEY = "farming_auth_user";

function readUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || "[]");
  } catch (error) {
    return [];
  }
}

function persistUsers(users) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(SESSION_STORAGE_KEY);
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }, []);

  const value = useMemo(() => ({
    user,
    signup: ({ name, email, password }) => {
      const users = readUsers();
      const normalizedEmail = email.trim().toLowerCase();

      if (users.some((existingUser) => existingUser.email === normalizedEmail)) {
        throw new Error("User with this email already exists.");
      }

      const newUser = {
        id: Date.now(),
        name: name.trim(),
        email: normalizedEmail,
        password,
      };

      persistUsers([...users, newUser]);
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newUser));
      setUser(newUser);
      return newUser;
    },
    login: ({ email, password }) => {
      const normalizedEmail = email.trim().toLowerCase();
      const foundUser = readUsers().find(
        (existingUser) => existingUser.email === normalizedEmail && existingUser.password === password
      );

      if (!foundUser) {
        throw new Error("Invalid email or password.");
      }

      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(foundUser));
      setUser(foundUser);
      return foundUser;
    },
    updateProfile: (updates) => {
      if (!user) {
        throw new Error("Please login to update your profile.");
      }

      const users = readUsers();
      const nextUser = {
        ...user,
        ...updates,
        email: updates.email?.trim().toLowerCase() ?? user.email,
      };

      const duplicateUser = users.find(
        (existingUser) => existingUser.email === nextUser.email && existingUser.id !== user.id
      );

      if (duplicateUser) {
        throw new Error("User with this email already exists.");
      }

      const nextUsers = users.some((existingUser) => existingUser.id === user.id)
        ? users.map((existingUser) => (existingUser.id === user.id ? nextUser : existingUser))
        : [...users, nextUser];

      persistUsers(nextUsers);
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(nextUser));
      setUser(nextUser);
      return nextUser;
    },
    logout: () => {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      setUser(null);
    },
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
