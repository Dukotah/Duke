// Shared CRM domain types.
// Consumed by the caller workspace (/crm), the admin dashboard (/admin),
// and the API routes under /api/crm.

export type Disposition =
  | "connected"
  | "voicemail"
  | "no_answer"
  | "callback"
  | "not_interested"
  | "booked"
  | "wrong_number"
  | "do_not_call";

export type PipelineStage =
  | "new"
  | "attempting"
  | "contacted"
  | "callback_scheduled"
  | "demo_booked"
  | "won"
  | "lost";

export const PIPELINE_STAGES: PipelineStage[] = [
  "new",
  "attempting",
  "contacted",
  "callback_scheduled",
  "demo_booked",
  "won",
  "lost",
];

export const STAGE_LABELS: Record<PipelineStage, string> = {
  new: "New",
  attempting: "Attempting",
  contacted: "Contacted",
  callback_scheduled: "Callback Set",
  demo_booked: "Demo Booked",
  won: "Won",
  lost: "Lost",
};

export const DISPOSITION_LABELS: Record<Disposition, string> = {
  connected: "Connected",
  voicemail: "Voicemail",
  no_answer: "No Answer",
  callback: "Callback Requested",
  not_interested: "Not Interested",
  booked: "Demo Booked",
  wrong_number: "Wrong Number",
  do_not_call: "Do Not Call",
};

// Signals captured from the website-audit tools. These drive the heat score
// and the dynamic call script — they are the reason this CRM converts: the
// caller opens with the prospect's *actual* problems.
export interface WebsiteSignals {
  noWebsite: boolean;
  hasSSL: boolean;
  speedScore: number | null; // Lighthouse performance 0-100
  mobileScore: number | null; // mobile-friendliness 0-100
  brokenLinks: number;
  notMobileFriendly: boolean;
  copyrightYear: number | null; // last year shown in footer, if detectable
}

export type ActivityType = "call" | "note" | "status" | "callback" | "email";

export interface Activity {
  id: string;
  leadId: string;
  type: ActivityType;
  disposition?: Disposition;
  body?: string;
  durationSec?: number;
  repId?: string;
  createdAt: string; // ISO timestamp
}

export interface Lead {
  id: string;
  business: string;
  contactName?: string;
  phone: string;
  website?: string;
  industry: string;
  city: string;
  state: string;
  signals: WebsiteSignals;
  heatScore: number; // 0-100, computed from signals
  stage: PipelineStage;
  ownerRepId?: string;
  estValue: number; // estimated deal value in USD
  source: string;
  callbackAt?: string | null; // ISO timestamp of next scheduled callback
  attempts: number;
  lastContactedAt?: string | null;
  createdAt: string;
  activities: Activity[];
}

export interface Rep {
  id: string;
  name: string;
  avatarColor: string; // tailwind-friendly hex for avatar chip
}

// Aggregate metrics surfaced on the live performance bar and the admin
// dashboard.
export interface CrmStats {
  totalLeads: number;
  callsToday: number;
  connectsToday: number;
  connectRate: number; // 0-1
  bookedToday: number;
  wonThisMonth: number;
  pipelineValue: number;
  stageCounts: Record<PipelineStage, number>;
  callbacksDue: number;
}
