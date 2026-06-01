import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import {
  Activity,
  Contact,
  ContactStatus,
  CrmData,
  STATUS_RANK,
  TrackedEmail,
} from "./types";

// ---------------------------------------------------------------------------
// CrmStore is the single seam between the app and persistence. The default
// implementation below is a JSON file (fine for local dev, ephemeral on
// serverless). To go to production, implement this interface against KV /
// Postgres and swap `getStore()` — nothing else in the app changes.
// ---------------------------------------------------------------------------
export interface CrmStore {
  listContacts(): Promise<Contact[]>;
  getContact(id: string): Promise<Contact | null>;
  getContactByEmail(email: string): Promise<Contact | null>;
  /** Find the contact that owns a given tracked-email id. */
  getContactByEmailId(emailId: string): Promise<Contact | null>;
  /** Find the contact that owns a given Resend provider email id. */
  getContactByProviderId(providerId: string): Promise<Contact | null>;
  /** Create a contact, or merge fields into an existing one (matched by email). */
  upsertContact(input: UpsertContactInput): Promise<Contact>;
  addActivity(contactId: string, activity: ActivityInput): Promise<Contact | null>;
  recordEmail(contactId: string, email: TrackedEmail): Promise<Contact | null>;
  updateEmail(
    emailId: string,
    patch: Partial<TrackedEmail>,
  ): Promise<Contact | null>;
  /** Advance a contact's status, respecting STATUS_RANK (never downgrades). */
  advanceStatus(contactId: string, status: ContactStatus): Promise<Contact | null>;
  setUnsubscribed(contactId: string): Promise<Contact | null>;
}

export type UpsertContactInput = {
  name: string;
  email: string;
  business?: string;
  phone?: string;
  service?: string;
  source?: Contact["source"];
  tags?: string[];
  notes?: string;
};

export type ActivityInput = Omit<Activity, "id" | "at"> & { at?: string };

const nowIso = () => new Date().toISOString();
const normEmail = (email: string) => email.trim().toLowerCase();

function newActivity(input: ActivityInput): Activity {
  return {
    id: randomUUID(),
    at: input.at ?? nowIso(),
    type: input.type,
    detail: input.detail,
    meta: input.meta,
  };
}

class JsonFileStore implements CrmStore {
  private file: string;
  // Serialize all writes through a single promise chain to avoid
  // read-modify-write races within a process.
  private queue: Promise<unknown> = Promise.resolve();

  constructor(dataDir: string) {
    this.file = path.join(dataDir, "crm.json");
  }

  private async read(): Promise<CrmData> {
    try {
      const raw = await fs.readFile(this.file, "utf8");
      const data = JSON.parse(raw) as CrmData;
      if (!data.contacts) return { version: 1, contacts: [] };
      return data;
    } catch (err: unknown) {
      if ((err as NodeJS.ErrnoException)?.code === "ENOENT") {
        return { version: 1, contacts: [] };
      }
      throw err;
    }
  }

  private async write(data: CrmData): Promise<void> {
    await fs.mkdir(path.dirname(this.file), { recursive: true });
    await fs.writeFile(this.file, JSON.stringify(data, null, 2), "utf8");
  }

  /** Run a read-modify-write atomically with respect to other mutations. */
  private mutate<T>(fn: (data: CrmData) => T | Promise<T>): Promise<T> {
    const run = this.queue.then(async () => {
      const data = await this.read();
      const result = await fn(data);
      await this.write(data);
      return result;
    });
    // Keep the chain going even if this mutation rejects.
    this.queue = run.then(
      () => undefined,
      () => undefined,
    );
    return run;
  }

  async listContacts(): Promise<Contact[]> {
    const data = await this.read();
    return [...data.contacts].sort((a, b) =>
      b.lastActivityAt.localeCompare(a.lastActivityAt),
    );
  }

  async getContact(id: string): Promise<Contact | null> {
    const data = await this.read();
    return data.contacts.find((c) => c.id === id) ?? null;
  }

  async getContactByEmail(email: string): Promise<Contact | null> {
    const target = normEmail(email);
    const data = await this.read();
    return data.contacts.find((c) => c.email === target) ?? null;
  }

