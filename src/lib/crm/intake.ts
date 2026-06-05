// Inbound capture → CRM (the live rep-portal system, src/lib/db.ts).
//
// Turns a completed free site audit into a real lead in the /crm queue — owned
// by the admin (Duke) and stored as a "custom lead", the same path the in-app
// "Add Lead" button uses. Custom leads render as tier-A, so an inbound audit
// (a warm, hand-raised prospect) lands at the TOP of the queue instead of being
// just an email. Deduplicated per owner by email / website host.
//
// NOTE: this deliberately targets db.ts (what the dashboard reads), NOT the
// parallel crm/store.ts power-dialer store, which the UI doesn't surface.

import { createCustomLead, getCustomLeads, getUserByEmail, listUsers } from "@/lib/db";

/** Bare hostname for a friendly business label / website field. */
export function hostLabel(u: string): string {
  try {
    return new URL(u.startsWith("http") ? u : `https://${u}`).hostname.replace(/^www\./, "");
  } catch {
    return u;
  }
}

/** True when two URLs point at the same site (scheme/www-insensitive). */
export function sameHost(a?: string | null, b?: string | null): boolean {
  if (!a || !b) return false;
  return hostLabel(a).toLowerCase() === hostLabel(b).toLowerCase();
}

/** Human note attached to the lead so Duke sees the context + score at a glance. */
export function buildAuditNote(score: number): string {
  const s = Math.max(0, Math.min(100, Math.round(score || 0)));
  const band = s >= 90 ? "good" : s >= 50 ? "needs work" : "poor";
  return `Inbound — ran the free website audit and entered their email for the report. Performance score ${s}/100 (${band}). They raised their hand, so treat as a warm lead.`;
}

// Inbound leads have no rep yet, so they're owned by the admin (Duke). Resolve
// by ADMIN_EMAIL, else the first admin user, else the first user.
async function inboundOwnerId(): Promise<string | null> {
  const email = process.env.ADMIN_EMAIL;
  if (email) {
    const u = await getUserByEmail(email);
    if (u) return u.id;
  }
  const users = await listUsers();
  return (users.find((u) => u.role === "admin") ?? users[0])?.id ?? null;
}

export interface AuditIntake {
  email?: string;
  url: string; // the site that was audited
  score: number; // PageSpeed performance, 0–100
}

export interface IntakeResult {
  leadId: string;
  created: boolean; // false = a matching lead already existed
  ownerId: string;
}

/**
 * Idempotent per owner+site/email: a repeat audit doesn't create a duplicate.
 * Returns null if there's no URL to key on or no user to assign it to (e.g. the
 * CRM hasn't been set up yet). Callers should treat a throw as non-fatal so a
 * Redis hiccup never breaks the visitor-facing audit response.
 */
export async function captureAuditLead(input: AuditIntake): Promise<IntakeResult | null> {
  const url = input.url?.trim();
  if (!url) return null;

  const ownerId = await inboundOwnerId();
  if (!ownerId) return null; // no CRM user yet — nothing to attach the lead to

  const email = input.email?.trim().toLowerCase();
  const existing = (await getCustomLeads(ownerId)).find(
    (l) => (!!email && l.email?.trim().toLowerCase() === email) || sameHost(l.website, url),
  );
  if (existing) return { leadId: existing.id, created: false, ownerId };

  const lead = await createCustomLead(ownerId, {
    name: hostLabel(url),
    phone: "",
    email: input.email ?? "",
    website: url,
    city: "",
    county: "",
    niche: "Website audit",
    notes: buildAuditNote(input.score),
  });
  return { leadId: lead.id, created: true, ownerId };
}
