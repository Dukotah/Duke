import { NextRequest, NextResponse } from "next/server";
import {
  createDemo,
  listDemos,
  deleteDemo,
  demoTrackingUrl,
  getDemo,
} from "@/lib/demo";

function getUserId(req: NextRequest): string | null {
  return req.headers.get("x-user-id");
}

// GET /api/crm/demos — list all demos with tracking URLs
export async function GET(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const demos = await listDemos();
  return NextResponse.json(
    demos.map((d) => ({ ...d, trackingUrl: demoTrackingUrl(d.slug) })),
  );
}

// POST /api/crm/demos — { leadId, businessName, demoUrl, screenshotUrl?, slug? }
export async function POST(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: {
    leadId?: string;
    businessName?: string;
    demoUrl?: string;
    screenshotUrl?: string;
    slug?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { leadId, businessName, demoUrl, screenshotUrl, slug: providedSlug } = body;
  if (!leadId || !businessName || !demoUrl) {
    return NextResponse.json(
      { error: "leadId, businessName, and demoUrl are required" },
      { status: 400 },
    );
  }

  const slug =
    providedSlug?.trim() ||
    businessName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") +
      "-" +
      Date.now().toString(36);

  if (await getDemo(slug)) {
    return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
  }

  const demo = await createDemo({
    slug,
    leadId,
    businessName,
    demoUrl,
    ...(screenshotUrl ? { screenshotUrl } : {}),
    createdAt: new Date().toISOString(),
    createdBy: userId,
  });

  return NextResponse.json(
    { ...demo, trackingUrl: demoTrackingUrl(slug) },
    { status: 201 },
  );
}

// DELETE /api/crm/demos?slug=...
export async function DELETE(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "slug is required" }, { status: 400 });
  await deleteDemo(slug);
  return NextResponse.json({ ok: true });
}
