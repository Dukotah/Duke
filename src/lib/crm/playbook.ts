// Cold-call playbook for the LIVE CRM (db.ts / CSV leads).
//
// Generates a full call script (opener → hook → value → ask → fallback) and an
// objection bank from the fields a scraped lead actually has — name, city,
// category, website, builder, tier — with no WebsiteSignals required. Ported
// from the retired crm/store `scoring` module so the dashboard's LeadPanel can
// render a real script per lead instead of a single canned opening line.

export interface PlaybookLead {
  name: string; // business name
  city?: string;
  category?: string; // niche / industry
  website?: string;
  builder?: string; // e.g. "Wix" / "Squarespace" — a DIY tell
  tier?: string; // "A" (no site) | "B" (DIY) | "C" (has site)
  contactName?: string; // optional person name, if known
}

function hasNoSite(l: PlaybookLead): boolean {
  return (l.tier ?? "").toUpperCase() === "A" || !l.website?.trim();
}
function isDiy(l: PlaybookLead): boolean {
  return !hasNoSite(l) && ((l.tier ?? "").toUpperCase() === "B" || !!l.builder?.trim());
}

export interface ScriptBlock {
  heading: string;
  lines: string[];
}

// The opener references the lead's single biggest problem so the very first
// sentence is specific and disarming.
export function buildCallScript(lead: PlaybookLead, repName = "me"): ScriptBlock[] {
  const rep = repName && repName.trim().toLowerCase() !== "me" ? repName.trim() : "me";
  const first = lead.contactName?.split(" ")[0];
  const greet = first ? `Hi, is this ${first}?` : "Hi there —";
  const industry = (lead.category || "business").toLowerCase();
  const city = lead.city || "your area";

  const hook = hasNoSite(lead)
    ? `I went looking for ${lead.name} online and couldn't find a website anywhere — and that's actually why I'm calling.`
    : isDiy(lead)
      ? `I was on ${lead.name}'s website${lead.builder ? ` (looks like it's on ${lead.builder})` : ""} and noticed a few things that are quietly costing you customers — that's why I'm calling.`
      : `I was on ${lead.name}'s website this morning and had a couple of ideas — that's actually why I'm calling.`;

  const problems = hasNoSite(lead)
    ? [
        "No website means people searching for you online find your competitors instead.",
        "Folks check you out online before they ever call — if there's nothing to find, they move on.",
      ]
    : isDiy(lead)
      ? [
          "DIY sites usually load slowly and don't turn visitors into calls.",
          "They often don't look right on phones, where most of your visitors are.",
          "The next step isn't clear, so people leave without ever reaching out.",
        ]
      : [
          "Slow load times lose visitors before the page even finishes appearing.",
          "Mobile layout and clear calls-to-action are usually where the easy wins are.",
        ];

  return [
    {
      heading: "Opener",
      lines: [
        greet,
        `This is ${rep} with Copper Bay Tech, here in Sonoma County.`,
        hook,
        "Do you have thirty seconds — or did I catch you at a bad time?",
      ],
    },
    {
      heading: "The hook (their problem)",
      lines: problems.map((p) => `• ${p}`),
    },
    {
      heading: "Value bridge",
      lines: [
        `When someone Googles "${industry} in ${city}," your website is your handshake. Right now it's costing you customers you never even hear about.`,
        hasNoSite(lead)
          ? "I build simple, fast sites for local businesses — most start around $1,500 and go live in about two weeks."
          : "We rebuild sites like yours — fast, secure, mobile — usually live in about two weeks.",
      ],
    },
    {
      heading: "The ask (book the call)",
      lines: [
        `I'd love to show you a quick before-and-after of what we'd do for ${lead.name} — no charge, no pressure.`,
        "Are mornings or afternoons better for a 15-minute call this week?",
      ],
    },
    {
      heading: "If they hesitate",
      lines: [
        "Totally fair. Can I text or email you a free audit of your current setup so you can see exactly what I'm seeing?",
        "What's the best email or number for that?",
      ],
    },
  ];
}

// ---- Follow-up cadence -----------------------------------------------------
// The 4-touch email sequence that paces outreach over two weeks: an opener that
// leads with the lead's problem, then a bump, a fresh angle, and a breakup. Each
// step names the email template (in components/emailTemplates) that fits it, so
// the LeadPanel can recommend exactly what to send and when. Mirrors the
// day-0/3/7/14 cadence documented in GROWTH_PLAYBOOK.md.
export interface CadenceTouch {
  step: number; // 1-based touch number
  day: number; // days after the first contact
  templateKey: string; // matching emailTemplates key
  label: string;
  purpose: string;
}

// The opener template depends on whether they already have a site to critique.
export function openerTemplateKey(lead: PlaybookLead): string {
  return hasNoSite(lead) ? "no_website" : "diy_upgrade";
}

export function buildCadence(lead: PlaybookLead): CadenceTouch[] {
  return [
    { step: 1, day: 0, templateKey: openerTemplateKey(lead), label: "Opener", purpose: "Lead with their biggest problem" },
    { step: 2, day: 3, templateKey: "follow_up", label: "Bump", purpose: "Rise back to the top of the inbox" },
    { step: 3, day: 7, templateKey: "follow_up_angle", label: "New angle", purpose: "The competition-in-their-city angle" },
    { step: 4, day: 14, templateKey: "follow_up_breakup", label: "Breakup", purpose: "Last note — leave the door open" },
  ];
}

export interface CadenceSuggestion {
  cadence: CadenceTouch[];
  next: CadenceTouch | null; // recommended next touch, or null once the sequence is exhausted
  due: boolean; // whether enough time has passed to send `next` now
  daysUntilDue: number; // 0 when due/overdue; otherwise days to wait
}

// Recommend the next email in the cadence. `touchesSent` is how many outreach
// emails have already gone out; `daysSinceLast` is whole days since the most
// recent one (null when none yet). Pure — the panel passes in what it knows.
// Touch N becomes due once the gap to the previous touch has elapsed, so a lead
// contacted yesterday isn't nagged today.
export function suggestCadence(
  lead: PlaybookLead,
  touchesSent: number,
  daysSinceLast: number | null,
): CadenceSuggestion {
  const cadence = buildCadence(lead);
  const idx = Math.max(0, Math.floor(touchesSent));
  const next = idx < cadence.length ? cadence[idx] : null;

  if (!next) return { cadence, next: null, due: false, daysUntilDue: 0 };
  if (idx === 0 || daysSinceLast === null) {
    // Nothing sent yet → the opener is due now.
    return { cadence, next, due: true, daysUntilDue: 0 };
  }
  const gap = next.day - cadence[idx - 1].day;
  const daysUntilDue = Math.max(0, gap - daysSinceLast);
  return { cadence, next, due: daysUntilDue <= 0, daysUntilDue };
}

// Searchable objection bank so the caller never freezes mid-call. Responses
// reference "[their top problem]" — swap in the specific issue when reading.
export interface Objection {
  trigger: string;
  response: string;
}

// The lead's single biggest, most concrete problem — phrased to drop straight
// into a sentence ("it's costing you customers right now: <topProblem>"). Mirrors
// the tier logic the call script uses so the objection bank stays consistent.
export function topProblem(lead: PlaybookLead): string {
  if (hasNoSite(lead)) return "people searching for you online are finding your competitors instead";
  if (isDiy(lead)) return "it loads slowly and isn't turning visitors into calls";
  return "slow load times and an unclear next step are quietly costing you calls";
}

// A practical "best time to call" hint by industry, so a rep dials when the
// owner is most likely to pick up instead of mid-rush. Heuristic, not data —
// based on when each trade is typically off the floor and near a phone. `hours`
// are the preferred local-time windows as [startHour, endHour) 24h ranges, used
// to judge whether right now is a good time to dial.
interface CallWindow {
  match: RegExp;
  when: string;
  hours: [number, number][];
}
const CALL_WINDOWS: CallWindow[] = [
  { match: /restaurant|cafe|coffee|bar|pub|food|bakery|deli|caterer/i, when: "Mid-afternoon (2–4pm), between the lunch and dinner rush", hours: [[14, 16]] },
  { match: /plumb|hvac|electric|roof|construct|contractor|landscap|paint|handyman|fence|concrete|trade/i, when: "Early (7–8am) or after 4pm — they're on job sites midday", hours: [[7, 8], [16, 18]] },
  { match: /salon|spa|barber|beauty|nail|hair|massage/i, when: "Tue–Thu late morning (10–11:30am), before afternoon appointments", hours: [[10, 12]] },
  { match: /dental|dentist|medical|clinic|doctor|chiro|therap|vet|health/i, when: "Early morning (8–9am) or the lunch hour (12–1pm)", hours: [[8, 9], [12, 13]] },
  { match: /law|attorney|account|cpa|insur|real estate|realtor|consult|financ|mortgage/i, when: "Mid-morning (9–11am) or mid-afternoon (2–4pm)", hours: [[9, 11], [14, 16]] },
  { match: /auto|mechanic|repair|tire|body shop|detail/i, when: "Mid-morning (10–11am), after the morning drop-offs", hours: [[10, 11]] },
  { match: /gym|fitness|yoga|pilates|studio|trainer/i, when: "Mid-morning (10am–12pm), between class rushes", hours: [[10, 12]] },
  { match: /retail|shop|store|boutique|florist|gift/i, when: "Mid-morning (10–11am), before the lunch crowd", hours: [[10, 11]] },
];

const DEFAULT_WINDOW: CallWindow = {
  match: /.^/, // never matches
  when: "Mid-morning (10–11am) or mid-afternoon (2–4pm) tend to be best",
  hours: [[9, 11], [14, 16]],
};

function windowFor(category?: string): CallWindow {
  const c = (category ?? "").trim();
  if (c) {
    const hit = CALL_WINDOWS.find((w) => w.match.test(c));
    if (hit) return hit;
  }
  return DEFAULT_WINDOW;
}

export function bestTimeToCall(category?: string): string {
  return windowFor(category).when;
}

// Whether right now (the lead's LOCAL hour + weekday) is a good moment to dial.
// `hour` is 0–23, `weekday` is 0=Sun…6=Sat. Pure so the panel can pass in the
// lead-local time (all leads are Pacific) without this touching the clock.
export type CallTiming = "good" | "ok" | "off";
export interface CallTimingResult {
  status: CallTiming;
  label: string;
  detail: string; // the recommended window, or why now is off
}

export function callTimingFor(category: string | undefined, hour: number, weekday: number): CallTimingResult {
  const win = windowFor(category);
  if (weekday === 0 || weekday === 6) {
    return { status: "off", label: "Weekend", detail: "Most owners are off — weekdays land better." };
  }
  const inPreferred = win.hours.some(([start, end]) => hour >= start && hour < end);
  if (inPreferred) {
    return { status: "good", label: "Good time to call", detail: win.when };
  }
  // 8am–6pm local is still reasonable business hours, just not the sweet spot.
  if (hour >= 8 && hour < 18) {
    return { status: "ok", label: "OK to call", detail: `Best: ${win.when}` };
  }
  return { status: "off", label: "Off-hours", detail: `Try: ${win.when}` };
}

// Objection bank with the "[their top problem]" placeholder filled in from the
// specific lead, so a caller reads a concrete line instead of a bracketed cue.
export function buildObjections(lead: PlaybookLead): Objection[] {
  const problem = topProblem(lead);
  return OBJECTIONS.map((o) => ({
    ...o,
    response: o.response.replace(/\[their top problem\]/g, problem),
  }));
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
      "Most of our rebuilds land between $1,500 and $4,500, one time — and we can usually phase it so there's no big upfront hit. The right number depends on what you need, which is exactly what the free 15-minute call figures out.",
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
      "Love that — and we can build on what they did rather than replace it. The issue is [their top problem], which is a quick fix for us. Happy to loop them in too; we work with in-house folks all the time.",
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
      "It is, and I'll respect your time — I only called because I actually saw something on your site worth fixing. If it's not for you, no hard feelings. Can I give you 30 seconds?",
  },
];
