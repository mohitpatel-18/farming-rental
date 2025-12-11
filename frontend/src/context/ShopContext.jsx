import React, { createContext, useContext, useEffect, useState } from "react";

const ShopContext = createContext(null);

export function ShopProvider({ children }) {
  // read initial from localStorage
  const [tools, setTools] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("farming_tools") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    // persist every change
    try {
      localStorage.setItem("farming_tools", JSON.stringify(tools));
    } catch (e) {
      console.error("Failed to persist tools", e);
    }
  }, [tools]);

  const addTool = (tool) => {
    const newTool = { id: Date.now(), ...tool };
    setTools((t) => [newTool, ...t]);
  };

  const removeTool = (id) => {
    setTools((t) => t.filter((x) => x.id !== id));
  };

  return (
    <ShopContext.Provider value={{ tools, addTool, removeTool }}>
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) return { tools: [], addTool: () => {}, removeTool: () => {} };
  return ctx;
}
