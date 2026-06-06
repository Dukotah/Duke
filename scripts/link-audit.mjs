#!/usr/bin/env node
// Internal-link integrity audit. Scans every .tsx/.ts under src/ for internal
// link targets (href="/x", href: "/x", href={`/x`}) and flags any that don't
// resolve to a real App Router route or a known public/static asset. Catches
// dead nav/relatedLinks/nearby/hub links before they hit production.
//
// Usage: node scripts/link-audit.mjs   (exits non-zero if dead links found)

import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(import.meta.url), "..", "..");
const APP = join(ROOT, "src", "app");
const SRC = join(ROOT, "src");

async function walk(dir, filter) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === "node_modules" || e.name === ".next") continue;
      out.push(...(await walk(p, filter)));
    } else if (filter(e.name)) {
      out.push(p);
    }
  }
  return out;
}

// 1. Build the set of real routes from the App Router tree.
const routes = new Set(["/"]);
async function collectRoutes(dir, urlPath) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    if (e.name === "api") continue; // not page routes
    // Skip route groups "(group)" — they don't add a path segment.
    const seg = e.name.startsWith("(") && e.name.endsWith(")") ? "" : e.name;
    const childUrl = seg ? `${urlPath}/${seg}` : urlPath;
    const dirPath = join(dir, e.name);
    const entries = await readdir(dirPath);
    if (entries.some((f) => /^page\.(tsx|ts|jsx|js|mdx)$/.test(f))) {
      routes.add(childUrl || "/");
    }
    await collectRoutes(dirPath, childUrl);
  }
}
await collectRoutes(APP, "");

// Known framework/static paths that won't be App Router page dirs.
const KNOWN_STATIC = new Set([
  "/sitemap.xml", "/robots.txt", "/llms.txt", "/favicon.ico",
  "/manifest.webmanifest", "/og-image.png",
]);
// Public files (served as-is).
const PUBLIC = join(ROOT, "public");
async function collectPublic(dir, urlPath) {
  let entries;
  try { entries = await readdir(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    const childUrl = `${urlPath}/${e.name}`;
    if (e.isDirectory()) await collectPublic(join(dir, e.name), childUrl);
    else KNOWN_STATIC.add(childUrl);
  }
}
await collectPublic(PUBLIC, "");

// 2. Scan source for internal link targets.
const files = await walk(SRC, (n) => /\.(tsx|ts)$/.test(n));
// Match href="/...", href: "/...", href={"/..."} and simple href={`/...`}
const HREF_RE = /href\s*[:=]\s*[{(]?\s*[`"'](\/[^`"'#?]*)[`"'#?]/g;
const dead = [];
const dynamicRoutes = [...routes].filter((r) => r.includes("[")); // e.g. /blog/[slug]

function resolves(path) {
  const clean = path.replace(/\/+$/, "") || "/";
  if (routes.has(clean) || KNOWN_STATIC.has(clean)) return true;
  // Match dynamic segments: /blog/foo matches /blog/[slug]
  for (const dr of dynamicRoutes) {
    const re = new RegExp("^" + dr.replace(/\[[^\]]+\]/g, "[^/]+") + "$");
    if (re.test(clean)) return true;
  }
  // A path one level under a real route is likely a dynamic page (e.g. blog posts
  // that exist as their own dirs are already in `routes`); otherwise flag it.
  return false;
}

for (const f of files) {
  const text = await readFile(f, "utf8");
  let m;
  while ((m = HREF_RE.exec(text))) {
    const target = m[1];
    if (target.startsWith("//")) continue; // protocol-relative external
    if (target.includes("${")) continue; // template-literal interpolation (dynamic route)
    if (!resolves(target)) {
      const line = text.slice(0, m.index).split("\n").length;
      dead.push({ file: relative(ROOT, f), line, target });
    }
  }
}

console.log(`Routes discovered: ${routes.size}`);
console.log(`Internal link targets scanned across ${files.length} files.`);
if (dead.length === 0) {
  console.log("\n✓ No dead internal links found.\n");
  process.exit(0);
}
console.log(`\n✗ ${dead.length} link target(s) with no matching route:\n`);
for (const d of dead) console.log(`  ${d.file}:${d.line}  →  ${d.target}`);
console.log("");
process.exit(1);
