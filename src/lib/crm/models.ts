/**
 * CRM object model — Phase 0 of the competition-grade roadmap (docs/CRM_ROADMAP.md).
 *
 * Introduces a proper related-object graph (Company ↔ Contact ↔ Deal ↔ Activity/Task)
 * ALONGSIDE the existing lead stores in src/lib/db.ts. Nothing here touches or replaces
 * the current CRM — it is purely additive, so /crm keeps working. Later phases build the
 * new workspace UI on top of these models; adapters (bottom of file) let existing leads,
 * custom leads, and submissions surface as the new objects with no data migration.
 *
 * Storage conventions (Upstash Redis, shared client from ../redis):
 *   crm:company:{id}            hash        the record
 *   crm:companies               set         index of all company ids
 *   crm:contact:{id}            hash
 *   crm:contacts                set
 *   crm:company:{id}:contacts   set         contact ids for a company
 *   crm:deal:{id}               hash
 *   crm:deals                   set
 *   crm:task:{id}               hash
 *   crm:tasks                   set
 *   crm:activity:{id}           hash
 *   crm:timeline:{parentKey}    zset        activity ids scored by createdAt (ms)
 * JSON-encoded fields (tags, customFields, contactIds) are stored as strings.
 */
import { getRedis } from "../redis";

// ─── Types ──────────────────────────────────────────────────────────────────

export type Json = Record<string, unknown>;

export interface Company {
  id: string;
  name: string;
  domain?: string;
  website?: string;
  phone?: string;
  city?: string;
  county?: string;
  industry?: string;
  size?: string;
  ownerId?: string;
  tags: string[];
  customFields: Json;
  source?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  id: string;
  companyId?: string;
  firstName: string;
  lastName: string;
  name: string;
  email?: string;
  phone?: string;
  title?: string;
  city?: string;
  ownerId?: string;
  tags: string[];
  customFields: Json;
  source?: string;
  lifecycleStage?: "lead" | "mql" | "sql" | "customer" | "evangelist";
  lastActivityAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type DealStatus = "open" | "won" | "lost";

export interface Deal {
  id: string;
  name: string;
  companyId?: string;
  contactIds: string[];
  pipelineId: string;
  stage: string;
  value: number;
  currency: string;
  probability?: number;
  expectedCloseDate?: string; // YYYY-MM-DD
  ownerId?: string;
  status: DealStatus;
  lostReason?: string;
  tags: string[];
  customFields: Json;
  source?: string;
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
}

export type TaskType = "call" | "email" | "meeting" | "todo" | "follow_up";

export interface Task {
  id: string;
  title: string;
  type: TaskType;
  dueDate?: string; // ISO
  done: boolean;
  assigneeId?: string;
  contactId?: string;
  companyId?: string;
  dealId?: string;
  createdAt: string;
  completedAt?: string;
}

export type ActivityType =
  | "note"
  | "call"
  | "email"
  | "meeting"
  | "task"
  | "stage_change"
  | "system";

export interface Activity {
  id: string;
  type: ActivityType;
  body?: string;
  contactId?: string;
  companyId?: string;
  dealId?: string;
  authorId?: string;
  meta?: Json;
  createdAt: string;
}

// ─── Serialization helpers ───────────────────────────────────────────────────
// Redis hashes store strings; arrays/objects are JSON-encoded on write and parsed
// on read. Booleans/numbers are coerced back from their string forms.

function now(): string {
  return new Date().toISOString();
}

function enc(obj: Record<string, unknown>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue;
    out[k] = typeof v === "string" ? v : JSON.stringify(v);
  }
  return out;
}

function parseField<T>(raw: unknown, fallback: T): T {
  if (raw === undefined || raw === null) return fallback;
  if (typeof raw !== "string") return raw as T;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return raw as unknown as T;
  }
}

// ─── Company ──────────────────────────────────────────────────────────────────

export async function createCompany(
  data: Omit<Company, "id" | "tags" | "customFields" | "createdAt" | "updatedAt"> &
    Partial<Pick<Company, "tags" | "customFields">>,
): Promise<Company> {
  const redis = getRedis();
  const id = crypto.randomUUID();
  const ts = now();
  const company: Company = {
    tags: [],
    customFields: {},
    ...data,
    id,
    createdAt: ts,
    updatedAt: ts,
  };
  await redis.hset(`crm:company:${id}`, enc(company as unknown as Record<string, unknown>));
  await redis.sadd("crm:companies", id);
  return company;
}

export async function getCompany(id: string): Promise<Company | null> {
  const redis = getRedis();
  const h = (await redis.hgetall(`crm:company:${id}`)) as Record<string, unknown> | null;
  if (!h || !h.id) return null;
  return {
    ...(h as unknown as Company),
    tags: parseField<string[]>(h.tags, []),
    customFields: parseField<Json>(h.customFields, {}),
  };
}

export async function updateCompany(id: string, patch: Partial<Company>): Promise<void> {
  const redis = getRedis();
  await redis.hset(
    `crm:company:${id}`,
    enc({ ...patch, updatedAt: now() } as Record<string, unknown>),
  );
}

