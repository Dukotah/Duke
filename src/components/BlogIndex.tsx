"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { tagColor } from "@/lib/blogTags";

export type Post = {
  slug: string;
  tag: string;
  title: string;
  excerpt: string;
  readTime: string;
  date: string;
};

function MetaRow({ post }: { post: Post }) {
  const color = tagColor(post.tag);
  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <span
        className="rounded-md px-2.5 py-1 text-xs font-semibold uppercase tracking-widest"
        style={{ color, backgroundColor: `${color}1f` }}
      >
        {post.tag}
      </span>
      <span className="flex items-center gap-1.5 text-xs text-zinc-500">
        <Clock size={12} aria-hidden /> {post.readTime}
      </span>
      <span className="text-xs text-zinc-500">{post.date}</span>
    </div>
  );
}

function Card({ post }: { post: Post }) {
  const color = tagColor(post.tag);
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="cbt-rise group relative flex h-full flex-col overflow-hidden rounded-2xl border border-hairline bg-ink-1 transition-all hover:-translate-y-0.5 hover:border-copper-dim focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper"
    >
      <span aria-hidden className="absolute inset-y-0 left-0 w-1" style={{ backgroundColor: color }} />
      <div className="flex flex-1 flex-col p-7 pl-8">
        <MetaRow post={post} />
        <h3 className="mb-2.5 text-lg font-bold leading-snug text-white transition-colors group-hover:text-copper-bright">
          {post.title}
        </h3>
        <p className="mb-5 flex-1 text-sm leading-relaxed text-zinc-400">{post.excerpt}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-copper-bright transition-all group-hover:gap-2.5">
          Read article <ArrowRight size={14} aria-hidden />
        </span>
      </div>
    </Link>
  );
}

export default function BlogIndex({ posts }: { posts: Post[] }) {
  const categories = ["All", ...Array.from(new Set(posts.map((p) => p.tag)))];
  const [active, setActive] = useState("All");

  const filtered = active === "All" ? posts : posts.filter((p) => p.tag === active);
  // Spotlight the newest post only on the unfiltered view; when filtering, every
  // matching post is equal weight in the grid.
  const featured = active === "All" ? filtered[0] : null;
  const grid = featured ? filtered.slice(1) : filtered;
  const featuredColor = featured ? tagColor(featured.tag) : "#DDAA75";

  return (
    <section className="bg-ink-0 py-14">
      <div className="mx-auto max-w-5xl px-6">
        {/* Category filter */}
        <div className="mb-10 flex flex-wrap gap-2" role="group" aria-label="Filter articles by category">
          {categories.map((cat) => {
            const on = active === cat;
            return (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                aria-pressed={on}
                className={
                  "rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper " +
                  (on
                    ? "bg-copper text-ink-0"
                    : "border border-hairline bg-ink-1 text-zinc-300 hover:border-copper-dim hover:text-white")
                }
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Featured (newest) */}
        {featured && (
          <Link
            href={`/blog/${featured.slug}`}
            className="cbt-rise group relative mb-8 block overflow-hidden rounded-2xl border border-hairline bg-ink-1 transition-all hover:border-copper-dim focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper"
          >
            <span aria-hidden className="absolute inset-y-0 left-0 w-1.5" style={{ backgroundColor: featuredColor }} />
            <div className="p-8 pl-9 md:p-10 md:pl-12">
              <div className="mb-4 flex items-center gap-3">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-copper-bright">Latest</span>
              </div>
              <MetaRow post={featured} />
              <h2 className="mb-3 text-2xl font-bold leading-tight text-white transition-colors group-hover:text-copper-bright md:text-3xl">
                {featured.title}
              </h2>
              <p className="mb-5 max-w-2xl leading-relaxed text-zinc-400 md:text-lg">{featured.excerpt}</p>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-copper-bright transition-all group-hover:gap-2.5">
                Read article <ArrowRight size={15} aria-hidden />
              </span>
            </div>
          </Link>
        )}

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {grid.map((post) => (
            <Card key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
