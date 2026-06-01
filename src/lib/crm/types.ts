// Core CRM domain types shared across the store, API routes, and dashboard.

export type ContactStatus =
  | "new" // captured, never contacted
  | "contacted" // an outreach email was sent
  | "opened" // recipient opened an email
  | "clicked" // recipient clicked a link
  | "replied" // recipient replied — hottest signal
  | "bounced" // address bounced
  | "complained" // marked as spam
  | "unsubscribed" // opted out
  | "won" // became a client
  | "lost"; // explicitly disqualified

// Higher number = further along / stickier. Status never moves backwards
// automatically (a later "opened" event won't overwrite "replied").
export const STATUS_RANK: Record<ContactStatus, number> = {
  new: 0,
  contacted: 1,
  opened: 2,
  clicked: 3,
  replied: 4,
  won: 5,
  // Off-ramps are terminal and outrank progress states so they stick.
  bounced: 6,
  complained: 7,
  unsubscribed: 8,
  lost: 9,
};

export type ActivityType =
  | "created"
  | "form_submitted"
  | "email_sent"
  | "email_delivered"
  | "email_opened"
  | "email_clicked"
  | "email_bounced"
  | "email_complained"
  | "email_replied"
  | "unsubscribed"
  | "note"
  | "status_changed";

export interface Activity {
  id: string;
  type: ActivityType;
  at: string; // ISO timestamp
  detail?: string;
  meta?: Record<string, unknown>;
}

export type EmailStatus =
  | "sent"
  | "delivered"
  | "opened"
  | "clicked"
  | "bounced"
  | "complained";

export interface TrackedEmail {
  id: string; // our id, embedded in the tracking pixel + Resend tag
  providerId?: string; // Resend email id, for webhook correlation
  campaign?: string;
  subject: string;
  sentAt: string;
  status: EmailStatus;
  opens: number;
  clicks: number;
  lastEventAt?: string;
}

export interface Contact {
  id: string;
  name: string;
  business?: string;
  email: string;
  phone?: string;
  service?: string;
  source: "contact_form" | "manual" | "import" | "audit";
  status: ContactStatus;
  tags: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
  lastActivityAt: string;
  unsubscribed: boolean;
  activities: Activity[];
  emails: TrackedEmail[];
}

export interface CrmData {
  version: 1;
  contacts: Contact[];
}
