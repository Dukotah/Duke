import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog | Copper Bay Tech",
  description: "Practical technology advice for Sonoma County small businesses — websites, IT, cybersecurity, and local SEO.",
};

const posts = [
  {
    slug: "why-slow-websites-hurt-sonoma-county-businesses",
    title: "Why a Slow Website Is Costing Your Sonoma County Business Customers",
    date: "May 30, 2026",
    excerpt: "If your site takes more than 3 seconds to load, more than half your visitors are already gone. Here's what's slowing you down and how to fix it.",
    category: "Web Performance",
  },
];

export default function BlogIndex() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-24">
      <Link href="/" className="text-sm text-[#F97316] hover:underline mb-10 inline-block" style={{ fontFamily: "var(--font-heading)" }}>
        ← Back to home
      </Link>
      <h1 className="text-4xl font-bold text-[#18181B] mb-3" style={{ fontFamily: "var(--font-heading)" }}>
        The Blog
      </h1>
      <p className="text-lg text-[#3F3F46]/60 mb-12" style={{ fontFamily: "var(--font-body)" }}>
        Practical tech advice for Sonoma County small businesses.
      </p>
      <div className="space-y-8">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
            <div className="border border-[#18181B]/8 rounded-xl p-6 hover:border-[#F97316]/40 hover:bg-[#FAFAF9] transition-all">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#F97316]" style={{ fontFamily: "var(--font-heading)" }}>
                {post.category}
              </span>
              <h2 className="text-xl font-bold text-[#18181B] mt-2 mb-2 group-hover:text-[#F97316] transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
                {post.title}
              </h2>
              <p className="text-[#3F3F46]/60 text-sm leading-relaxed mb-3" style={{ fontFamily: "var(--font-body)" }}>
                {post.excerpt}
              </p>
              <p className="text-xs text-[#3F3F46]/40" style={{ fontFamily: "var(--font-body)" }}>{post.date}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