  async getContactByEmailId(emailId: string): Promise<Contact | null> {
    const data = await this.read();
    return data.contacts.find((c) => c.emails.some((e) => e.id === emailId)) ?? null;
  }

  async getContactByProviderId(providerId: string): Promise<Contact | null> {
    const data = await this.read();
    return (
      data.contacts.find((c) => c.emails.some((e) => e.providerId === providerId)) ??
      null
    );
  }

  async upsertContact(input: UpsertContactInput): Promise<Contact> {
    const email = normEmail(input.email);
    return this.mutate((data) => {
      const existing = data.contacts.find((c) => c.email === email);
      const ts = nowIso();
      if (existing) {
        existing.name = input.name || existing.name;
        existing.business = input.business ?? existing.business;
        existing.phone = input.phone ?? existing.phone;
        existing.service = input.service ?? existing.service;
        if (input.notes) {
          existing.notes = existing.notes
            ? `${existing.notes}\n${input.notes}`
            : input.notes;
        }
        if (input.tags?.length) {
          existing.tags = Array.from(new Set([...existing.tags, ...input.tags]));
        }
        existing.updatedAt = ts;
        existing.lastActivityAt = ts;
        return existing;
      }
      const contact: Contact = {
        id: randomUUID(),
        name: input.name,
        business: input.business,
        email,
        phone: input.phone,
        service: input.service,
        source: input.source ?? "manual",
        status: "new",
        tags: input.tags ?? [],
        notes: input.notes,
        createdAt: ts,
        updatedAt: ts,
        lastActivityAt: ts,
        unsubscribed: false,
        activities: [newActivity({ type: "created", at: ts })],
        emails: [],
      };
      data.contacts.push(contact);
      return contact;
    });
  }

  async addActivity(
    contactId: string,
    activity: ActivityInput,
  ): Promise<Contact | null> {
    return this.mutate((data) => {
      const contact = data.contacts.find((c) => c.id === contactId);
      if (!contact) return null;
      contact.activities.push(newActivity(activity));
      contact.lastActivityAt = nowIso();
      contact.updatedAt = contact.lastActivityAt;
      return contact;
    });
  }

  async recordEmail(
    contactId: string,
    email: TrackedEmail,
  ): Promise<Contact | null> {
    return this.mutate((data) => {
      const contact = data.contacts.find((c) => c.id === contactId);
      if (!contact) return null;
      contact.emails.push(email);
      contact.lastActivityAt = nowIso();
      contact.updatedAt = contact.lastActivityAt;
      return contact;
    });
  }

  async updateEmail(
    emailId: string,
    patch: Partial<TrackedEmail>,
  ): Promise<Contact | null> {
    return this.mutate((data) => {
      for (const contact of data.contacts) {
        const email = contact.emails.find((e) => e.id === emailId);
        if (email) {
          Object.assign(email, patch);
          contact.lastActivityAt = nowIso();
          contact.updatedAt = contact.lastActivityAt;
          return contact;
        }
      }
      return null;
    });
  }

  async advanceStatus(
    contactId: string,
    status: ContactStatus,
  ): Promise<Contact | null> {
    return this.mutate((data) => {
      const contact = data.contacts.find((c) => c.id === contactId);
      if (!contact) return null;
      if (STATUS_RANK[status] > STATUS_RANK[contact.status]) {
        const from = contact.status;
        contact.status = status;
        contact.activities.push(
          newActivity({
            type: "status_changed",
            detail: `${from} → ${status}`,
          }),
        );
      }
      contact.lastActivityAt = nowIso();
      contact.updatedAt = contact.lastActivityAt;
      return contact;
    });
  }

  async setUnsubscribed(contactId: string): Promise<Contact | null> {
    return this.mutate((data) => {
      const contact = data.contacts.find((c) => c.id === contactId);
      if (!contact) return null;
      contact.unsubscribed = true;
      contact.status = "unsubscribed";
      contact.activities.push(newActivity({ type: "unsubscribed" }));
      contact.lastActivityAt = nowIso();
      contact.updatedAt = contact.lastActivityAt;
      return contact;
    });
  }
}

let store: CrmStore | null = null;

export function getStore(): CrmStore {
  if (!store) {
    const dataDir = process.env.CRM_DATA_DIR || path.join(process.cwd(), ".data");
    store = new JsonFileStore(dataDir);
  }
  return store;
}
