import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { setLeadPreview } from "@/lib/db";

// Needs the Node runtime (child_process + fs); never the edge runtime.
export const runtime = "nodejs";

// Generation can scrape the business site + build a page; give it room. This is
// a local-only convenience, so a long synchronous request is acceptable.
const GEN_TIMEOUT_MS = 8 * 60 * 1000;

interface ManifestEntry {
  name?: string;
  slug?: string;
  link?: string;
  status?: string;
  flags?: string[];
  category?: string;
  area?: string;
  thumbnailUrl?: string;
}

// Match the CRM's previewKey normalization closely enough to pair a manifest
// entry back to the lead by name.
function norm(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function csvCell(v: unknown): string {
  const s = String(v ?? "").trim();
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function absolutize(galleryBase: string, link: string): string {
  if (/^https?:\/\//.test(link)) return link;
  return `${galleryBase}${link.startsWith("/") ? "" : "/"}${link}`;
}

async function readManifest(file: string): Promise<ManifestEntry[]> {
  try {
    const parsed = JSON.parse(await fs.readFile(file, "utf8"));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function runGenerator(
  factoryDir: string,
  csvRel: string,
): Promise<{ code: number; stdout: string; stderr: string }> {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, ["scripts/generate-prospects.mjs", csvRel], {
      cwd: factoryDir,
      windowsHide: true,
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (d) => (stdout += d.toString()));
    child.stderr.on("data", (d) => (stderr += d.toString()));
    const timer = setTimeout(() => {
      child.kill();
      resolve({ code: -1, stdout, stderr: stderr + "\n[generation timed out]" });
    }, GEN_TIMEOUT_MS);
    child.on("close", (code) => {
      clearTimeout(timer);
      resolve({ code: code ?? -1, stdout, stderr });
    });
    child.on("error", (err) => {
      clearTimeout(timer);
      resolve({ code: -1, stdout, stderr: stderr + "\n" + String(err) });
    });
  });
}

/**
 * POST /api/crm/leads/generate-site
 *
 * LOCAL-ONLY: generates a demo site for a single lead by invoking the /websites
 * Astro factory (generate-prospects.mjs) for one row, then attaches the local
 * preview URL to the lead. Hard-blocked in production (this shells out to a
 * local script and must never be reachable on Vercel) and disabled unless
 * WEBSITES_FACTORY_DIR points at a local checkout.
 *
 * It is non-destructive to the batch workflow: generate-prospects OVERWRITES
 * data/outreach-links.json with only the current run, so we snapshot the
 * existing manifest first and merge the new entry back in (dedup by slug).
 */
export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Demo-site generation is local-only and disabled in production." },
      { status: 403 },
    );
  }
  if (!req.headers.get("x-user-id")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const factoryDir = process.env.WEBSITES_FACTORY_DIR?.trim();
  if (!factoryDir) {
    return NextResponse.json(
      { error: "Set WEBSITES_FACTORY_DIR in .env.local to your /websites checkout to enable local demo-site generation." },
      { status: 400 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const name = String(body.name ?? "").trim();
  if (!name) return NextResponse.json({ error: "Lead name is required" }, { status: 400 });

  const scriptPath = path.join(factoryDir, "scripts", "generate-prospects.mjs");
  try {
    await fs.access(scriptPath);
  } catch {
    return NextResponse.json(
      { error: `Generator not found at ${scriptPath}. Check WEBSITES_FACTORY_DIR.` },
      { status: 400 },
    );
  }

  const dataDir = path.join(factoryDir, "data");
  const manifestPath = path.join(dataDir, "outreach-links.json");

  // Snapshot the batch manifest BEFORE running (generate-prospects overwrites it).
  const existing = await readManifest(manifestPath);

  // Write a 1-row CSV for just this lead.
  const header = "name,website,category,city,state,phone,email";
  const row = [body.name, body.website, body.category, body.city, body.state, body.phone, body.email]
    .map(csvCell)
    .join(",");
  const csvAbs = path.join(dataDir, `.crm-gen-${norm(name) || "lead"}.csv`);
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(csvAbs, `${header}\n${row}\n`, "utf8");
  const csvRel = path.relative(factoryDir, csvAbs).split(path.sep).join("/");

  const { code, stdout, stderr } = await runGenerator(factoryDir, csvRel);
  fs.unlink(csvAbs).catch(() => {});

  if (code !== 0) {
    return NextResponse.json(
      { error: "Generation failed.", detail: (stderr || stdout).slice(-800) },
      { status: 500 },
    );
  }

  // The manifest now holds only this run; find our entry.
  const fresh = await readManifest(manifestPath);
  const entry = fresh.find((e) => e.name && norm(e.name) === norm(name)) ?? fresh[fresh.length - 1];
  if (!entry || !entry.link) {
    return NextResponse.json(
      { error: "Generated, but couldn't read back the preview link.", detail: stdout.slice(-400) },
      { status: 500 },
    );
  }

  // Merge the new entry back into the saved batch manifest (dedup by slug, fresh wins).
  const bySlug = new Map<string, ManifestEntry>();
  for (const e of existing) if (e.slug) bySlug.set(e.slug, e);
  for (const e of fresh) if (e.slug) bySlug.set(e.slug, e);
  await fs.writeFile(manifestPath, JSON.stringify([...bySlug.values()], null, 2) + "\n", "utf8");

  const galleryBase = (process.env.GALLERY_BASE_URL?.trim() || "http://localhost:4321").replace(/\/$/, "");
  const previewUrl = absolutize(galleryBase, entry.link);
  const thumbnailUrl = entry.thumbnailUrl ? absolutize(galleryBase, entry.thumbnailUrl) : undefined;

  await setLeadPreview(name, previewUrl, {
    status: entry.status,
    flags: entry.flags,
    category: entry.category,
    area: entry.area,
    thumbnailUrl,
    slug: entry.slug,
  });

  return NextResponse.json({
    ok: true,
    slug: entry.slug,
    previewUrl,
    status: entry.status ?? "ready",
    flags: entry.flags ?? [],
  });
}
