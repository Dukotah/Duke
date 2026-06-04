import { NextRequest, NextResponse } from "next/server";
import { getDemo, recordClaim } from "@/lib/demo";

// POST /api/demo/[slug]/claim — { name, email, phone? }
// Prospect-facing: no auth required.
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  const demo = await getDemo(slug);
  if (!demo) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let body: { name?: string; email?: string; phone?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, email, phone } = body;
  if (!name?.trim() || !email?.trim()) {
    return NextResponse.json({ error: "name and email are required" }, { status: 400 });
  }

  await recordClaim(slug, name.trim(), email.trim(), phone?.trim());
  return NextResponse.json({ ok: true });
}
