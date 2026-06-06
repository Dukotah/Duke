import { NextRequest, NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";

function isAdmin(req: NextRequest) {
  return req.headers.get("x-user-role") === "admin";
}

const set = (v?: string) => Boolean(v && v.trim().length > 0);

// GET /api/crm/admin/health — plain-language status of every integration.
// Only ever returns booleans/labels, never the secret values themselves.
export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  // Live-test the database connection if its keys are present.
  const hasRedisKeys = set(process.env.UPSTASH_REDIS_REST_URL) && set(process.env.UPSTASH_REDIS_REST_TOKEN);
  let redisOk = false;
  if (hasRedisKeys) {
    try {
      await getRedis().ping();
      redisOk = true;
    } catch {
      redisOk = false;
    }
  }

  const hasResend = set(process.env.RESEND_API_KEY);
  const domainVerified = (process.env.OUTREACH_DOMAIN_VERIFIED ?? "").trim().toLowerCase() === "true";

  const checks = [
    {
      id: "database",
      label: "Database",
      required: true,
      ok: redisOk,
      vars: ["UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN"],
      okText: "Connected. Leads, reps, and activity are being saved.",
      problem: hasRedisKeys
        ? "The database keys are set but the connection failed. Double-check the URL and token from Upstash."
        : "Not connected. The CRM can't save or load anything until this is set up. This is the one thing you must configure.",
    },
    {
      id: "login",
      label: "Login security",
      required: true,
      ok: set(process.env.SESSION_SECRET),
      vars: ["SESSION_SECRET"],
      okText: "Sign-ins are secured.",
      problem: "Agents can't sign in with email & password yet. Set this to any long random string (40+ characters).",
    },
    {
      id: "admin",
      label: "Your admin account",
      required: true,
      ok: set(process.env.ADMIN_EMAIL) && set(process.env.ADMIN_PASSWORD),
      vars: ["ADMIN_EMAIL", "ADMIN_PASSWORD"],
      okText: "Your admin login is set up. Sign in once to activate it.",
      problem: "No real admin login exists yet. Set these to create your own admin account the next time you sign in.",
    },
    {
      id: "email",
      label: "Email delivery",
      required: false,
      ok: hasResend && domainVerified,
      vars: hasResend ? ["OUTREACH_DOMAIN_VERIFIED"] : ["RESEND_API_KEY", "OUTREACH_DOMAIN_VERIFIED"],
      okText: "Outreach emails are sent for real from your verified domain.",
      problem: hasResend
        ? "A Resend key is set, but real sending is locked until your domain is verified. Verify the sending domain in Resend (add its SPF/DKIM/DMARC DNS records), then set OUTREACH_DOMAIN_VERIFIED=true. Until then emails are tracked but not sent — this is deliberate, to keep your domain from being flagged as spam."
        : "Running in safe practice mode — emails are tracked on lead timelines but not delivered. Add a Resend key, verify your sending domain, then set OUTREACH_DOMAIN_VERIFIED=true to send for real.",
    },
    {
      id: "audit",
      label: "Website speed audits",
      required: false,
      ok: set(process.env.PAGESPEED_API_KEY),
      vars: ["PAGESPEED_API_KEY"],
      okText: "Audits run at full speed.",
      problem: "Fix: Go to console.cloud.google.com → Enable PageSpeed Insights API → Create a key → add as PAGESPEED_API_KEY. Without it, audits work but may hit Google's anonymous rate limit.",
    },
    {
      id: "email_events",
      label: "Email event tracking",
      required: false,
      ok: set(process.env.RESEND_WEBHOOK_SECRET),
      vars: ["RESEND_WEBHOOK_SECRET"],
      okText: "Open/click/bounce events update leads automatically.",
      problem: "Fix: In Resend dashboard → Webhooks → Add endpoint: https://yourdomain.com/api/crm/email-events → copy the Signing Secret → set as RESEND_WEBHOOK_SECRET. Subscribe to: email.opened, email.clicked, email.bounced, email.complained.",
    },
    {
      id: "drip_cron",
      label: "Automated follow-up sequences",
      required: false,
      ok: set(process.env.CRON_SECRET),
      vars: ["CRON_SECRET"],
      okText: "Drip emails fire automatically via Vercel Cron (daily at 10am UTC).",
      problem: "Fix: Generate a random secret (openssl rand -base64 32) → set as CRON_SECRET → Vercel Cron will send it automatically. The cron job sends follow-up emails at day 3, 7, and 14 to leads who haven't replied.",
    },
  ];

  const ready = checks.filter((c) => c.required).every((c) => c.ok);
  return NextResponse.json({ ready, checks });
}
