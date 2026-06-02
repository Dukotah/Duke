// Derive the single most compelling website problem from a lead's signals.
// Priority mirrors the call-script logic: lead with the most painful issue.

import type { WebsiteSignals } from "@/lib/crm/types";

export function topProblem(s: WebsiteSignals): string {
  if (s.noWebsite) return "No website";
  if (!s.hasSSL) return "No SSL (insecure)";
  if (s.notMobileFriendly) return "Not mobile-friendly";
  if (s.speedScore !== null && s.speedScore < 50)
    return `Slow site (${s.speedScore})`;
  if (s.brokenLinks > 0)
    return `${s.brokenLinks} broken link${s.brokenLinks === 1 ? "" : "s"}`;
  if (s.copyrightYear !== null && s.copyrightYear < new Date().getFullYear() - 2)
    return `Stale (©${s.copyrightYear})`;
  return "Minor issues";
}
