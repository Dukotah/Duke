// First-touch attribution: capture where a visitor came from (UTM tags +
// referrer + landing page) once per session, so a lead carries its source into
// the CRM. First touch wins — the original source is more useful than the page
// they happened to convert on.

export type Attribution = {
  source?: string;
  medium?: string;
  campaign?: string;
  referrer?: string;
  landingPath?: string;
};

const KEY = "cbt_attribution";

/** Client-only: record first-touch attribution once per session. No-op on server. */
export function captureFirstTouch(): void {
  if (typeof window === "undefined") return;
  try {
    if (window.sessionStorage.getItem(KEY)) return; // first touch wins
    const p = new URLSearchParams(window.location.search);
    const a: Attribution = {
      source: p.get("utm_source") ?? undefined,
      medium: p.get("utm_medium") ?? undefined,
      campaign: p.get("utm_campaign") ?? undefined,
      referrer: document.referrer || undefined,
      landingPath: window.location.pathname,
    };
    window.sessionStorage.setItem(KEY, JSON.stringify(a));
  } catch {
    /* sessionStorage unavailable (private mode / blocked) — skip silently */
  }
}

/** Client-only: read the stored first-touch attribution. */
export function getAttribution(): Attribution | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.sessionStorage.getItem(KEY);
    return v ? (JSON.parse(v) as Attribution) : null;
  } catch {
    return null;
  }
}

/** Pure (server-safe): format attribution into a short human line for a CRM note. */
export function formatAttribution(a: Attribution | null | undefined): string {
  if (!a) return "";
  const parts: string[] = [];
  if (a.source) parts.push(`source: ${a.source}${a.medium ? ` / ${a.medium}` : ""}`);
  else if (a.referrer) parts.push(`referrer: ${a.referrer}`);
  if (a.campaign) parts.push(`campaign: ${a.campaign}`);
  if (a.landingPath) parts.push(`landing: ${a.landingPath}`);
  return parts.join(" · ");
}
