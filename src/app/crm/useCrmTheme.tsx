"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type CrmTheme = "dark" | "light";

const STORAGE_KEY = "cbt-crm-theme";

interface CrmThemeValue {
  theme: CrmTheme;
  toggle: () => void;
  setTheme: (t: CrmTheme) => void;
}

const CrmThemeContext = createContext<CrmThemeValue>({
  theme: "dark",
  toggle: () => {},
  setTheme: () => {},
});

export function useCrmTheme(): CrmThemeValue {
  return useContext(CrmThemeContext);
}

/**
 * Provides the CRM light/dark theme. The active value is mirrored onto the CRM
 * shell root via `data-crm-theme`, which flips the --crm-* token layer in
 * globals.css. Dark is the default (matches the rest of the brand); a saved
 * choice in localStorage wins, otherwise the OS preference seeds the first load.
 *
 * The attribute is applied in an effect (not during SSR) so server and first
 * client render agree — light-mode users may see one frame of dark before the
 * effect runs, which is acceptable for an internal tool.
 */
export function CrmThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<CrmTheme>("dark");

  useEffect(() => {
    // One-shot sync from the external store (saved choice → OS preference) on
    // mount. Computed first, then a single guarded setState only when it differs
    // from the "dark" default, so this can't cascade renders.
    let initial: CrmTheme = "dark";
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "light" || saved === "dark") {
        initial = saved;
      } else if (window.matchMedia?.("(prefers-color-scheme: light)").matches) {
        initial = "light";
      }
    } catch {
      /* localStorage unavailable — stay on default dark */
    }
    if (initial !== "dark") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from localStorage/OS on mount
      setThemeState(initial);
    }
  }, []);

  const setTheme = useCallback((t: CrmTheme) => {
    setThemeState(t);
    try {
      localStorage.setItem(STORAGE_KEY, t);
    } catch {
      /* ignore persistence failure */
    }
  }, []);

  const toggle = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  return (
    <CrmThemeContext.Provider value={{ theme, toggle, setTheme }}>
      {children}
    </CrmThemeContext.Provider>
  );
}
