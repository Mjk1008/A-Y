"use client";

import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";
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

// ─── Build regex replacement rules from dark→theme mapping ───────────────
type Rule = { re: RegExp; to: string | ((...args: string[]) => string) };

function buildRules(theme: Theme): Rule[] | null {
  if (theme.key === "dark") return null; // dark = original, no replacements needed

  const d = THEMES.dark._rgb;  // source (dark) RGB triples
  const t = theme._rgb;        // destination RGB triples

  const pairs: [string, string][] = [
    [d.bg,         t.bg],
    [d.bgSoft,     t.bgSoft],
    [d.surfNav,    t.surfNav],
    [d.surf1,      t.surf1],
    [d.surf2,      t.surf2],
    [d.text,       t.text],
    [d.accent,     t.accent],
    [d.accentHi,   t.accentHi],
    [d.accentDeep, t.accentDeep],
    [d.accentText, t.accentText],
  ];

  const rules: Rule[] = [];

  for (const [src, dst] of pairs) {
    // Build loose regex: "52,211,153" → matches "52, 211, 153" etc.
    const pat = src.split(",").map(n => n.trim()).join(",\\s*");
    rules.push({
      re: new RegExp(`rgb\\(\\s*${pat}\\s*\\)`, "gi"),
      to: `rgb(${dst})`,
    });
    rules.push({
      re: new RegExp(`rgba\\(\\s*${pat}\\s*,([^)]+)\\)`, "gi"),
      to: (_m: string, alpha: string) => `rgba(${dst},${alpha})`,
    });
  }

  // Hex replacements (for gradient strings, etc.)
  const hexPairs: [string, string][] = [
    ["#020306", theme.bg],
    ["#05090a", theme.bg],
    ["#e8efea", theme.text],
    ["#34d399", theme.accent],
    ["#6ee7b7", theme.accentHi],
    ["#10b981", theme.accentDeep],
    ["#059669", theme.accentDeep],
    ["#04110a", theme.accentText],
  ];

  for (const [from, to] of hexPairs) {
    rules.push({
      re: new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"),
      to,
    });
  }

  return rules;
}

function applyRules(str: string, rules: Rule[]): string {
  let out = str;
  for (const { re, to } of rules) {
    out = out.replace(re, to as string);
  }
  return out;
}

// ─── Walk a DOM subtree, snapshot original styles, apply replacements ────
function recolorSubtree(root: Element, rules: Rule[] | null) {
  if (!root) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
  let node: Node | null = walker.currentNode;

  while (node) {
    const el = node as HTMLElement;
    if (el.style) {
      const current = el.style.cssText;

      // Snapshot original (dark) style on first visit
      let orig = el.getAttribute("data-ay-orig");
      if (orig === null) {
        el.setAttribute("data-ay-orig", current || "");
        orig = current || "";
      } else {
        // If React re-rendered and overwrote our themed style, update snapshot
        const last = el.getAttribute("data-ay-last");
        if (last !== null && current !== last) {
          el.setAttribute("data-ay-orig", current || "");
          orig = current || "";
        }
      }

      if (rules) {
        const applied = applyRules(orig, rules);
        if (applied !== current) el.style.cssText = applied;
        el.setAttribute("data-ay-last", applied);
      } else {
        // Restore dark (original)
        if (orig !== current) el.style.cssText = orig;
        el.setAttribute("data-ay-last", orig);
      }
    }
    node = walker.nextNode();
  }
}

// ─── CSS variables on <html> ─────────────────────────────────────────────
function applyCSSVars(theme: Theme) {
  const root = document.documentElement;
  root.style.setProperty("--ay-bg",          theme.bg);
  root.style.setProperty("--ay-text",         theme.text);
  root.style.setProperty("--ay-accent",       theme.accent);
  root.style.setProperty("--ay-accent-hi",    theme.accentHi);
  root.style.setProperty("--ay-accent-deep",  theme.accentDeep);
  root.style.setProperty("--ay-accent-bg",    theme.accentBg);
  root.style.setProperty("--ay-border",       theme.border);
  root.style.setProperty("--ay-surface",      theme.surface);
  root.style.setProperty("--ay-text-dim",     theme.textDim);
  root.style.setProperty("--bg",  theme.bg);   // legacy var used in globals.css
  root.style.setProperty("--text", theme.text);
  root.dataset.theme = theme.key;
  document.body.style.background = theme.bg;
  document.body.style.color = theme.text;
}

// ─── ThemeProvider ────────────────────────────────────────────────────────
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(THEMES.dark);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const rulesRef   = useRef<Rule[] | null>(null);
  const timersRef  = useRef<ReturnType<typeof setTimeout>[]>([]);

  const runRecolor = useCallback(() => {
    if (wrapperRef.current) recolorSubtree(wrapperRef.current, rulesRef.current);
  }, []);

  const applyTheme = useCallback((t: Theme) => {
    applyCSSVars(t);
    rulesRef.current = buildRules(t);

    // Run immediately + delayed to catch React re-renders
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [0, 60, 250, 700, 1500].map(ms =>
      setTimeout(runRecolor, ms)
    );
  }, [runRecolor]);

  // Read from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("ay_theme") as ThemeKey | null;
    const key: ThemeKey = stored && THEMES[stored] ? stored : "dark";
    const resolved = THEMES[key];
    setThemeState(resolved);
    applyTheme(resolved);
  }, [applyTheme]);

  // MutationObserver — re-applies theme when React updates the DOM
  useEffect(() => {
    if (!wrapperRef.current) return;

    const obs = new MutationObserver((mutations) => {
      const rules = rulesRef.current;
      for (const m of mutations) {
        if (m.type === "childList") {
          for (const n of m.addedNodes) {
            if (n.nodeType === 1) recolorSubtree(n as Element, rules);
          }
        } else if (m.type === "attributes") {
          const el = m.target as Element;
          if (m.attributeName?.startsWith("data-ay-")) continue;
          recolorSubtree(el, rules);
        }
      }
    });

    obs.observe(wrapperRef.current, {
      childList: true, subtree: true,
      attributes: true, attributeFilter: ["style"],
    });

    return () => {
      obs.disconnect();
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  function setTheme(key: ThemeKey) {
    const resolved = THEMES[key];
    setThemeState(resolved);
    localStorage.setItem("ay_theme", key);
    applyTheme(resolved);
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div ref={wrapperRef} data-ay-root style={{ display: "contents" }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
