#!/usr/bin/env node
/**
 * Internal linking audit — finds blog posts that don't link to their relevant
 * service page (/services/it-support, /services/cybersecurity, /services/web-development)
 * or any industry page (/industries/*).
 *
 * Usage: node scripts/link-audit.mjs
 */

import { readdirSync, readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const BLOG_DIR = join(ROOT, "src/app/blog");

const SERVICE_PAGES = [
  "/services/it-support",
  "/services/cybersecurity",
  "/services/web-development",
];

const INDUSTRY_PAGES = [
  "/industries/healthcare",
  "/industries/wineries",
  "/industries/restaurants",
  "/industries/law-firms",
  "/industries/real-estate",
];

const CITY_PAGES = [
  "/petaluma", "/santa-rosa", "/sebastopol", "/rohnert-park",
  "/sonoma", "/windsor", "/healdsburg",
];

const posts = readdirSync(BLOG_DIR).filter(
  (d) => d !== "page.tsx" && existsSync(join(BLOG_DIR, d, "page.tsx"))
);

const issues = [];
const stats = { posts: posts.length, withService: 0, withIndustry: 0, withCity: 0 };

for (const slug of posts) {
  const content = readFileSync(join(BLOG_DIR, slug, "page.tsx"), "utf8");
  const postIssues = [];

  const hasService = SERVICE_PAGES.some((p) => content.includes(`href="${p}"`));
  const hasIndustry = INDUSTRY_PAGES.some((p) => content.includes(`href="${p}"`));
  const hasCity = CITY_PAGES.some((p) => content.includes(`href="${p}"`));

  if (hasService) stats.withService++;
  if (hasIndustry) stats.withIndustry++;
  if (hasCity) stats.withCity++;

  if (!hasService && !hasIndustry) {
    postIssues.push("missing link to any service or industry page");
  }

  if (postIssues.length) {
    issues.push({ slug, issues: postIssues, hasService, hasIndustry, hasCity });
  }
}

console.log(`\n=== Internal Link Audit ===`);
console.log(`Scanned ${stats.posts} blog posts`);
console.log(`Links to service pages: ${stats.withService}/${stats.posts}`);
console.log(`Links to industry pages: ${stats.withIndustry}/${stats.posts}`);
console.log(`Links to city pages: ${stats.withCity}/${stats.posts}`);

if (issues.length === 0) {
  console.log(`\n✓ All posts link to at least one service or industry page.`);
} else {
  console.log(`\n⚠ ${issues.length} post(s) missing internal links to service/industry pages:\n`);
  for (const { slug, issues: postIssues } of issues) {
    console.log(`  /blog/${slug}`);
    for (const issue of postIssues) {
      console.log(`    → ${issue}`);
    }
  }
  console.log(`\nFix: Add a "Related:" footer to each post above linking to the relevant`);
  console.log(`service (/services/it-support, /services/cybersecurity, etc.) or`);
  console.log(`industry (/industries/restaurants, etc.) page.`);
}
console.log();
