import { NextRequest, NextResponse } from "next/server";
import { listSubmissions, resolveSubmission, markCommissionPaid, getRepStats, listUsers, getUserLeadCount, getUserById, stampLeadAction } from "@/lib/db";
import { parseJsonBody, handleApiError } from "@/lib/api";

async function sendRepNotification(
  repEmail: string,
  repName: string,
  leadName: string,
  leadCity: string,
  action: "accept" | "reject",
  dealValue?: number,
  commissionAmount?: number
) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log(`[CRM] No RESEND_API_KEY — skipping email to ${repEmail} for ${action} on ${leadName}`);
    return;
  }

  const subject = action === "accept"
    ? "🎉 Lead accepted — you've got commission coming!"
    : "Lead update from Duke";

  const html = action === "accept"
    ? `<p>Hey ${repName},</p>
<p>Great news! Duke just accepted your lead: <strong>${leadName}</strong> in ${leadCity}.</p>
<p>Deal value: $${(dealValue ?? 0).toLocaleString()}<br>Your commission: <strong>$${(commissionAmount ?? 0).toFixed(2)}</strong> 🎉</p>
<p>This will be paid out to you soon. Keep up the great work!</p>
<p>— Copper Bay Tech</p>`
    : `<p>Hey ${repName},</p>
<p>Duke reviewed your lead for <strong>${leadName}</strong> and it wasn't quite the right fit this time.</p>
<p>Don't sweat it — every no gets you closer to a yes. Keep working your queue and push the next hot one!</p>
<p>— Copper Bay Tech</p>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Copper Bay Tech CRM <contact@copperbaytech.com>",
      to: [repEmail],
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("[CRM] Resend error sending rep notification:", res.status, err);
  }
}

function isAdmin(req: NextRequest) {
  return req.headers.get("x-user-role") === "admin";
}

export async function GET(req: NextRequest) {
  try {
    if (!isAdmin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const filter = req.nextUrl.searchParams.get("filter") as "pending" | "accepted" | "rejected" | null;
    const subs = await listSubmissions(filter ?? undefined);

    // Also return per-rep stats for admin overview
    const users = await listUsers();
    const repStats = await Promise.all(
      users.filter((u) => u.role === "rep").map(async (u) => ({
        ...u,
        stats: await getRepStats(u.id),
        leadsWorked: await getUserLeadCount(u.id),
      }))
    );

    return NextResponse.json({ submissions: subs, repStats });
  } catch (err) {
    return handleApiError("crm/admin/submissions GET", err);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    if (!isAdmin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const parsed = await parseJsonBody<{ id?: string; action?: string; dealValue?: number }>(req);
    if (!parsed.ok) return parsed.response;
    const { id, action, dealValue } = parsed.data;
    if (!id || !action) return NextResponse.json({ error: "id and action required" }, { status: 400 });

    if (action === "accept" || action === "reject") {
      const updated = await resolveSubmission(id, action === "accept" ? "accepted" : "rejected", dealValue);

      // Durably stamp the WON status into the global cross-rep action hash on
      // accept. This is the canonical "lead marked won" mutation point — without
      // it, a.status is never set globally and the Won tag is only visible to the
      // rep who submitted (per-user state fallback). Additive; never fail the req.
      if (action === "accept" && updated.leadId) {
        try {
          const nowISO = new Date().toISOString();
          await stampLeadAction(
            updated.leadId,
            { status: "won", lastOutcome: "won", lastOutcomeAt: nowISO },
            { userId: updated.userId, repName: updated.repName }
          );
        } catch (stampErr) {
          console.error("[CRM] Failed to stamp won status on accept:", stampErr);
        }
      }

      // Send email notification to the rep
      try {
        const rep = await getUserById(updated.userId);
        if (rep?.email) {
          await sendRepNotification(
            rep.email,
            rep.name,
            updated.leadName,
            updated.leadCity,
            action,
            updated.dealValue,
            updated.commissionAmount
          );
        }
      } catch (err) {
        console.error("[CRM] Failed to send rep notification:", err);
        // Don't fail the request
      }

      return NextResponse.json(updated);
    }
    if (action === "markPaid") {
      await markCommissionPaid(id);
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    return handleApiError("crm/admin/submissions PATCH", err);
  }
}
