// Lead intelligence: heat scoring, human-readable problem lists, and the
// dynamic call script + objection bank that the caller workspace renders.

import type { Lead, WebsiteSignals } from "./types";

// Heat score (0-100). The worse the prospect's website, the hotter the lead —
// because a broken site is the easiest sale to close. We also lift the score
// slightly for higher-value industries since those calls are worth more.
export function computeHeatScore(signals: WebsiteSignals, estValue = 0): number {
  let s = 0;

  if (signals.noWebsite) {
    s += 48; // no site at all — pure greenfield, very warm
  } else {
    if (!signals.hasSSL) s += 22; // "not secure" warning in the address bar
    if (signals.notMobileFriendly) s += 20;
    if (signals.speedScore != null) {
      s += Math.round((1 - clamp01(signals.speedScore / 100)) * 22);
    }
    if (signals.brokenLinks > 0) s += Math.min(signals.brokenLinks * 4, 12);
    if (signals.copyrightYear != null) {
      const stale = new Date().getFullYear() - signals.copyrightYear;
      if (stale >= 2) s += Math.min(stale * 2, 12);
    }
  }

  // Value nudge: up to +8 for a $5k+ estimated deal.
  s += Math.min(Math.round((estValue / 5000) * 8), 8);

  return Math.max(0, Math.min(100, Math.round(s)));
}

export function heatBand(score: number): "hot" | "warm" | "cool" {
  if (score >= 70) return "hot";
  if (score >= 45) return "warm";
  return "cool";
}

// Plain-English list of what's wrong with the prospect's site. Each entry is
// something the caller can say out loud.
export interface Problem {
  key: string;
  label: string;
  detail: string;
  severity: "high" | "medium" | "low";
}

export function problemList(signals: WebsiteSignals): Problem[] {
  const out: Problem[] = [];

  if (signals.noWebsite) {
    out.push({
      key: "no_site",
      label: "No website at all",
      detail:
        "Customers searching for them online find nothing — every lead goes to a competitor.",
      severity: "high",
    });
    return out;
  }

  if (!signals.hasSSL) {
    out.push({
      key: "ssl",
      label: "Not secure (no padlock)",
      detail:
        'Browsers show a "Not Secure" warning. Many visitors leave immediately, and Google ranks the site lower.',
      severity: "high",
    });
  }
  if (signals.notMobileFriendly) {
    out.push({
      key: "mobile",
      label: "Breaks on phones",
      detail:
        "Over half of visitors are on mobile. A site that doesn't fit the screen loses most of them.",
      severity: "high",
    });
  }
  if (signals.speedScore != null && signals.speedScore < 50) {
    out.push({
      key: "speed",
      label: `Very slow (score ${signals.speedScore}/100)`,
      detail:
        "Pages that take more than 3 seconds lose ~40% of visitors before they even load.",
      severity: signals.speedScore < 30 ? "high" : "medium",
    });
  } else if (signals.speedScore != null && signals.speedScore < 75) {
    out.push({
      key: "speed",
      label: `Sluggish (score ${signals.speedScore}/100)`,
      detail: "Noticeably slow — costing conversions and search ranking.",
      severity: "medium",
    });
  }
  if (signals.brokenLinks > 0) {
    out.push({
      key: "links",
      label: `${signals.brokenLinks} broken link${signals.brokenLinks > 1 ? "s" : ""}`,
      detail: "Dead links make the business look abandoned and frustrate buyers.",
      severity: signals.brokenLinks >= 3 ? "medium" : "low",
    });
  }
  if (signals.copyrightYear != null) {
    const stale = new Date().getFullYear() - signals.copyrightYear;
    if (stale >= 2) {
      out.push({
        key: "stale",
        label: `Footer still says ${signals.copyrightYear}`,
        detail: `Signals the site hasn't been touched in ${stale} years — visitors wonder if they're even still open.`,
        severity: "low",
      });
    }
  }

  return out;
}

// Dynamic call script. The opener and pitch reference the prospect's single
// worst problem so the very first sentence is specific and disarming.
export interface ScriptBlock {
  heading: string;
  lines: string[];
}

export function buildScript(lead: Lead): ScriptBlock[] {
  const first = lead.contactName?.split(" ")[0];
  const greet = first ? `Hi, is this ${first}?` : `Hi there —`;
  const problems = problemList(lead.signals);
  const top = problems[0];

  const hook =
    top?.key === "no_site"
      ? `I couldn't find a website for ${lead.business} anywhere — and that's actually why I'm calling.`
      : top
        ? `I was on ${lead.business}'s website this morning and noticed ${lowerFirst(top.label)} — that's actually why I'm calling.`
        : `I came across ${lead.business} and wanted to reach out about your website.`;

  return [
    {
      heading: "Opener",
      lines: [
        greet,
        `This is {repName} with Copper Bay Tech here in Sonoma County.`,
        hook,
        `Do you have thirty seconds — or did I catch you at a bad time?`,
      ],
    },
    {
      heading: "The hook (their actual problem)",
      lines: problems.slice(0, 3).map((p) => `• ${p.label} — ${p.detail}`),
    },
    {
      heading: "Value bridge",
      lines: [
        `The reason it matters: when someone Googles "${lead.industry} in ${lead.city}," your site is your handshake. Right now it's costing you customers you never even hear about.`,
        `We rebuild sites like yours — fast, secure, mobile — usually live in about two weeks.`,
      ],
    },
    {
      heading: "The ask (book the demo)",
      lines: [
        `I'd love to show you a quick before-and-after of what we'd do for ${lead.business} — no charge, no pressure.`,
        `Are mornings or afternoons better for a 15-minute screen-share this week?`,
      ],
    },
    {
      heading: "If they hesitate",
      lines: [
        `Totally fair. Can I text you the free audit of your current site so you can see exactly what I'm seeing?`,
        `What's the best number for that?`,
      ],
    },
  ];
}

