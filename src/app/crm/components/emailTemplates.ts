// Shared email scripts for outreach (bulk + single lead).
// Reps can edit any script and save their own version; edits persist in the
// browser via localStorage and can be reset back to the default at any time.

export interface EmailTemplate {
  key: string;
  label: string;
  subject: string;
  body: string;
}

// Written to sound like a real person wrote them: plain words, no em dashes,
// no hyphenated phrases. Variables: {name} {business} {city} {fromName}
export const DEFAULT_TEMPLATES: EmailTemplate[] = [
  {
    key: "no_website",
    label: "🔥 No Website",
    subject: "Quick question about {business}",
    body: `Hi {name},

I went looking for {business} online and couldn't find a website anywhere. Figured it was worth reaching out, because for most local businesses that quietly costs them customers without them ever knowing.

These days people check you out online before they ever pick up the phone. If there's nothing to find, they usually just go with whoever shows up first.

I build simple, fast websites for local businesses and most start around $1,500. Any chance you'd be open to a quick 10 minute call this week?

Thanks,
{fromName}
Copper Bay Tech`,
  },
  {
    key: "diy_upgrade",
    label: "⚡ Site Upgrade",
    subject: "An idea for the {business} website",
    body: `Hi {name},

I was on the {business} website and a couple of things jumped out that could help you turn more of your visitors into actual calls and customers.

Cleaning up sites like yours is pretty much all I do. Faster loading, looks right on phones, and clearer buttons so people know exactly what to do next. Most projects wrap up in under two weeks.

Happy to throw together a quick before and after mockup so you can see what I mean. Worth a 10 minute call?

Thanks,
{fromName}
Copper Bay Tech`,
  },
  {
    key: "follow_up",
    label: "🔁 Follow Up",
    subject: "Following up, {name}",
    body: `Hi {name},

Just bumping this back to the top of your inbox in case it slipped by. I reached out a little while ago about giving the {business} website a hand.

No pressure at all. If the timing is off, just say the word and I'll check back down the road. And if you're open to it, I can jump on a quick call whenever works for you.

Thanks,
{fromName}
Copper Bay Tech`,
  },
  {
    key: "custom",
    label: "✏️ Custom",
    subject: "",
    body: "",
  },
];

const STORAGE_KEY = "cbt_email_templates_v1";

type Overrides = Record<string, { subject: string; body: string }>;

function readOverrides(): Overrides {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") as Overrides;
  } catch {
    return {};
  }
}

// Returns the templates with any saved rep edits merged in.
export function loadTemplates(): EmailTemplate[] {
  const overrides = readOverrides();
  return DEFAULT_TEMPLATES.map((t) =>
    overrides[t.key] ? { ...t, ...overrides[t.key] } : { ...t }
  );
}

export function saveTemplateOverride(key: string, subject: string, body: string): void {
  if (typeof window === "undefined") return;
  const overrides = readOverrides();
  overrides[key] = { subject, body };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
}

export function resetTemplateOverride(key: string): void {
  if (typeof window === "undefined") return;
  const overrides = readOverrides();
  delete overrides[key];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
}

export function hasOverride(key: string): boolean {
  return key in readOverrides();
}

export interface PersonalizeVars {
  name?: string;
  business?: string;
  city?: string;
  fromName?: string;
}

export function personalize(text: string, vars: PersonalizeVars): string {
  return text
    .replace(/\{name\}/gi, vars.name ?? "")
    .replace(/\{business\}/gi, vars.business ?? "")
    .replace(/\{city\}/gi, vars.city ?? "")
    .replace(/\{fromName\}/gi, vars.fromName ?? "");
}
