// Lead intelligence: per-lead heat scoring, a plain-English problem list, a
// dynamically-tailored call script, a tailored cold-email draft, and the
// objection bank rendered in the caller workspace.
//
// Ported from the original single-operator CRM prototype and adapted to the
// lead shape this CRM actually uses (a CSV of scraped Sonoma County
// businesses). The prototype keyed everything off a rich WebsiteSignals
// object captured from the audit tools; here we derive the equivalent signals
// from the fields we have (website presence, the detected site builder, the
// scraper's tier + outreach score), so the caller still opens with the
// prospect's *actual* problem — the core conversion lever.

// The subset of the CSV lead fields the intelligence layer reads. Kept
// structurally compatible with the Lead interface used across the CRM UI so
// any lead object can be passed straight in.
export interface IntelLead {
  name: string;
  category: string;
  city: string;
  website: string;
  builder: string;
  tier: string;
  tier_reason: string;
  outreach_score: number;
}

// DIY / dated platforms — a strong tell that the site is hurting the business
// (poor mobile, weak SEO, "looks like 2009"). WordPress/custom builds are not
// flagged here since those are usually a redesign conversation, not a rescue.
const WEAK_BUILDERS = [
  "wix",
  "weebly",
  "squarespace",
  "godaddy",
  "google sites",
  "joomla",
  "blogger",
  "homestead",
  "network solutions",
  "web.com",
  "yola",
  "jimdo",
  "diy",
];

function hasWebsite(lead: IntelLead): boolean {
  return !!lead.website && lead.website.trim().length > 0;
}

function isWeakBuilder(lead: IntelLead): boolean {
  const b = (lead.builder || "").toLowerCase();
  if (!b) return false;
  return WEAK_BUILDERS.some((w) => b.includes(w));
}

// Heat score (0-100). The worse the prospect's web presence, the hotter the
// lead — a missing or broken site is the easiest sale to close. We blend the
// scraper's existing outreach score (already 0-100) with website-quality
// signals so the ranking stays consistent with the rest of the workspace.
export function computeHeatScore(lead: IntelLead): number {
  if (!hasWebsite(lead)) return 90; // greenfield — pure "new website" sale

  let s = Math.round(clamp01((lead.outreach_score || 0) / 100) * 60);
  if (isWeakBuilder(lead)) s += 20;
  if (lead.tier === "A") s += 15;
  else if (lead.tier === "B") s += 8;

  return Math.max(0, Math.min(100, s));
}

export function heatBand(score: number): "hot" | "warm" | "cool" {
  if (score >= 70) return "hot";
  if (score >= 45) return "warm";
  return "cool";
}

export const HEAT_LABELS: Record<"hot" | "warm" | "cool", string> = {
  hot: "Hot lead",
  warm: "Warm lead",
  cool: "Cool lead",
};

// Plain-English list of what's wrong with the prospect's presence. Each entry
// is something the caller can say out loud.
export interface Problem {
  key: string;
  label: string;
  detail: string;
  severity: "high" | "medium" | "low";
}

export function problemList(lead: IntelLead): Problem[] {
  const out: Problem[] = [];

  if (!hasWebsite(lead)) {
    out.push({
      key: "no_site",
      label: "No website at all",
      detail:
        "Customers searching for them online find nothing — every lead goes to a competitor.",
      severity: "high",
    });
    return out;
  }

  if (isWeakBuilder(lead)) {
    out.push({
      key: "builder",
      label: `Built on ${lead.builder} — dated and DIY`,
      detail:
        "Drag-and-drop sites tend to be slow, weak on mobile, and invisible to Google. It looks homemade, and customers notice.",
      severity: "medium",
    });
  }

  if (lead.outreach_score >= 80) {
    out.push({
      key: "underperforming",
      label: "Site isn't pulling its weight",
      detail:
        "On our scoring this is a high-opportunity site — it's costing them customers they never hear about.",
      severity: "medium",
    });
  } else if (lead.outreach_score >= 60) {
    out.push({
      key: "underperforming",
      label: "Room to convert better",
      detail: "Decent presence, but leaving calls and bookings on the table.",
      severity: "low",
    });
  }

  // Surface the scraper's own reason as context the caller can lean on.
  if (lead.tier_reason && lead.tier_reason.trim()) {
    out.push({
      key: "tier_reason",
      label: lead.tier_reason.trim(),
      detail: "What flagged this business as worth a call.",
      severity: "low",
    });
  }

  return out;
}