export async function listCompanies(): Promise<Company[]> {
  const redis = getRedis();
  const ids = (await redis.smembers("crm:companies")) as string[];
  const all = await Promise.all(ids.map(getCompany));
  return all.filter(Boolean) as Company[];
}

// ─── Contact ────────────────────────────────────────────────────────────────

export async function createContact(
  data: Omit<Contact, "id" | "name" | "tags" | "customFields" | "createdAt" | "updatedAt"> &
    Partial<Pick<Contact, "name" | "tags" | "customFields">>,
): Promise<Contact> {
  const redis = getRedis();
  const id = crypto.randomUUID();
  const ts = now();
  const contact: Contact = {
    tags: [],
    customFields: {},
    name: `${data.firstName} ${data.lastName}`.trim(),
    ...data,
    id,
    createdAt: ts,
    updatedAt: ts,
  };
  await redis.hset(`crm:contact:${id}`, enc(contact as unknown as Record<string, unknown>));
  await redis.sadd("crm:contacts", id);
  if (contact.companyId) await redis.sadd(`crm:company:${contact.companyId}:contacts`, id);
  return contact;
}

export async function getContact(id: string): Promise<Contact | null> {
  const redis = getRedis();
  const h = (await redis.hgetall(`crm:contact:${id}`)) as Record<string, unknown> | null;
  if (!h || !h.id) return null;
  return {
    ...(h as unknown as Contact),
    tags: parseField<string[]>(h.tags, []),
    customFields: parseField<Json>(h.customFields, {}),
  };
}

export async function updateContact(id: string, patch: Partial<Contact>): Promise<void> {
  const redis = getRedis();
  await redis.hset(
    `crm:contact:${id}`,
    enc({ ...patch, updatedAt: now() } as Record<string, unknown>),
  );
}

export async function listContacts(): Promise<Contact[]> {
  const redis = getRedis();
  const ids = (await redis.smembers("crm:contacts")) as string[];
  const all = await Promise.all(ids.map(getContact));
  return all.filter(Boolean) as Contact[];
}

export async function getCompanyContacts(companyId: string): Promise<Contact[]> {
  const redis = getRedis();
  const ids = (await redis.smembers(`crm:company:${companyId}:contacts`)) as string[];
  const all = await Promise.all(ids.map(getContact));
  return all.filter(Boolean) as Contact[];
}

// ─── Deal ───────────────────────────────────────────────────────────────────

export async function createDeal(
  data: Omit<Deal, "id" | "contactIds" | "tags" | "customFields" | "currency" | "createdAt" | "updatedAt"> &
    Partial<Pick<Deal, "contactIds" | "tags" | "customFields" | "currency">>,
): Promise<Deal> {
  const redis = getRedis();
  const id = crypto.randomUUID();
  const ts = now();
  const deal: Deal = {
    ...data,
    contactIds: data.contactIds ?? [],
    tags: data.tags ?? [],
    customFields: data.customFields ?? {},
    currency: data.currency ?? "USD",
    id,
    createdAt: ts,
    updatedAt: ts,
  };
  await redis.hset(`crm:deal:${id}`, enc(deal as unknown as Record<string, unknown>));
  await redis.sadd("crm:deals", id);
  if (deal.companyId) await redis.sadd(`crm:company:${deal.companyId}:deals`, id);
  return deal;
}

export async function getDeal(id: string): Promise<Deal | null> {
  const redis = getRedis();
  const h = (await redis.hgetall(`crm:deal:${id}`)) as Record<string, unknown> | null;
  if (!h || !h.id) return null;
  return {
    ...(h as unknown as Deal),
    value: Number(h.value ?? 0),
    probability: h.probability !== undefined ? Number(h.probability) : undefined,
    contactIds: parseField<string[]>(h.contactIds, []),
    tags: parseField<string[]>(h.tags, []),
    customFields: parseField<Json>(h.customFields, {}),
  };
}

export async function updateDeal(id: string, patch: Partial<Deal>): Promise<void> {
  const redis = getRedis();
  await redis.hset(
    `crm:deal:${id}`,
    enc({ ...patch, updatedAt: now() } as Record<string, unknown>),
  );
}

export async function listDeals(): Promise<Deal[]> {
  const redis = getRedis();
  const ids = (await redis.smembers("crm:deals")) as string[];
  const all = await Promise.all(ids.map(getDeal));
  return all.filter(Boolean) as Deal[];
}

/** Weighted forecast: sum(value × probability) over open deals. */
export function weightedForecast(deals: Deal[]): number {
  return deals
    .filter((d) => d.status === "open")
    .reduce((sum, d) => sum + d.value * ((d.probability ?? 0) / 100), 0);
}

// ─── Task ───────────────────────────────────────────────────────────────────

export async function createTask(
  data: Omit<Task, "id" | "done" | "createdAt"> & Partial<Pick<Task, "done">>,
): Promise<Task> {
  const redis = getRedis();
  const id = crypto.randomUUID();
  const task: Task = { done: false, ...data, id, createdAt: now() };
  await redis.hset(`crm:task:${id}`, enc(task as unknown as Record<string, unknown>));
  await redis.sadd("crm:tasks", id);
  if (task.assigneeId) await redis.sadd(`crm:user:${task.assigneeId}:tasks`, id);
  return task;
}

