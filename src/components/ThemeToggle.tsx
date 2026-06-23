"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { applyTheme } from "@/lib/theme";

// Dark/light toggle. Default is dark; light mode sets CSS variables on <html> at
// runtime (see @/lib/theme) — robust against the build's CSS pruning. The choice
// persists in localStorage and is applied before paint by the init script in the
// root layout.
export default function ThemeToggle() {
  const [light, setLight] = useState(false);

  useEffect(() => {
    setLight(document.documentElement.getAttribute("data-theme") === "light");
  }, []);

  function toggle() {
    const next = !light;
    setLight(next);
    applyTheme(next);
    try {
      localStorage.setItem("cbt-theme", next ? "light" : "dark");
    } catch {
      /* private mode — non-persistent is fine */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={light ? "Switch to dark mode" : "Switch to light mode"}
      title={light ? "Dark mode" : "Light mode"}
      className="fixed bottom-20 left-4 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-hairline bg-ink-2/90 text-copper-bright shadow-lg backdrop-blur transition-colors hover:border-copper-dim hover:text-copper md:bottom-4"
    >
      {light ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  );
}
