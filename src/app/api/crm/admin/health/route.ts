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
      ok: set(process.env.RESEND_API_KEY),
      vars: ["RESEND_API_KEY"],
      okText: "Outreach emails are sent for real.",
      problem: "Running in safe practice mode — emails are logged in the Email tab but not actually delivered. Add a Resend key when you're ready to send for real.",
    },
    {
      id: "audit",
      label: "Website speed audits",
      required: false,
      ok: set(process.env.PAGESPEED_API_KEY),
      vars: ["PAGESPEED_API_KEY"],
      okText: "Audits run at full speed.",
      problem: "Site-speed audits still work on Google's free tier, but may be rate-limited. Add a key for higher limits.",
    },
  ];

  const ready = checks.filter((c) => c.required).every((c) => c.ok);
  return NextResponse.json({ ready, checks });
}
