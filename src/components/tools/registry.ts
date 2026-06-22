// Single source of truth for the consolidated /tools deck.
// Each tool is a tab in /tools AND keeps its own SEO landing page (href), which
// embeds the same <ToolDeck initial="<slug>"/>. Order = live sales-walkthrough order.

export type ToolSlug =
  | "audit"
  | "compare"
  | "missed-call"
  | "cost-estimator"
  | "it-health-check"
  | "security"
  | "email-headers"
  | "password"
  | "business-analysis";

export interface ToolTab {
  slug: ToolSlug;
  /** short tab label */
  tab: string;
  /** tool heading */
  title: string;
  /** one-line description */
  tagline: string;
  /** standalone SEO landing page; deck deep-links here for not-yet-inlined tabs */
  href: string;
}

export const TOOL_TABS: ToolTab[] = [
  {
    slug: "audit",
    tab: "Website Audit",
    title: "Full Website Audit",
    tagline: "Speed, SSL, SEO, security headers, DNS, schema, broken links & mobile — all at once.",
    href: "/audit",
  },
  {
    slug: "compare",
    tab: "Compare",
    title: "Compare to a Competitor",
    tagline: "Two URLs side by side — speed, SSL, SEO, and mobile.",
    href: "/compare",
  },
  {
    slug: "missed-call",
    tab: "Missed-Call ROI",
    title: "Missed-Call Revenue Calculator",
    tagline: "See the revenue slipping away from unanswered calls.",
    href: "/tools/missed-call-calculator",
  },
  {
    slug: "cost-estimator",
    tab: "Cost Estimator",
    title: "Website Cost Estimator",
    tagline: "Ballpark a build + care plan in under a minute.",
    href: "/tools/website-cost-estimator",
  },
  {
    slug: "it-health-check",
    tab: "IT Health Check",
    title: "Free IT Health Check",
    tagline: "A 2-minute read on your support, security, and risk posture.",
    href: "/it-health-check",
  },
  {
    slug: "security",
    tab: "Security Check",
    title: "Security & Compliance Check",
    tagline: "A 60-second self-assessment with a risk score.",
    href: "/tools/compliance",
  },
  {
    slug: "email-headers",
    tab: "Email Inspector",
    title: "Email Header Inspector",
    tagline: "Paste raw headers — see SPF / DKIM / DMARC and the delivery path.",
    href: "/tools/email-headers",
  },
  {
    slug: "password",
    tab: "Password Lab",
    title: "Password Strength & Generator",
    tagline: "Strength meter, crack-time estimate, and a strong generator.",
    href: "/tools/password",
  },
  {
    slug: "business-analysis",
    tab: "Business Analysis",
    title: "Online Business Analysis",
    tagline: "A fuller read on how your business shows up online.",
    href: "/business-analysis",
  },
];

export const toolBySlug = (slug: string): ToolTab | undefined =>
  TOOL_TABS.find((t) => t.slug === slug);
