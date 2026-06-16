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

I went looking for {business} online and couldn't find a website anywhere. Figured it was worth reaching out, because for most local businesses that is quietly costing them customers without them ever knowing.

These days people check you out online before they ever pick up the phone. If there's nothing to find, they usually just go with whoever shows up first.

I build simple, fast websites for local businesses and most start around $1,500. Any chance you'd be open to a quick 10 minute call this week?

Thanks,
{fromName}
Copper Bay Tech`,
  },
  {
    key: "student_demo",
    label: "🎓 Student demo",
    subject: "I built {business} a sample website",
    body: `Hi {name},

I will be upfront with you. I am a student here in {city} and I started a small website company to help pay my way through school. Rather than just cold emailing you, I figured I would do the work first, so I went ahead and built {business} a sample site to show what I mean:

{demoUrl}

It is put together from what is already public about you, it loads fast, and it looks right on a phone. None of it is locked in. We can change the wording, the photos, the colors, or start over completely if you picture something different.

I am local and I am real, and I would be grateful for even ten minutes of your time. You can call or text me at (707) 239-6725, or just reply here. If it is not for you there are no hard feelings, and any feedback would mean a lot.

Thanks for giving a local student a shot,
{fromName}
Copper Bay Tech`,
  },
  {
    key: "student_no_website",
    label: "🎓 Local student",
    subject: "A local student reaching out about {business}",
    body: `Hi {name},

I will be honest with you. I am a student here in {city}, and I started a small website company to help pay for school. I went looking for {business} online and could not find a website, and for a local business that is usually costing you calls you never even hear about.

I build simple, fast sites that look right on a phone, and since I am just starting out and local, I keep the price easy. I would much rather do great work for a few businesses near me than blast a hundred strangers.

Would you be open to a quick ten minute call this week? Even a no is completely fine. I would just be grateful for the chance.

Thanks,
{fromName}
Copper Bay Tech`,
  },
  {
    key: "student_building",
    label: "🎓 Student (building skills)",
    subject: "A student built {business} a sample site",
    body: `Hi {name},

I want to be straight with you. I am still in school here in {city}, and I started this little website company for two reasons. One, to help keep myself in school. And two, because the best way to actually get good at this is to build real sites for real businesses, not classroom projects.

So instead of just asking for your time, I did the work first. I went ahead and built {business} a sample site so you can see it instead of imagine it:

{demoUrl}

It is put together from what is already public about you, it loads fast, and it looks right on a phone. Nothing is locked in. We can change the words, the photos, the colors, or start fresh if you picture something different.

I know you probably get a lot of emails like this. I am just a local student trying to do honest work and get better at my craft, and I would be grateful for even ten minutes. You can reply right here or call or text me at (707) 239-6725. If it is not for you there are no hard feelings at all, and any feedback would genuinely help me grow.

