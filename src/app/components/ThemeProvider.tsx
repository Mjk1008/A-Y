"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { THEMES, type Theme, type ThemeKey } from "@/lib/themes";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (key: ThemeKey) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: THEMES.dark,
  setTheme: () => {},
});

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.style.setProperty("--ay-bg", theme.bg);
  root.style.setProperty("--ay-text", theme.text);
  root.style.setProperty("--ay-accent", theme.accent);
  root.style.setProperty("--ay-accent-hi", theme.accentHi);
  root.style.setProperty("--ay-accent-deep", theme.accentDeep);
  root.style.setProperty("--ay-accent-bg", theme.accentBg);
  root.style.setProperty("--ay-border", theme.border);
  root.style.setProperty("--ay-surface", theme.surface);
  root.style.setProperty("--ay-text-dim", theme.textDim);
  root.dataset.theme = theme.key;
  document.body.style.background = theme.bg;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(THEMES.dark);

  useEffect(() => {
    const stored = localStorage.getItem("ay_theme") as ThemeKey | null;
    const key: ThemeKey = stored && THEMES[stored] ? stored : "dark";
    const resolved = THEMES[key];
    setThemeState(resolved);
    applyTheme(resolved);
  }, []);

  function setTheme(key: ThemeKey) {
    const resolved = THEMES[key];
    setThemeState(resolved);
    localStorage.setItem("ay_theme", key);
    applyTheme(resolved);
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
