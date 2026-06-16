// Cloudflare Email Worker — receives replies sent to reply@copperbaytech.com
// (via Cloudflare Email Routing) and forwards them to the CRM inbound webhook.
// Free, runs on the same Cloudflare zone that already routes contact@ to Gmail;
// adding this address rule does NOT touch the apex MX or the contact@ rule.
//
// Deploy:  cd cf-inbound-worker && npm install && npx wrangler deploy
// Secret:  npx wrangler secret put CRM_INBOUND_SECRET   (paste the shared secret)
// Then in Cloudflare → Email Routing → add address "reply@copperbaytech.com"
//   → action "Send to a Worker" → cbt-inbound.
import PostalMime from "postal-mime";

const CRM_INBOUND_URL = "https://www.copperbaytech.com/api/crm/inbound";
// Optional: also drop a human copy in your inbox. Leave "" to skip.
const ALSO_FORWARD_TO = "dukotah@gmail.com";

export default {
  async email(message, env, ctx) {
    let parsed = {};
    try {
      const buf = await new Response(message.raw).arrayBuffer();
      parsed = await new PostalMime().parse(buf);
    } catch (e) {
      // If parsing fails we still POST the sender so the CRM can match the lead.
      parsed = {};
    }

    const payload = {
      from: { email: message.from, name: parsed.from?.name || "" },
      to: message.to,
      subject: parsed.subject || "",
      text: parsed.text || "",
      html: parsed.html || "",
    };

    try {
      await fetch(CRM_INBOUND_URL, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-inbound-secret": env.CRM_INBOUND_SECRET || "",
        },
        body: JSON.stringify(payload),
      });
    } catch (e) {
      // Never throw — a webhook failure must not bounce the sender's email.
    }

    // Keep a human copy in your normal inbox too (best-effort).
    if (ALSO_FORWARD_TO) {
      try { await message.forward(ALSO_FORWARD_TO); } catch (e) { /* ignore */ }
    }
  },
};