// Dynamic call script. The opener references the prospect's single worst
// problem so the very first sentence is specific and disarming.
export interface ScriptBlock {
  heading: string;
  lines: string[];
}

export function buildScript(lead: IntelLead, repName = "me"): ScriptBlock[] {
  const rep = repName && repName.trim().toLowerCase() !== "me" ? repName.trim() : "";
  const problems = problemList(lead);
  const top = problems[0];

  const hook =
    top?.key === "no_site"
      ? `I couldn't find a website for ${lead.name} anywhere — and that's actually why I'm calling.`
      : top
        ? `I was looking at ${lead.name}'s website and noticed ${lowerFirst(top.label)} — that's actually why I'm calling.`
        : `I came across ${lead.name} and wanted to reach out about your website.`;

  return [
    {
      heading: "Opener",
      lines: [
        "Hi there —",
        `This is ${rep || "{your name}"} with Copper Bay Tech here in Sonoma County.`,
        hook,
        "Do you have thirty seconds — or did I catch you at a bad time?",
      ],
    },
    {
      heading: "The hook (their actual problem)",
      lines: problems.slice(0, 3).map((p) => `• ${p.label} — ${p.detail}`),
    },
    {
      heading: "Value bridge",
      lines: [
        `The reason it matters: when someone Googles "${lead.category} in ${lead.city}," your site is your handshake. Right now it's costing you customers you never even hear about.`,
        "We rebuild sites like yours — fast, secure, mobile — usually live in about two weeks.",
      ],
    },
    {
      heading: "The ask (book the demo)",
      lines: [
        `I'd love to show you a quick before-and-after of what we'd do for ${lead.name} — no charge, no pressure.`,
        "Are mornings or afternoons better for a 15-minute screen-share this week?",
      ],
    },
    {
      heading: "If they hesitate",
      lines: [
        "Totally fair. Can I text you the free audit of your current site so you can see exactly what I'm seeing?",
        "What's the best number for that?",
      ],
    },
  ];
}

// Objection bank — searchable in the workspace so the caller never freezes
// mid-call. Use topProblemLabel() to fill the "[their top problem]" slot.
export interface Objection {
  trigger: string;
  response: string;
}

export const OBJECTIONS: Objection[] = [
  {
    trigger: "We already have a website",
    response:
      "Totally — and I'm not saying it's bad. I'm saying it's costing you customers right now: [their top problem]. A quick rebuild fixes that and pays for itself fast. Worth 15 minutes to see?",
  },
  {
    trigger: "How much does it cost?",
    response:
      "Most of our rebuilds land between $1,500 and $4,500, one time — and we can usually phase it so there's no big upfront hit. But the right number depends on what you need, which is exactly what the free 15-minute call figures out.",
  },
  {
    trigger: "I don't have time",
    response:
      "That's exactly why people work with us — we do all the heavy lifting. The call itself is 15 minutes, and we handle the rest. Mornings or afternoons better for you?",
  },
  {
    trigger: "We're not interested",
    response:
      "Fair enough — can I ask, is it that the timing's off, or that the website just isn't a priority right now? Either way I can send you the free audit so it's there when you need it.",
  },
  {
    trigger: "My nephew/cousin built it",
    response:
      "Love that — and we can build on what they did rather than replace it. The issue is [their top problem], which is a quick fix for us. Happy to show them too; we work with in-house folks all the time.",
  },
  {
    trigger: "Just email me something",
    response:
      "Happy to — what's the best address? And so I send the right thing: is your main goal more calls, more bookings, or just looking more professional? I'll tailor the audit to that.",
  },
  {
    trigger: "I'm with a customer / call me back",
    response:
      "No problem at all — I'll be quick. What's a better time today or tomorrow? I'll lock it in so I'm not chasing you.",
  },
  {
    trigger: "Is this a sales call?",
    response:
      "It is, and I'll respect your time — I only called because I actually saw a problem on your site worth fixing. If it's not for you, no hard feelings. Can I give you 30 seconds?",
  },
];

// The single worst problem, phrased for the objection-bank placeholder.
export function topProblemLabel(lead: IntelLead): string {
  const top = problemList(lead)[0];
  return top ? lowerFirst(top.label) : "a few things that are costing you customers";
}

