import { NextRequest, NextResponse } from "next/server";
import { getLeads } from "@/app/api/crm/leads/route";
import { getCustomLeads } from "@/lib/db";
import { handleApiError } from "@/lib/api";

// Shape returned to the Command Palette. Deliberately small — the palette only
// renders name/city/category and uses email/phone for the secondary line.
export interface SearchResult {
  id: string;
  name: string;
  city: string;
  category: string;
  email: string;
  phone: string;
}

const MAX_RESULTS = 20;

// GET /api/crm/search?q= — fuzzy match across the CSV lead universe + this
// user's custom leads. Filters by name/email/phone/city, capped at 20. Mirrors
// how /api/crm/leads sources leads (getLeads + getCustomLeads) so palette hits
// and the All view stay consistent. Custom leads are prepended (hottest).
export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const q = (req.nextUrl.searchParams.get("q") ?? "").trim().toLowerCase();
    if (!q) return NextResponse.json({ results: [] });

    // Custom leads first (user's own additions / inbound hand-raisers), then the
    // shared CSV universe. getLeads serves cached/empty on source failure, so a
    // search never 500s the way a throw would.
    const [csvLeads, customLeads] = await Promise.all([
      getLeads(),
      getCustomLeads(userId).catch(() => []),
    ]);

    const matchesQ = (...fields: (string | undefined)[]) =>
      fields.some((f) => (f ?? "").toLowerCase().includes(q));

    const results: SearchResult[] = [];

    for (const cl of customLeads) {
      if (results.length >= MAX_RESULTS) break;
      if (matchesQ(cl.name, cl.email, cl.phone, cl.city)) {
        results.push({
          id: `custom:${cl.id}`,
          name: cl.name,
          city: cl.city ?? "",
          category: cl.niche || "custom",
          email: cl.email ?? "",
          phone: cl.phone ?? "",
        });
      }
    }

    for (const l of csvLeads) {
      if (results.length >= MAX_RESULTS) break;
      if (matchesQ(l.name, l.email, l.phone, l.phone_fmt, l.city)) {
        results.push({
          id: l.id,
          name: l.name,
          city: l.city,
          category: l.category,
          email: l.email,
          phone: l.phone || l.phone_fmt,
        });
      }
    }

    return NextResponse.json({ results });
  } catch (err) {
    return handleApiError("crm/search GET", err);
  }
}