Thanks for giving a student a shot,
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
    key: "winery_demo",
    label: "🍷 Winery demo",
    subject: "I built {business} a new website",
    body: `Hi {name},

I'm {fromName}, and I build websites for small businesses around Sonoma County. I came across {business} in {city}, spent some time on your current site, and figured a winery like yours deserved one that matches the quality of what you pour. So I built you a sample to show what is possible. It is already live here:

{demoUrl}

This is just a demo to give you the idea. Nothing is set in stone. We can change the wording, the photos, the colors, or take it in a completely different direction if you have something else in mind. It is built from what is already public about you, loads fast, looks right on a phone, and it is ready to point at your own domain whenever you are.

I would genuinely love to talk it through with you. The easiest thing is to call or text me at (707) 239-6725, or just reply here. I will also try you by phone tomorrow. Worth a quick look?

Thanks,
{fromName}
Copper Bay Tech`,
  },
  {
    key: "demo_intro",
    label: "🎁 Demo intro",
    subject: "I built {business} a new website",
    body: `Hi {name},

I build websites for local businesses around Sonoma County, and I put together a sample of what a new site could look like for {business}:

{demoUrl}

This is just a demo to show what is possible. Nothing is locked in. We can change the wording, the photos, the layout, or go in a totally different direction if you have something else in mind. It is built from what is already public about you, loads fast, looks right on a phone, and it is ready to point at your own domain whenever you are.

I would love to talk it through with you. The easiest thing is to call or text me at (707) 239-6725, or just reply here. Worth a quick look?

Thanks,
{fromName}
Copper Bay Tech`,
  },
  {
    key: "follow_up",
    label: "🔁 Follow Up 1 (bump)",
    subject: "Following up, {name}",
    body: `Hi {name},

Just bumping this back to the top of your inbox in case it slipped by. I reached out a little while ago about giving the {business} website a hand.

No pressure at all. If the timing is off, just say the word and I'll check back down the road. And if you're open to it, I can jump on a quick call whenever works for you.

Thanks,
{fromName}
Copper Bay Tech`,
  },
  {
    key: "follow_up_angle",
    label: "🔁 Follow Up 2 (angle)",
    subject: "{business} vs. the competition in {city}",
    body: `Hi {name},

One more thought and then I'll get out of your inbox. When someone in {city} searches for what you do, the business with the faster, cleaner website usually gets the call, even when they aren't the better business.

That's the gap I'd love to close for {business}. Fifteen minutes and I can show you exactly what I'd change and what it would cost, no pressure either way.

Are mornings or afternoons better for you this week?

Thanks,
{fromName}
Copper Bay Tech`,
  },
  {
    key: "follow_up_breakup",
    label: "🔁 Follow Up 3 (breakup)",
    subject: "Closing the loop on {business}",
    body: `Hi {name},

I don't want to keep cluttering your inbox, so this is my last note on it.

If giving the {business} website a hand ever moves up the list, just reply here or call or text me at (707) 239-6725 and I'll take care of it. I've kept a free audit on file for you either way.

Wishing you all the best,
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
// Rep-authored templates (separate from edits to the built-in defaults).
const CUSTOM_KEY = "cbt_email_templates_custom_v1";

type Overrides = Record<string, { subject: string; body: string }>;

function readOverrides(): Overrides {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") as Overrides;
  } catch {
    return {};
  }
}

function readCustom(): EmailTemplate[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = JSON.parse(localStorage.getItem(CUSTOM_KEY) ?? "[]") as unknown;
    if (!Array.isArray(raw)) return [];
    // Defensive: only keep entries that look like templates.
    return raw.filter(
      (t): t is EmailTemplate =>
        !!t && typeof t === "object" &&
        typeof (t as EmailTemplate).key === "string" &&
        typeof (t as EmailTemplate).label === "string"
    );
  } catch {
    return [];
  }
}

function writeCustom(list: EmailTemplate[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CUSTOM_KEY, JSON.stringify(list));
}

// The free-form "custom" scratch template always sorts last so the more
// useful rep-authored templates surface above it.
function isScratch(t: EmailTemplate): boolean {
  return t.key === "custom";
}

// Returns the built-in templates (with rep edits merged in) followed by any
// rep-authored custom templates. The "custom" scratch entry stays last.
export function loadTemplates(): EmailTemplate[] {
  const overrides = readOverrides();
  const defaults = DEFAULT_TEMPLATES.map((t) =>
    overrides[t.key] ? { ...t, ...overrides[t.key] } : { ...t }
  );
  const custom = readCustom();
  const scratch = defaults.filter(isScratch);
  const builtIns = defaults.filter((t) => !isScratch(t));
  return [...builtIns, ...custom, ...scratch];
}

// True for rep-authored templates that can be renamed/deleted, as opposed to
// the built-in defaults (which can only be edited and reset).
export function isCustomTemplate(key: string): boolean {
  return readCustom().some((t) => t.key === key);
}

// Creates a new rep-authored template and persists it. Returns its key.
export function createCustomTemplate(label: string, subject: string, body: string): EmailTemplate {
  const tmpl: EmailTemplate = {
    key: `custom_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
    label: label.trim() || "Untitled",
    subject,
    body,
  };
  const list = readCustom();
  writeCustom([...list, tmpl]);
  return tmpl;
}

// Updates a rep-authored template in place. No-op for built-in defaults
// (use saveTemplateOverride for those).
export function updateCustomTemplate(key: string, patch: Partial<Omit<EmailTemplate, "key">>): void {
  const list = readCustom();
  const next = list.map((t) =>
    t.key === key ? { ...t, ...patch, label: (patch.label ?? t.label).trim() || t.label } : t
  );
  writeCustom(next);
}

// Permanently removes a rep-authored template.
export function deleteCustomTemplate(key: string): void {
  writeCustom(readCustom().filter((t) => t.key !== key));
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
  demoUrl?: string;
  claimByDate?: string;
}

// {name} is the recipient greeting — falls back to "there" when no contact
// person is known, so previews match what's actually sent (see lib/outreach
// personalize). {business} is the company name.
// Variables: {name} {business} {city} {fromName} {demoUrl} {claimByDate}
export function personalize(text: string, vars: PersonalizeVars): string {
  return text
    .replace(/\{name\}/gi, vars.name?.trim() || "there")
    .replace(/\{business\}/gi, vars.business ?? "")
    .replace(/\{city\}/gi, vars.city ?? "")
    .replace(/\{fromName\}/gi, vars.fromName ?? "")
    .replace(/\{demoUrl\}/gi, vars.demoUrl ?? "")
    .replace(/\{claimByDate\}/gi, vars.claimByDate ?? "");
}
