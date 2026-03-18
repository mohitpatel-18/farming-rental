import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { buildTool, normalizeTool } from "../utils/toolUtils";

const ShopContext = createContext(null);
const STORAGE_KEY = "farming_tools";

function readTools() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return parsed.map(normalizeTool);
  } catch {
    return [];
  }
}

export function ShopProvider({ children }) {
  const [tools, setTools] = useState(readTools);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tools));
    } catch {
      // Ignore storage write failures and keep the in-memory state intact.
    }
  }, [tools]);

  const value = useMemo(() => ({
    tools,
    addTool: (tool, owner) => {
      const newTool = buildTool(tool, owner);
      setTools((currentTools) => [newTool, ...currentTools]);
      return newTool;
    },
    updateTool: (id, updates) => {
      let updatedTool = null;

      setTools((currentTools) =>
        currentTools.map((tool) => {
          if (tool.id !== id) {
            return tool;
          }

          updatedTool = normalizeTool({ ...tool, ...updates });
          return updatedTool;
        })
      );

      return updatedTool;
    },
    removeTool: (id) => {
      setTools((currentTools) => currentTools.filter((tool) => tool.id !== id));
    },
    refreshTools: () => {
      setTools(readTools());
    },
  }), [tools]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const context = useContext(ShopContext);

  if (!context) {
    throw new Error("useShop must be used within a ShopProvider");
  }

  return context;
}
