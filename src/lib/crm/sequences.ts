// Automated drip sequence for inbound CRM leads.
//
// Step 0: initial outreach (sent by rep manually — not handled here)
// Step 1 (day 3): gentle check-in
// Step 2 (day 7): social-proof angle
// Step 3 (day 14): breakup email — last touch before archiving
//
// Contact details (booking link, email, phone, domain) are pulled from
// `@/config/site` so the drip never drifts from the rest of the site. These
// used to be hardcoded — and were stale: the booking link pointed at a dead
// `calendly.com/copperbaytech` and the sign-off used `duke@` instead of the
// real `contact@` address. Edit the constants in `config/site.ts` once and
// every follow-up email stays correct.

import { SITE_URL, BOOKING_URL, EMAIL, PHONE } from "@/config/site";

// An absolute, clickable booking link for use inside an email. BOOKING_URL is a
// site-relative path (e.g. "/schedule") today, but if it's ever swapped for an
// absolute Calendly/Cal.com URL this still produces the right link.
export const BOOKING_LINK = BOOKING_URL.startsWith("http")
  ? BOOKING_URL
  : `${SITE_URL}${BOOKING_URL}`;

// Bare host for plain-text sign-offs, e.g. "copperbaytech.com".
const SITE_HOST = SITE_URL.replace(/^https?:\/\//, "").replace(/\/$/, "");

export interface SequenceStep {
  step: number;
  delayDays: number; // days after the previous contact before sending this step
  subject: string;
  body: string;
}

export const SEQUENCE: SequenceStep[] = [
  {
    step: 1,
    delayDays: 3,
    subject: "Re: quick question about {business}",
    body: `Hi {name},

Just wanted to follow up in case my last note got buried.

I work with small businesses in Sonoma County on websites, IT support, and cybersecurity. I reached out because I think there's a quick win for {business} — and I'd hate for it to slip by.

Would a 15-minute call this week work? No slides, no pitch deck — just a real conversation.

Reply here or grab a time directly: ${BOOKING_LINK}

— Duke
Copper Bay Tech | ${PHONE}`,
  },
  {
    step: 2,
    delayDays: 7,
    subject: "What a Healdsburg winery told us last month",
    body: `Hi {name},

I'll keep this short.

Last month we helped a local winery in Healdsburg cut their website load time by 60% and fix a security gap that had been sitting open for two years. Their words after: "I wish we'd done this sooner."

Most of the issues we find are straightforward to fix — they just get ignored because there's no one flagging them.

I'd love to take a look at {business} and tell you exactly what I see. Free, no strings.

15 minutes — worth it? ${BOOKING_LINK}

— Duke
Copper Bay Tech | ${SITE_HOST}`,
  },
  {
    step: 3,
    delayDays: 14,
    subject: "Closing the loop on {business}",
    body: `Hi {name},

I've reached out a couple of times and I don't want to keep cluttering your inbox.

This is my last note. If timing just isn't right, I completely understand — small business is full on.

If things change down the road — website, IT support, cybersecurity — feel free to reach out directly at ${EMAIL} or ${PHONE}. We're local, we're fast, and we don't do long contracts.

Wishing {business} a great rest of the year.

— Duke
Copper Bay Tech`,
  },
];

export const MAX_SEQUENCE_STEP = SEQUENCE.length; // 3 follow-ups max

export function getNextStep(currentStep: number): SequenceStep | null {
  return SEQUENCE.find((s) => s.step === currentStep + 1) ?? null;
}

// Fill {name}, {business}, {city} placeholders.
export function personalizeSequence(template: string, lead: { name: string; email: string }): string {
  const domain = lead.email.split("@")[1] ?? "";
  const business = lead.name || domain;
  const firstName = lead.name.split(" ")[0] || "there";
  return template
    .replace(/\{name\}/g, firstName)
    .replace(/\{business\}/g, business);
}
