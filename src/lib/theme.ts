// Light mode is applied by setting CSS variables on <html> at runtime. The build
// pipeline (Tailwind v4 / lightningcss) prunes static `[data-theme]` CSS rules,
// but inline custom properties on documentElement are immune and cascade to
// everything: text-white→var(--color-white), bg-ink-0→var(--bg-0), etc., so
// overriding these flips the whole site. Dark is the default (vars removed).

export const LIGHT_VARS: Record<string, string> = {
  // warm light surfaces
  "--bg-0": "#FBF9F6",
  "--bg-1": "#FFFFFF",
  "--bg-2": "#F4F1EA",
  "--bg-3": "#E8E1D6",
  // warm near-black text + dark hairline
  "--text-warm": "#1C1814",
  "--text-2": "rgba(28,24,20,.7)",
  "--text-3": "rgba(28,24,20,.45)",
  "--hairline": "rgba(28,24,20,.12)",
  // copper darkened for contrast on light
  "--copper": "#B5703C",
  "--copper-bright": "#A85F2A",
  "--copper-dim": "rgba(168,95,42,.32)",
  // Tailwind built-ins the dark UI hardcodes (white + zinc grays)
  "--color-white": "#1C1814",
  "--color-zinc-300": "#3F3F46",
  "--color-zinc-400": "#52525B",
  "--color-zinc-500": "#6B6B72",
  "--color-zinc-600": "#3F3F46",
};

export function applyTheme(light: boolean): void {
  const r = document.documentElement;
  if (light) {
    r.setAttribute("data-theme", "light");
    r.style.colorScheme = "light";
    for (const k in LIGHT_VARS) r.style.setProperty(k, LIGHT_VARS[k]);
  } else {
    r.removeAttribute("data-theme");
    r.style.colorScheme = "";
    for (const k in LIGHT_VARS) r.style.removeProperty(k);
  }
}