// Static objection bank — searchable in the workspace so the caller never
// freezes mid-call.
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
      "Most of our rebuilds land between $2,500 and $5,000, one time — and we can usually phase it so there's no big upfront hit. But the right number depends on what you need, which is exactly what the free 15-minute call figures out.",
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
      "Love that — and we can build on what they did rather than replace it. The issue is [top problem], which is a quick fix for us. Happy to show them too; we work with in-house folks all the time.",
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

// Cold-outreach email draft, tailored to the prospect's actual website
// problems. Pure + deterministic so the UI and an assisting agent can both
// generate the same strong starting point. Returns plain text (good for a
// mailto: link); the send API wraps it in light HTML.
export function buildEmailDraft(lead: Lead, repName: string): { subject: string; body: string } {
  const problems = problemList(lead.signals);
  const top = problems[0];
  const first = lead.contactName?.split(" ")[0];
  const greeting = first ? `Hi ${first},` : "Hi,";

  const subject =
    top?.key === "no_site"
      ? `${lead.business} — getting you found online`
      : `A couple things on ${lead.business}'s website`;

  const opener =
    top?.key === "no_site"
      ? `I went looking for ${lead.business} online and couldn't find a website — which means people searching for "${lead.industry} in ${lead.city}" are landing on your competitors instead of you.`
      : top
        ? `I was looking at ${lead.business}'s website and noticed a few things that are quietly costing you customers — starting with ${lowerFirst(top.label)}.`
        : `I came across ${lead.business} and wanted to reach out about your website.`;

  const bullets = problems.slice(0, 3).map((p) => `• ${p.label} — ${p.detail}`);

  const lines = [
    greeting,
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

// Multi-touch cold-email sequence. buildEmailDraft is the first touch; most
// replies to cold outreach come from touches 2–4, so this returns the whole
// cadence — each a short, human, non-pushy follow-up that adds a NEW angle
// instead of "just bumping this." Send-after days are from the FIRST email.
export interface SequenceEmail {
  step: number;
  sendAfterDays: number;
  purpose: string; // internal note on why this touch exists
  subject: string;
  body: string;
}

export function buildEmailSequence(lead: Lead, repName: string): SequenceEmail[] {
  const first = lead.contactName?.split(" ")[0];
  const greeting = first ? `Hi ${first},` : "Hi,";
  const sign = repName && repName.trim().toLowerCase() !== "me" ? repName.trim() : "Copper Bay Tech";
  const problems = problemList(lead.signals);
  const top = problems[0];
  const noSite = top?.key === "no_site";
  const initial = buildEmailDraft(lead, repName);

  // Touch 2 — gentle bump + lower the friction to a free audit (day 3).
  const bump = [
    greeting,
    "",
    `Just floating this back to the top of your inbox. No worries if now isn't the time — I know running ${lead.business} keeps you busy.`,
    "",
    noSite
      ? `If it's useful, I can put together a quick example of what a site for ${lead.business} could look like — free, no strings.`
      : `If it's easier, I can send over the free audit of your current site so you can see exactly what I'm seeing — takes me five minutes to pull.`,
    "",
    "Want me to send it?",
    "",
    "Best,",
    sign,
  ].join("\n");

  // Touch 3 — new angle: the cost of doing nothing, framed around their town (day 7).
  const angle = [
    greeting,
    "",
    `One more thought and then I'll get out of your inbox. When someone in ${lead.city} searches for "${lead.industry.toLowerCase()} near me," the business with the faster, cleaner site usually gets the call — even when they're not the better business.`,
    "",
    `That's the gap I'd love to close for ${lead.business}. Fifteen minutes and I can show you exactly what I'd change and what it'd cost — no pressure either way.`,
    "",
    "Are mornings or afternoons better for you this week?",
    "",
    "Best,",
    sign,
  ].join("\n");

  // Touch 4 — the breakup. These get a surprisingly high reply rate (day 14).
  const breakup = [
    greeting,
    "",
    `I don't want to keep cluttering your inbox, so this is my last note on it.`,
    "",
    `If improving ${lead.business}'s website ever moves up the list, just reply here or call/text me at (707) 239-6725 and I'll take care of it. I've kept the free audit on file for you either way.`,
    "",
    "Wishing you a great rest of the year,",
    sign,
  ].join("\n");

  return [
    { step: 1, sendAfterDays: 0, purpose: "Problem-led first touch", subject: initial.subject, body: initial.body },
    { step: 2, sendAfterDays: 3, purpose: "Bump + offer the free audit", subject: `Re: ${initial.subject}`, body: bump },
    { step: 3, sendAfterDays: 7, purpose: "New angle: cost of doing nothing", subject: `${lead.business} vs. the competition in ${lead.city}`, body: angle },
    { step: 4, sendAfterDays: 14, purpose: "Breakup — high reply rate", subject: `Closing the loop on ${lead.business}`, body: breakup },
  ];
}

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}
function lowerFirst(s: string) {
  return s.charAt(0).toLowerCase() + s.slice(1);
}
