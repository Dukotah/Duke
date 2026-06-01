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

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}
function lowerFirst(s: string) {
  return s.charAt(0).toLowerCase() + s.slice(1);
}
