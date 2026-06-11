// Automated drip sequence for inbound CRM leads.
//
// Step 0: initial outreach (sent by rep manually — not handled here)
// Step 1 (day 3): gentle check-in
// Step 2 (day 7): value angle — the common issues found on small-business sites
// Step 3 (day 14): breakup email — last touch before archiving

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

I work with small businesses on websites, IT support, and cybersecurity. I reached out because I think there's a quick win for {business} — and I'd hate for it to slip by.

Would a 15-minute call this week work? No slides, no pitch deck — just a real conversation.

Reply here, or grab a time: https://copperbaytech.com/schedule

— Duke
Copper Bay Tech | (707) 239-6725`,
  },
  {
    step: 2,
    delayDays: 7,
    subject: "The 3 things I usually find on a site like {business}'s",
    body: `Hi {name},

I'll keep this short.

When I look at a small-business website, the same handful of issues come up again and again: slow load times that quietly cost you visitors, an SSL or security gap that's been sitting open, and forms or mobile layouts that don't quite work.

Most of them are straightforward to fix — they just get missed because no one's flagging them.

I'd be glad to look at {business} and tell you exactly what I see. Free, no strings.

15 minutes — worth it?

— Duke
Copper Bay Tech | copperbaytech.com`,
  },
  {
    step: 3,
    delayDays: 14,
    subject: "Closing the loop on {business}",
    body: `Hi {name},

I've reached out a couple of times and I don't want to keep cluttering your inbox.

This is my last note. If timing just isn't right, I completely understand — small business is full on.

If things change down the road — website, IT support, cybersecurity — feel free to reach out directly at contact@copperbaytech.com or (707) 239-6725. We're fast, straightforward, and we don't do long contracts.

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
