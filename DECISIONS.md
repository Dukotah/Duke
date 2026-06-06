# Decisions

_Meaningful architectural or product choices, logged with rationale._

| Date | Decision | Why |
|------|----------|-----|
| 2026-06-06 | Start Phase 1 with CI first | Broken builds should be caught immediately; CI is the safety net for everything else. |
| 2026-06-06 | 8s timeout for audit tool external HTTP calls | Vercel serverless functions time out at 60s; a single slow external host shouldn't block the whole audit. 8s is long enough for real responses, short enough to fail fast. |
| 2026-06-06 | Password reset tokens stored in Redis with 1h TTL | No new dependency; Redis already in use. 1h is long enough for a human to act, short enough to limit exposure window. |
| 2026-06-06 | Drip sequence cron via Vercel Cron (not a third-party queue) | Zero additional infra; Vercel Cron is free on Pro, matches serverless architecture, and the sequence volume (dozens of emails/day) doesn't need a real queue. |