// Cold-outreach email draft, tailored to the prospect's actual problems.
// Pure + deterministic so the UI and an assisting agent generate the same
// strong starting point. Returns plain text (good for a mailto: link).
export function buildEmailDraft(
  lead: IntelLead,
  repName: string,
): { subject: string; body: string } {
  const problems = problemList(lead);
  const top = problems[0];

  const subject =
    top?.key === "no_site"
      ? `${lead.name} — getting you found online`
      : `A couple things on ${lead.name}'s website`;

  const opener =
    top?.key === "no_site"
      ? `I went looking for ${lead.name} online and couldn't find a website — which means people searching for "${lead.category} in ${lead.city}" are landing on your competitors instead of you.`
      : top
        ? `I was looking at ${lead.name}'s website and noticed a few things that are quietly costing you customers — starting with ${lowerFirst(top.label)}.`
        : `I came across ${lead.name} and wanted to reach out about your website.`;

  const bullets = problems.slice(0, 3).map((p) => `• ${p.label} — ${p.detail}`);

  const lines = [
    "Hi,",
    "",
    opener,
    ...(bullets.length ? ["", "Here's what stood out:", ...bullets] : []),
    "",
    "We rebuild sites like yours — fast, secure, and mobile-friendly — usually live in about two weeks. It tends to pay for itself quickly in customers you're currently losing.",
    "",
    "Would you be open to a quick 15-minute call this week? I'll walk you through exactly what I'd change — no charge, no pressure.",
    "",
    "Best,",
    ...(repName && repName.trim().toLowerCase() !== "me" ? [repName.trim()] : []),
    "Copper Bay Tech",
  ];

  return { subject, body: lines.join("\n") };
}

// ─── Engagement-aware scoring ─────────────────────────────────────────────────
// The queue's static score (the scraper's `outreach_score`, 0-100) says nothing
// about whether the prospect has actually engaged. Two leads can share a score
// of 70 while one has opened three emails and asked a question and the other has
// never been touched — the first should rank far higher. These helpers fold real
// CRM activity (opens, clicks, replies, call outcomes) into a single adjusted
// score so warm, engaged leads float to the top of the dialer.

export interface EngagementSignals {
  opens: number;
  clicks: number;
  calls: number;
  replied: boolean;
  interested: boolean; // a call/note/status outcome the rep marked "interested"
  notInterested: boolean;
}

// Minimal shape we read off a CRM activity entry (matches db.ts ActivityEntry).
interface ActivityLike {
  type: string;
  outcome?: string;
}

export function engagementSignalsFromActivities(activities: ActivityLike[]): EngagementSignals {
  let opens = 0,
    clicks = 0,
    calls = 0;
  let replied = false,
    interested = false,
    notInterested = false;

  for (const a of activities) {
    const o = (a.outcome || "").toLowerCase();
    if (a.type === "email") {
      if (o === "opened") opens++;
      else if (o === "clicked") clicks++;
      else if (o === "replied") replied = true;
    } else if (a.type === "call") {
      calls++;
      if (o === "interested") interested = true;
      else if (o === "not_interested") notInterested = true;
    } else if (a.type === "status_change") {
      if (o === "interested") interested = true;
      else if (o === "not_interested") notInterested = true;
    }
  }

  return { opens, clicks, calls, replied, interested, notInterested };
}

// Bounded boost applied on top of the base score. A clear "not interested"
// sinks the lead (effectively zeroes it); replies and a rep "interested" flag
// are the strongest positive intent signals; clicks beat opens. Opens/clicks
// are capped so a single over-eager inbox prefetch can't dominate the ranking.
export function engagementBoost(s: EngagementSignals): number {
  if (s.notInterested) return -100; // outranked by everything still in play
  let b = 0;
  if (s.replied) b += 30;
  if (s.interested) b += 25;
  b += Math.min(s.clicks, 3) * 6;
  b += Math.min(s.opens, 3) * 3;
  return b;
}

export interface ScoredLead {
  base: number; // the scraper's outreach_score, clamped 0-100
  boost: number; // engagement delta (can be negative)
  score: number; // base + boost, clamped 0-100
}

// Combine a base score with live engagement into the number the queue ranks on.
export function scoreWithEngagement(base: number, signals: EngagementSignals): ScoredLead {
  const b = Math.max(0, Math.min(100, Math.round(base || 0)));
  const boost = engagementBoost(signals);
  return { base: b, boost, score: Math.max(0, Math.min(100, b + boost)) };
}

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}
function lowerFirst(s: string) {
  return s.charAt(0).toLowerCase() + s.slice(1);
}