export async function getTask(id: string): Promise<Task | null> {
  const redis = getRedis();
  const h = (await redis.hgetall(`crm:task:${id}`)) as Record<string, unknown> | null;
  if (!h || !h.id) return null;
  return { ...(h as unknown as Task), done: parseField<boolean>(h.done, false) };
}

export async function completeTask(id: string): Promise<void> {
  const redis = getRedis();
  await redis.hset(`crm:task:${id}`, enc({ done: true, completedAt: now() }));
}

export async function getUserTasks(userId: string): Promise<Task[]> {
  const redis = getRedis();
  const ids = (await redis.smembers(`crm:user:${userId}:tasks`)) as string[];
  const all = await Promise.all(ids.map(getTask));
  return (all.filter(Boolean) as Task[]).sort((a, b) =>
    (a.dueDate ?? "").localeCompare(b.dueDate ?? ""),
  );
}

// ─── Activity timeline ────────────────────────────────────────────────────────
// An activity is appended to the timeline of every record it references, so a
// contact, its company, and a deal all show the same call/email/note.

function timelineKeys(a: Pick<Activity, "contactId" | "companyId" | "dealId">): string[] {
  const keys: string[] = [];
  if (a.contactId) keys.push(`crm:timeline:contact:${a.contactId}`);
  if (a.companyId) keys.push(`crm:timeline:company:${a.companyId}`);
  if (a.dealId) keys.push(`crm:timeline:deal:${a.dealId}`);
  return keys;
}

export async function logActivity(
  data: Omit<Activity, "id" | "createdAt"> & Partial<Pick<Activity, "createdAt">>,
): Promise<Activity> {
  const redis = getRedis();
  const id = crypto.randomUUID();
  const createdAt = data.createdAt ?? now();
  const activity: Activity = { ...data, id, createdAt };
  await redis.hset(`crm:activity:${id}`, enc(activity as unknown as Record<string, unknown>));
  const score = new Date(createdAt).getTime();
  for (const key of timelineKeys(activity)) {
    await redis.zadd(key, { score, member: id });
  }
  // Touch the contact's lastActivityAt for list sorting.
  if (activity.contactId) await updateContact(activity.contactId, { lastActivityAt: createdAt });
  return activity;
}

async function getActivityById(id: string): Promise<Activity | null> {
  const redis = getRedis();
  const h = (await redis.hgetall(`crm:activity:${id}`)) as Record<string, unknown> | null;
  if (!h || !h.id) return null;
  return { ...(h as unknown as Activity), meta: parseField<Json>(h.meta, {}) };
}

export async function getTimeline(
  parent: "contact" | "company" | "deal",
  id: string,
  limit = 50,
): Promise<Activity[]> {
  const redis = getRedis();
  // Newest first.
  const ids = (await redis.zrange(`crm:timeline:${parent}:${id}`, 0, limit - 1, {
    rev: true,
  })) as string[];
  const all = await Promise.all(ids.map(getActivityById));
  return all.filter(Boolean) as Activity[];
}

// ─── Adapters (legacy → new objects) ──────────────────────────────────────────
// Pure mappers so existing leads/custom-leads/submissions can be presented as the
// new objects without migrating data. UI in later phases will prefer real records
// but fall back to these derived views for un-migrated leads.

/** A row from the CSV lead feed / leads API (loose shape — only fields we use). */
export interface LegacyLeadLike {
  id: string;
  name: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  website?: string;
  city?: string;
  county?: string;
  category?: string;
  previewUrl?: string | null;
}

function splitName(full: string): { firstName: string; lastName: string } {
  const parts = (full || "").trim().split(/\s+/);
  return { firstName: parts[0] ?? "", lastName: parts.slice(1).join(" ") };
}

/** Derive an in-memory Contact view from a legacy lead (not persisted). */
export function leadToContactView(lead: LegacyLeadLike): Contact {
  const person = lead.contact_name?.trim() || "";
  const { firstName, lastName } = splitName(person);
  return {
    id: `legacy:${lead.id}`,
    companyId: `legacy-co:${lead.id}`,
    firstName,
    lastName,
    name: person || lead.name,
    email: lead.email || undefined,
    phone: lead.phone || undefined,
    city: lead.city || undefined,
    tags: lead.category ? [lead.category] : [],
    customFields: {},
    source: "lead-feed",
    lifecycleStage: "lead",
    createdAt: "",
    updatedAt: "",
  };
}

/** Derive an in-memory Company view from a legacy lead (not persisted). */
export function leadToCompanyView(lead: LegacyLeadLike): Company {
  return {
    id: `legacy-co:${lead.id}`,
    name: lead.name,
    website: lead.website || undefined,
    phone: lead.phone || undefined,
    city: lead.city || undefined,
    county: lead.county || undefined,
    industry: lead.category || undefined,
    tags: [],
    customFields: {},
    source: "lead-feed",
    createdAt: "",
    updatedAt: "",
  };
}
