interface AuditOpportunity {
  title?: string;
  displayValue?: string;
}

interface AuditData {
  score: number;
  opportunities?: AuditOpportunity[];
  metrics?: {
    lcp?: { value: string };
    fcp?: { value: string };
  };
}

export function generateOutreachEmail(
  businessName: string,
  website: string,
  auditData: AuditData
): { subject: string; body: string } {
  const score = auditData.score;
  const topIssues = (auditData.opportunities ?? []).slice(0, 2);
  const lcp = auditData.metrics?.lcp?.value ?? null;

  const scoreLabel =
    score < 30 ? "critically slow" : score < 50 ? "quite slow" : score < 70 ? "below average" : "average";

  const issueLines = topIssues
    .filter((o) => o.title)
    .map((o) => `• ${o.title}${o.displayValue ? ` (${o.displayValue})` : ""}`)
    .join("\n");

  // A plain, personal subject (no score/clickbait) reads as a 1:1 note rather
  // than a marketing blast — better for landing in the Primary inbox tab.
  const subject = `Quick question about ${businessName}'s website`;

  const body = `Hi there,

I was looking at local ${businessName.toLowerCase().includes("restaurant") || businessName.toLowerCase().includes("café") ? "restaurants" : "businesses"} in the area and ran your website through Google's PageSpeed tool.

${website} scored ${score}/100 — ${scoreLabel} by Google's standards.${lcp ? ` Pages are taking around ${lcp} to load.` : ""}

The top issues dragging your score down:
${issueLines || "• Images and scripts that aren't optimized for speed"}

Why this matters: Google uses page speed as a ranking signal. A score this low can push your site down in local search results — meaning customers searching for what you offer are finding your competitors instead.

I'm Duke, a local web developer based in Santa Rosa. I help Sonoma County businesses fix exactly these kinds of issues — faster sites, better local rankings, more customers finding you online.

Would you be open to a 15-minute call to walk through what I found and what it would take to fix it? No pitch, no pressure — just a straight conversation.

You can reply here or call/text me at (707) 239-6725.

— Duke
Copper Bay Tech
copperbaytech.com`;

  return { subject, body };
}
