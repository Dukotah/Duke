import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DB_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DB_DIR, "outreach.db");

if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (_db) return _db;
  _db = new Database(DB_PATH);
  _db.pragma("journal_mode = WAL");
  _db.exec(`
    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      business_name TEXT NOT NULL,
      website TEXT,
      phone TEXT,
      address TEXT,
      city TEXT,
      category TEXT,
      score INTEGER,
      audit_data TEXT,
      email_subject TEXT,
      email_body TEXT,
      status TEXT NOT NULL DEFAULT 'scraped',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      audited_at TEXT,
      sent_at TEXT,
      notes TEXT
    );
  `);
  return _db;
}

export type LeadStatus = "scraped" | "audited" | "drafted" | "approved" | "sent" | "skipped";

export interface Lead {
  id: number;
  business_name: string;
  website: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  category: string | null;
  score: number | null;
  audit_data: string | null;
  email_subject: string | null;
  email_body: string | null;
  status: LeadStatus;
  created_at: string;
  audited_at: string | null;
  sent_at: string | null;
  notes: string | null;
}
