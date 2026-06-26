"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Sun, Moon } from "lucide-react";
import { applyTheme } from "@/lib/theme";

// Dark/light toggle. Default is dark; light mode sets CSS variables on <html> at
// runtime (see @/lib/theme) — robust against the build's CSS pruning. The choice
// persists in localStorage and is applied before paint by the init script in the
// root layout.
export default function ThemeToggle() {
  const [light, setLight] = useState(false);
  const pathname = usePathname();
  // The mobile home page renders the standalone copper landing (hardcoded dark
  // palette, no theme vars), so a floating light/dark toggle there does nothing
  // and clutters the design. Hide it on mobile "/" only; desktop "/" (the
  // themeable homepage) and every other route keep it.
  const hideOnMobile = pathname === "/";

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
      title={light ? "Switch to dark mode" : "Switch to light mode"}
      className={`fixed bottom-24 left-4 z-50 inline-flex items-center gap-2 rounded-full border border-copper/60 bg-copper/15 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-copper-bright shadow-lg shadow-black/20 backdrop-blur transition-colors hover:border-copper hover:bg-copper/25 md:bottom-4 ${hideOnMobile ? "max-md:hidden" : ""}`}
    >
      {light ? <Moon size={15} /> : <Sun size={15} />}
      <span>{light ? "Dark" : "Light"}</span>
    </button>
  );
}
