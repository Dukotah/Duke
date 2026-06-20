import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/lib/api";
import { findDuplicates, type FeedLeadInput } from "@/lib/crm/merge";
import { getLeads } from "@/app/api/crm/leads/route";

function isAdmin(req: NextRequest) {
  return req.headers.get("x-user-role") === "admin";
}

// GET /api/crm/duplicates — returns duplicate groups across all custom leads
// plus the loaded CSV feed. Admin-gated (data-integrity sensitive).
export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    // Include the CSV feed so a custom lead duplicating a cold lead is caught too.
    // If the feed is unreachable, getLeads() returns [] — we still surface custom
    // duplicates rather than failing the whole panel.
    let feed: FeedLeadInput[] = [];
    try {
      const leads = await getLeads();
      feed = leads.map((l) => ({
        id: l.id,
        name: l.name,
        email: l.email,
        phone: l.phone,
        city: l.city,
        county: l.county,
        website: l.website,
        category: l.category,
      }));
    } catch {
      feed = [];
    }

    const groups = await findDuplicates(feed);
    return NextResponse.json({ groups, count: groups.length });
  } catch (err) {
    return handleApiError("crm/duplicates GET", err);
  }
}
