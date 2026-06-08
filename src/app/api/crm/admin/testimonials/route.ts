// Admin: testimonial / Google-review requests queued when a deal is won.

import { NextRequest, NextResponse } from "next/server";
import { listTestimonialRequests, updateTestimonialRequest } from "@/lib/db";
import { parseJsonBody, handleApiError } from "@/lib/api";

function isAdmin(req: NextRequest) {
  return req.headers.get("x-user-role") === "admin";
}

export async function GET(req: NextRequest) {
  try {
    if (!isAdmin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const filter = req.nextUrl.searchParams.get("status") as
      | "pending" | "sent" | "dismissed" | null;
    const requests = await listTestimonialRequests(filter ?? undefined);
    return NextResponse.json({ requests });
  } catch (err) {
    return handleApiError("crm/admin/testimonials GET", err);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    if (!isAdmin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const parsed = await parseJsonBody<{ id?: string; status?: string }>(req);
    if (!parsed.ok) return parsed.response;
    const { id, status } = parsed.data;
    if (!id || !status || !["pending", "sent", "dismissed"].includes(status)) {
      return NextResponse.json({ error: "id and valid status required" }, { status: 400 });
    }
    await updateTestimonialRequest(id, status as "pending" | "sent" | "dismissed");
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleApiError("crm/admin/testimonials PATCH", err);
  }
}
