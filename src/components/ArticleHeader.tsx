import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { tagColor } from "@/lib/blogTags";

/**
 * Shared article hero for blog posts. Replaces the per-post inline hero so every
 * article shares one redesigned header: back-link, category-colored chip, a
 * tighter large headline, and a readable byline/meta row. Content (tag, title,
 * date, readTime) is passed in per post — nothing about the article body changes.
 */
export default function ArticleHeader({
  tag,
  title,
  date,
  readTime,
}: {
  tag: string;
  title: string;
  date: string;
  readTime: string;
}) {
  const color = tagColor(tag);
  const HEAD = { fontFamily: "var(--font-heading)" };
  return (
    <section className="pt-32 pb-10 bg-[#18181B]">
      <div className="max-w-2xl mx-auto px-6">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-white/55 hover:text-white transition-colors mb-8 focus-visible:outline-none focus-visible:underline"
          style={HEAD}
        >
          <ArrowLeft size={14} aria-hidden /> All articles
        </Link>
        <span
          className="inline-block mb-5 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-widest"
          style={{ ...HEAD, color, backgroundColor: `${color}26` }}
        >
          {tag}
        </span>
        <h1
          className="text-3xl md:text-[2.6rem] font-bold text-white mb-5 leading-[1.12]"
          style={HEAD}
        >
          {title}
        </h1>
        <div
          className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/60"
          style={{ fontFamily: "var(--font-body)" }}
        >
          <span className="font-semibold text-white/80">By Dukotah Hutcheon</span>
          <span aria-hidden className="text-white/30">·</span>
          <span>{date}</span>
          <span aria-hidden className="text-white/30">·</span>
          <span>{readTime}</span>
        </div>
      </div>
    </section>
  );
}
