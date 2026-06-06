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

export interface ToolIntake {
  email: string;
  name?: string; // person, when the tool collected one (most don't)
  website?: string; // the audited site, when the tool has one
  context: string; // the human summary the tool already builds — becomes the note + niche
}

/**
 * Short tool label from the context line, for the lead's niche/category column.
 * The tools format context as "Tool Name — details", separated by an em dash, so
 * the head before it is the tool name ("Website Audit Tool — https://x" → "Website
 * Audit Tool"). Falls back to a generic label.
 */
export function toolLabel(context: string): string {
  const head = (context || "").split("—")[0].trim();
  return head || "Free tool";
}

/** Human note so Duke sees which tool they used and the result at a glance. */
export function buildToolNote(context: string): string {
  const c = (context || "").trim();
  return `Inbound — used a free tool on the site and entered their email for the results.${c ? ` ${c}.` : ""} They raised their hand, so treat as a warm lead.`;
}

/**
 * Turn any free-tool email capture (audit suite, calculators, quiz) into a CRM
 * lead (admin-owned custom lead = tier-A, top of queue), so hand-raisers land in
 * the /crm pipeline instead of only Duke's inbox. Idempotent per owner by email
 * (and by site host when a website is known), so it collapses with any prior
 * audit/contact lead from the same person. Returns null if there's no email to
 * key on or no CRM user yet. Callers must treat a throw as non-fatal so a Redis
 * hiccup never breaks the visitor-facing capture response.
 */
export async function captureToolLead(input: ToolIntake): Promise<IntakeResult | null> {
  const email = input.email?.trim().toLowerCase();
  if (!email) return null;

  const ownerId = await inboundOwnerId();
  if (!ownerId) return null; // no CRM user yet — nothing to attach the lead to

  const url = input.website?.trim();
  const existing = (await getCustomLeads(ownerId)).find(
    (l) => l.email?.trim().toLowerCase() === email || (!!url && sameHost(l.website, url)),
  );
  if (existing) return { leadId: existing.id, created: false, ownerId };

  const lead = await createCustomLead(ownerId, {
    name: (url ? hostLabel(url) : "") || input.name?.trim() || email,
    contactName: input.name?.trim() || "", // greet by name when we have one
    phone: "",
    email,
    website: url ?? "",
    city: "",
    county: "",
    niche: toolLabel(input.context),
    notes: buildToolNote(input.context),
  });
  return { leadId: lead.id, created: true, ownerId };
}

export interface ContactIntake {
  name: string;
  business?: string;
  email: string;
  phone?: string;
  service?: string;
  message?: string;
  attribution?: string; // pre-formatted first-touch source (utm/referrer/landing)
}

/** Human note so Duke sees the full contact-form context at a glance. */
export function buildContactNote(input: ContactIntake): string {
  return [
    "Inbound — submitted the website contact form. They reached out directly, so treat as a warm lead.",
    input.service ? `Wants: ${input.service}.` : "",
    input.message ? `Their message: "${input.message.trim()}"` : "",
    input.attribution ? `How they found us: ${input.attribution}.` : "",
  ]
    .filter(Boolean)
    .join(" ");
}

/**
 * Turn a contact-form submission into a CRM lead (admin-owned custom lead =
 * tier-A, top of queue), the same path the audit bridge uses.
 *
 * Idempotent per owner by email: a repeat submission from the same person won't
 * duplicate the card or clobber Duke's notes/disposition — first one wins. Also
 * collapses with any prior audit lead from the same email (one person, one card).
 * Returns null if there's no email to key on or no CRM user to assign to.
 * Callers must treat a throw as non-fatal so a Redis hiccup never breaks the
 * visitor-facing contact response.
 */
export async function captureContactLead(input: ContactIntake): Promise<IntakeResult | null> {
  const email = input.email?.trim().toLowerCase();
  if (!email) return null;

  const ownerId = await inboundOwnerId();
  if (!ownerId) return null; // no CRM user yet — nothing to attach the lead to

  const existing = (await getCustomLeads(ownerId)).find(
    (l) => l.email?.trim().toLowerCase() === email,
  );
  if (existing) return { leadId: existing.id, created: false, ownerId };

  const lead = await createCustomLead(ownerId, {
    name: input.business?.trim() || input.name?.trim() || email,
    contactName: input.name?.trim() || "", // the person who reached out — greet them by name
    phone: input.phone?.trim() ?? "",
    email,
    website: "",
    city: "",
    county: "",
    niche: input.service?.trim() || "Contact form",
    notes: buildContactNote(input),
  });
  return { leadId: lead.id, created: true, ownerId };
}
