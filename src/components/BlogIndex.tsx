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

const HEAD = { fontFamily: "var(--font-heading)" };
const BODY = { fontFamily: "var(--font-body)" };

function MetaRow({ post }: { post: Post }) {
  const color = tagColor(post.tag);
  return (
    <div className="flex flex-wrap items-center gap-3 mb-4">
      <span
        className="text-xs font-semibold uppercase tracking-widest px-2.5 py-1 rounded-md"
        style={{ ...HEAD, color, backgroundColor: `${color}14` }}
      >
        {post.tag}
      </span>
      <span className="flex items-center gap-1.5 text-xs text-[#3F3F46]/70" style={BODY}>
        <Clock size={12} aria-hidden /> {post.readTime}
      </span>
      <span className="text-xs text-[#3F3F46]/70" style={BODY}>
        {post.date}
      </span>
    </div>
  );
}

function Card({ post }: { post: Post }) {
  const color = tagColor(post.tag);
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group relative flex flex-col h-full rounded-2xl bg-white border border-[#18181B]/10 hover:border-[#18181B]/25 transition-all overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-2"
    >
      <span aria-hidden className="absolute inset-y-0 left-0 w-1" style={{ backgroundColor: color }} />
      <div className="p-7 pl-8 flex flex-col flex-1">
        <MetaRow post={post} />
        <h3
          className="text-lg font-bold text-[#18181B] mb-2.5 leading-snug group-hover:text-[#F97316] transition-colors"
          style={HEAD}
        >
          {post.title}
        </h3>
        <p className="text-sm text-[#3F3F46]/70 leading-relaxed mb-5 flex-1" style={BODY}>
          {post.excerpt}
        </p>
        <span
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold-on-light group-hover:gap-2.5 transition-all mt-auto"
          style={HEAD}
        >
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
  const featuredColor = featured ? tagColor(featured.tag) : "#F97316";

  return (
    <section className="py-14 bg-[#FAFAF9]">
      <div className="max-w-5xl mx-auto px-6">
        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-10" role="group" aria-label="Filter articles by category">
          {categories.map((cat) => {
            const on = active === cat;
            return (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                aria-pressed={on}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-2"
                style={
                  on
                    ? { ...HEAD, backgroundColor: "#18181B", color: "#fff" }
                    : { ...HEAD, backgroundColor: "#fff", color: "#3F3F46", border: "1px solid rgba(24,24,27,0.12)" }
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
            className="group relative block mb-8 rounded-2xl bg-white border border-[#18181B]/10 hover:border-[#18181B]/25 transition-all overflow-hidden shadow-sm hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-2"
          >
            <span aria-hidden className="absolute inset-y-0 left-0 w-1.5" style={{ backgroundColor: featuredColor }} />
            <div className="p-8 md:p-10 pl-9 md:pl-12">
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="text-[11px] font-bold uppercase tracking-[0.2em]"
                  style={{ ...HEAD, color: "#F97316" }}
                >
                  Latest
                </span>
              </div>
              <MetaRow post={featured} />
              <h2
                className="text-2xl md:text-3xl font-bold text-[#18181B] mb-3 leading-tight group-hover:text-[#F97316] transition-colors"
                style={HEAD}
              >
                {featured.title}
              </h2>
              <p className="text-[#3F3F46]/70 leading-relaxed mb-5 max-w-2xl md:text-lg" style={BODY}>
                {featured.excerpt}
              </p>
              <span
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold-on-light group-hover:gap-2.5 transition-all"
                style={HEAD}
              >
                Read article <ArrowRight size={15} aria-hidden />
              </span>
            </div>
          </Link>
        )}

        {/* Grid */}
        <div className="grid sm:grid-cols-2 gap-6">
          {grid.map((post) => (
            <Card key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
