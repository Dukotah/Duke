"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

// Cheap dark/bright toggle: flips the --bg-* ink ramp between the brighter
// default and the deeper original ("dim") via a data-theme attribute on <html>.
// No-flash init runs in the root layout before paint; this just lets users flip
// it and persists the choice.
export default function ThemeToggle() {
  const [dim, setDim] = useState(false);

  useEffect(() => {
    setDim(document.documentElement.getAttribute("data-theme") === "dim");
  }, []);

  function toggle() {
    const next = !dim;
    setDim(next);
    const root = document.documentElement;
    if (next) root.setAttribute("data-theme", "dim");
    else root.removeAttribute("data-theme");
    try {
      localStorage.setItem("cbt-theme", next ? "dim" : "bright");
    } catch {
      /* private mode — non-persistent is fine */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dim ? "Switch to brighter theme" : "Switch to dimmer theme"}
      title={dim ? "Brighter" : "Dimmer"}
      className="fixed bottom-20 left-4 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-hairline bg-ink-2/90 text-copper-bright shadow-lg backdrop-blur transition-colors hover:border-copper-dim hover:text-copper md:bottom-4"
    >
      {dim ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
