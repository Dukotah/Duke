"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

// Dark/light toggle. Default is dark; setting data-theme="light" on <html> flips
// the design-token + Tailwind color variables (see globals.css) into a true
// daytime light theme. Choice persists in localStorage; a no-flash init script
// in the root layout applies it before paint.
export default function ThemeToggle() {
  const [light, setLight] = useState(false);

  useEffect(() => {
    setLight(document.documentElement.getAttribute("data-theme") === "light");
  }, []);

  function toggle() {
    const next = !light;
    setLight(next);
    const root = document.documentElement;
    if (next) root.setAttribute("data-theme", "light");
    else root.removeAttribute("data-theme");
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
