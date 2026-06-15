import { NextRequest, NextResponse } from "next/server";
import { isAuthorized } from "@/lib/crm/auth";
import { parseJsonBody, handleApiError } from "@/lib/api";
import { setLeadPreview } from "@/lib/db";

/**
 * POST /api/crm/admin/preview-url
 *
 * Attaches a generated preview-site URL (built by the separate /websites
 * factory) to a CRM lead, matched by business name. Token-gated via
 * CRM_ADMIN_TOKEN (see src/lib/crm/auth.ts) so the external push script can call
 * it without a browser session — accepts `Authorization: Bearer <token>`, an
 * `x-crm-token` header, or `?token=`. Fails closed when the token is unset.
 *
 * Accepts a single entry or a batch:
 *   { leadName: "Acme Plumbing", previewUrl: "https://demos.../s/acme-plumbing" }
 *   { entries: [ { name, link }, ... ] }
 * (name/leadName and previewUrl/link are accepted as aliases so the /websites
 * manifest shape can be posted with minimal reshaping.)
 */
interface PreviewEntry {
  leadName?: string;
  name?: string;
  previewUrl?: string;
  link?: string;
  // Optional demo-package fields (additive — old {name,link} posts still work)
  status?: string;
  flags?: string[];
  category?: string;
  area?: string;
  claimByDate?: string;
  thumbnailUrl?: string;
  slug?: string;
}

export async function POST(req: NextRequest) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parsed = await parseJsonBody<PreviewEntry & { entries?: PreviewEntry[] }>(req);
    if (!parsed.ok) return parsed.response;

    const body = parsed.data;
    const entries: PreviewEntry[] = Array.isArray(body.entries) ? body.entries : [body];

    let linked = 0;
    const skipped: string[] = [];
    for (const e of entries) {
      const name = (e.leadName ?? e.name ?? "").trim();
      const url = (e.previewUrl ?? e.link ?? "").trim();
      if (!name || !url) {
        skipped.push(name || "(unnamed)");
        continue;
      }
      await setLeadPreview(name, url, {
        status: e.status,
        flags: e.flags,
        category: e.category,
        area: e.area,
        claimByDate: e.claimByDate,
        thumbnailUrl: e.thumbnailUrl,
        slug: e.slug,
      });
      linked++;
    }

    return NextResponse.json({ ok: true, linked, skipped });
  } catch (err) {
    return handleApiError("crm/admin/preview-url POST", err);
  }
}
