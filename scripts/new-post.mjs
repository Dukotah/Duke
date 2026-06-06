#!/usr/bin/env node
/**
 * Scaffold a new blog post.
 * Usage: node scripts/new-post.mjs <slug> [tag] [title]
 *
 * Creates src/app/blog/<slug>/page.tsx with the standard structure.
 * Then prints the steps needed to wire it into blog/page.tsx and sitemap.ts.
 */

import { existsSync, mkdirSync, writeFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const [, , slug, tag = "IT Support", ...titleParts] = process.argv;

if (!slug) {
  console.error("Usage: node scripts/new-post.mjs <slug> [tag] [title words...]");
  process.exit(1);
}

const title = titleParts.length
  ? titleParts.join(" ")
  : slug.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");

const today = new Date().toISOString().slice(0, 10);
const monthYear = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });

const destDir = join(ROOT, "src/app/blog", slug);
const destFile = join(destDir, "page.tsx");

if (existsSync(destFile)) {
  console.error(`Already exists: ${destFile}`);
  process.exit(1);
}

mkdirSync(destDir, { recursive: true });

const template = `import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import JsonLd, { blogPostingSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "${title} | Copper Bay Tech",
  description:
    "TODO: Add a 150-160 character description targeting your primary keyword.",
  alternates: {
    canonical: "https://copperbaytech.com/blog/${slug}",
  },
};

const H = { fontFamily: "var(--font-heading)" };
const B = { fontFamily: "var(--font-body)" };

export default function Article() {
  return (
    <>
      <JsonLd schema={blogPostingSchema({
        title: "${title}",
        description: "TODO: Match the metadata description.",
        url: "https://copperbaytech.com/blog/${slug}",
        datePublished: "${today}",
      })} />
      <JsonLd schema={breadcrumbSchema([
        { name: "Home", url: "https://copperbaytech.com" },
        { name: "Blog", url: "https://copperbaytech.com/blog" },
        { name: "${title}" },
      ])} />
      <Nav />
      <main>
        <section className="pt-32 pb-8 bg-[#18181B]">
          <div className="max-w-2xl mx-auto px-6">
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors mb-8" style={H}>
              <ArrowLeft size={14} /> All Resources
            </Link>
            <span className="inline-block mb-4 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-widest" style={{ backgroundColor: "rgba(249,115,22,0.15)", color: "#F97316", ...H }}>
              ${tag}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight" style={H}>
              ${title}
            </h1>
            <p className="text-white/50 text-sm" style={B}>
              X min read · ${monthYear}
            </p>
          </div>
        </section>

        <section className="py-12 bg-white">
          <div className="max-w-2xl mx-auto px-6">
            <div className="prose prose-zinc max-w-none text-[#3F3F46]/80 leading-relaxed" style={B}>

              <p>TODO: opening paragraph</p>

              <h2>TODO: Section heading</h2>

              <p>TODO: body</p>

              <hr className="my-8 border-zinc-200" />

              <p>
                If you&apos;re in Sonoma County and want to talk through your situation, the first conversation is free.
              </p>
              <p>
                <Link href="/schedule" className="text-orange-500 font-semibold hover:text-orange-600 transition-colors">
                  Book a free 15-minute call →
                </Link>
              </p>

              <p className="text-sm text-zinc-500 mt-8">
                Related:{" "}
                <Link href="/services/it-support" className="text-orange-500 hover:text-orange-600">IT Support</Link>
                {" · "}
                <Link href="/blog" className="text-orange-500 hover:text-orange-600">More Resources</Link>
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
`;

writeFileSync(destFile, template, "utf8");
console.log(`✓ Created: ${destFile}`);

// Count published posts
const blogDir = join(ROOT, "src/app/blog");
const published = readdirSync(blogDir).filter(
  (d) => d !== "page.tsx" && existsSync(join(blogDir, d, "page.tsx"))
).length;

console.log(`\nTotal blog posts (including this one): ${published}`);
console.log(`\nNext steps:`);
console.log(`  1. Fill in content in: src/app/blog/${slug}/page.tsx`);
console.log(`  2. Add to src/app/blog/page.tsx posts array (at the top of the June 2026 section)`);
console.log(`     { slug: "${slug}", tag: "${tag}", title: "${title}", excerpt: "...", readTime: "X min read", date: "${monthYear}" },`);
console.log(`  3. Add to src/app/sitemap.ts blogPosts array:`);
console.log(`     { slug: "${slug}", lastModified: "${today}", priority: 0.8 },`);
console.log(`  4. Link from the relevant industry or service page's relatedPosts`);
