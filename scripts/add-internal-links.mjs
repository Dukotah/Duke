#!/usr/bin/env node
/**
 * Adds a "Related:" footer to blog posts that lack internal links to service/industry pages.
 * Determines the right links from slug keywords and existing content.
 *
 * Usage: node scripts/add-internal-links.mjs [--dry-run]
 */

import { readdirSync, readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const BLOG_DIR = join(ROOT, "src/app/blog");

const DRY_RUN = process.argv.includes("--dry-run");

// Map keywords in slug → {href, label} for service/industry links
const LINK_RULES = [
  { match: ["cybersecurity", "ransomware", "mfa", "security", "hipaa", "wire-fraud"], href: "/services/cybersecurity", label: "Cybersecurity Services" },
  { match: ["it-support", "managed-it", "managed-service", "backup", "cloud-vs", "choose-an-it"], href: "/services/it-support", label: "IT Support" },
  { match: ["website", "web-design", "web-development", "speed", "slow-website", "signs-you-need", "cost-guide", "hipaa-compliant"], href: "/services/web-development", label: "Web Development" },
  { match: ["restaurant", "pos"], href: "/industries/restaurants", label: "IT for Restaurants" },
  { match: ["winery", "winery-cyber"], href: "/industries/wineries", label: "IT for Wineries" },
  { match: ["law-firm", "legal"], href: "/industries/law-firms", label: "IT for Law Firms" },
  { match: ["real-estate"], href: "/industries/real-estate", label: "IT for Real Estate" },
  { match: ["healthcare", "hipaa"], href: "/industries/healthcare", label: "IT for Healthcare" },
  { match: ["google-business", "google-maps", "local-seo", "rank"], href: "/services/web-development", label: "Local SEO & Web" },
  { match: ["ai-", "how-ai"], href: "/services/web-development", label: "AI Integration" },
];

function getLinksForSlug(slug) {
  const seen = new Set();
  const links = [];
  for (const rule of LINK_RULES) {
    if (rule.match.some((kw) => slug.includes(kw))) {
      if (!seen.has(rule.href)) {
        seen.add(rule.href);
        links.push({ href: rule.href, label: rule.label });
      }
    }
  }
  // Always add at least one service link if nothing matched
  if (links.length === 0) {
    links.push({ href: "/services/it-support", label: "IT Support" });
  }
  return links.slice(0, 3);
}

function buildRelatedFooter(links) {
  const parts = links.map(({ href, label }) =>
    `<Link href="${href}" className="text-orange-500 hover:text-orange-600">${label}</Link>`
  );
  return `
              <p className="text-sm text-zinc-500 mt-8">
                Related:{" "}
                ${parts.join('\n                {" · "}\n                ')}
              </p>`;
}

// Posts that already have links (skip them)
const SKIP_SLUGS = new Set([
  "cybersecurity-for-law-firms-sonoma-county",
  "it-support-for-real-estate-offices-sonoma-county",
  "it-support-for-restaurants-sonoma-county",
]);

const SERVICE_PAGES = ["/services/it-support", "/services/cybersecurity", "/services/web-development"];
const INDUSTRY_PAGES = ["/industries/healthcare", "/industries/wineries", "/industries/restaurants", "/industries/law-firms", "/industries/real-estate"];

const posts = readdirSync(BLOG_DIR).filter(
  (d) => d !== "page.tsx" && existsSync(join(BLOG_DIR, d, "page.tsx"))
);

let updated = 0;
for (const slug of posts) {
  if (SKIP_SLUGS.has(slug)) continue;

  const filePath = join(BLOG_DIR, slug, "page.tsx");
  const content = readFileSync(filePath, "utf8");

  const hasService = SERVICE_PAGES.some((p) => content.includes(`href="${p}"`));
  const hasIndustry = INDUSTRY_PAGES.some((p) => content.includes(`href="${p}"`));
  if (hasService || hasIndustry) continue;

  const links = getLinksForSlug(slug);
  const footer = buildRelatedFooter(links);

  // Try multiple insertion patterns (newer vs older post structure)
  const PATTERNS = [
    "<BlogEmailCapture />",
    "            <BlogEmailCapture />",
    'href="/#contact"',
    'href="/schedule"',
  ];

  let newContent = null;
  for (const pt of PATTERNS) {
    if (content.includes(pt)) {
      newContent = content.replace(pt, `${footer}\n              ${pt}`);
      break;
    }
  }

  if (!newContent) {
    console.warn(`  ⚠ Could not find insertion point in /blog/${slug} — skipping`);
    continue;
  }

  if (DRY_RUN) {
    console.log(`[dry-run] Would update /blog/${slug}`);
    console.log(`  Links: ${links.map((l) => l.href).join(", ")}`);
  } else {
    writeFileSync(filePath, newContent, "utf8");
    console.log(`✓ /blog/${slug}`);
    console.log(`  Links: ${links.map((l) => l.href).join(", ")}`);
  }
  updated++;
}

console.log(`\n${DRY_RUN ? "[dry-run] " : ""}Updated ${updated} posts.`);
