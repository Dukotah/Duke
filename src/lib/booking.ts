// Single source of truth for the rep-facing booking link.
//
// By default outreach points at the on-site /schedule funnel (BOOKING_URL),
// made absolute so it works in emails and texts. A rep can paste a personal
// scheduling link (e.g. Calendly) which overrides the default; that override is
// stored per-browser under one key shared by every surface that uses it.

import { BOOKING_URL, SITE_URL } from "@/config/site";

// Historical key name (predates the on-site /schedule funnel) — kept so existing
// reps don't lose a saved link.
export const BOOKING_OVERRIDE_KEY = "calendly_link";

// Resolve the booking link to share. A non-empty override wins (normalized to an
// absolute https URL); otherwise fall back to the canonical on-site /schedule
// page, made absolute when BOOKING_URL is a site-relative path.
export function resolveBookingUrl(override?: string): string {
  const o = override?.trim();
  if (o) return o.startsWith("http") ? o : `https://${o}`;
  return BOOKING_URL.startsWith("http") ? BOOKING_URL : `${SITE_URL}${BOOKING_URL}`;
}

// Per-browser override accessors (client-only; no-op/empty during SSR).
export function readBookingOverride(): string {
  if (typeof window === "undefined") return "";
  try { return localStorage.getItem(BOOKING_OVERRIDE_KEY) ?? ""; } catch { return ""; }
}

export function writeBookingOverride(value: string): void {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(BOOKING_OVERRIDE_KEY, value.trim()); } catch { /* ignore */ }
}
