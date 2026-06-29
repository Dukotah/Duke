// Shared category accent colors for the blog — used by the index grid/cards and
// each article's header so a post's category reads the same color everywhere.
// Muted, on-brand tones; falls back to the brand gold for any unmapped tag.
export const TAG_COLORS: Record<string, string> = {
  "Web Development": "#2563EB",
  "Web Performance": "#0891B2",
  "IT Support": "#0D9488",
  Cybersecurity: "#DC2626",
  "Local SEO": "#7C3AED",
  "AI & Automation": "#EA580C",
  "Custom Software": "#6366F1",
  "Business Strategy": "#9333EA",
};

export const tagColor = (tag: string): string => TAG_COLORS[tag] ?? "#F97316";
