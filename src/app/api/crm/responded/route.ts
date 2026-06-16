import { NextRequest, NextResponse } from "next/server";
import {
  getLeadActions,
  getLeadReplies,
  getCustomLeads,
  getAllOutreachLog,
  type LeadReply,
} from "@/lib/db";
import { handleApiError } from "@/lib/api";

function getUserId(req: NextRequest): string | null {
  return req.headers.get("x-user-id");
}

// GET /api/crm/responded — the "Responded" tab feed. Every lead whose durable
// lead_actions stamp has respondedAt set, newest reply first, enriched with the
// latest reply (subject, snippet, full body, receivedAt, replyCount) so the rep
// can read the email straight from the card. Names are resolved server-side from
// custom leads + the outreach log so no raw uuid leaks.
export async function GET(req: NextRequest) {
  try {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const [actionsMap, repliesMap, customs, log] = await Promise.all([
      getLeadActions(),
      getLeadReplies(),
      getCustomLeads(userId),
      getAllOutreachLog(500),
    ]);

    // leadId → display name, from whatever source knows it.
    const nameById = new Map<string, { name: string; phone?: string; email?: string; city?: string; category?: string }>();
    for (const c of customs) {
      nameById.set(c.id, { name: c.name, phone: c.phone, email: c.email, city: c.city, category: c.niche });
    }
    for (const e of log) {
      if (e.leadId && !nameById.has(e.leadId)) {
        nameById.set(e.leadId, { name: e.leadName || "", email: e.email });
      }
    }

    const snippet = (r: LeadReply | undefined): string => {
      const body = (r?.text || r?.html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      return body.length > 160 ? body.slice(0, 160) + "…" : body;
    };

    const responded = Object.entries(actionsMap)
      .filter(([, a]) => !!a.respondedAt)
      .map(([leadId, a]) => {
        const reply = repliesMap[leadId];
        const info = nameById.get(leadId);
        return {
          id: leadId,
          name: info?.name || reply?.fromName || reply?.fromEmail || "Unknown lead",
          phone: info?.phone || "",
          email: info?.email || reply?.fromEmail || "",
          city: info?.city || "",
          category: info?.category || "",
          respondedAt: a.respondedAt!,
          replyCount: a.replyCount ?? reply?.replyCount ?? 1,
          reply: reply
            ? {
                fromEmail: reply.fromEmail,
                fromName: reply.fromName ?? "",
                subject: reply.subject ?? "",
                snippet: snippet(reply),
                text: reply.text ?? "",
                html: reply.html ?? "",
                receivedAt: reply.receivedAt,
              }
            : null,
          actions: a,
        };
      })
      .sort((x, y) => (y.respondedAt || "").localeCompare(x.respondedAt || "")); // newest reply first

    return NextResponse.json({ responded });
  } catch (err) {
    return handleApiError("crm/responded GET", err);
  }
}
