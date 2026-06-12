import { NextRequest, NextResponse } from "next/server";
import { getCustomLeads, getAllLeadStates, getLeadPreviewObjects, previewKey } from "@/lib/db";
import { handleApiError } from "@/lib/api";

function getUserId(req: NextRequest): string | null {
  return req.headers.get("x-user-id");
}

// GET /api/crm/demos — the "New" tab feed: prospects with a freshly generated
// demo site, PLUS inbound leads (people who filled out a request on the website
// to be contacted). Names/details are resolved server-side from the custom leads,
// so no raw uuid can ever show. The full lead database lives in the All tab.
//
// Inbound leads (hand-raisers) sort first; otherwise newest-built first.
export async function GET(req: NextRequest) {
  try {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const [customs, states, previews] = await Promise.all([
      getCustomLeads(userId),
      getAllLeadStates(userId),
      getLeadPreviewObjects(),
    ]);

    const demos = customs
      .map((c) => {
        const pkg = previews[previewKey(c.name)];
        const hasDemo = !!pkg?.previewUrl;
        // The intake flow stores inbound captures with a notes prefix of "Inbound".
        const isInbound = (c.notes ?? "").trim().toLowerCase().startsWith("inbound");
        if (!hasDemo && !isInbound) return null; // only demos + inbound requests

        const id = `custom:${c.id}`;
        return {
          id,
          name: c.name,
          contact_name: c.contactName ?? "",
          category: c.niche || pkg?.category || "custom",
          phone: c.phone || "",
          email: c.email || "",
          website: c.website || "",
          address: "",
          city: c.city || pkg?.area || "",
          county: c.county || "",
          tier: "A",
          tier_reason: isInbound ? "Inbound — requested contact" : "Demo built",
          builder: "",
          industry_fit: "high",
          outreach_score: 100,
          pitch: c.notes || "",
          notes: c.notes || "",
          createdAt: c.createdAt || "",
          // classification for the UI
          kind: isInbound ? "inbound" : "demo",
          isInbound,
          hasDemo,
          // demo package (may be null for inbound-only leads)
          previewUrl: pkg?.previewUrl ?? null,
          thumbnailUrl: pkg?.thumbnailUrl ?? null,
          demoStatus: pkg?.status ?? null,
          demoCategory: pkg?.category ?? null,
          demoArea: pkg?.area ?? null,
          claimByDate: pkg?.claimByDate ?? null,
          linkedAt: pkg?.linkedAt ?? "",
        };
      })
      .filter((d): d is NonNullable<typeof d> => d !== null)
      .sort((a, b) => {
        if (a.isInbound !== b.isInbound) return a.isInbound ? -1 : 1; // hand-raisers first
        const at = a.linkedAt || a.createdAt || "";
        const bt = b.linkedAt || b.createdAt || "";
        return bt.localeCompare(at); // newest first
      });

    return NextResponse.json({ demos });
  } catch (err) {
    return handleApiError("crm/demos GET", err);
  }
}
