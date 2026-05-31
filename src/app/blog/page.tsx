import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ArrowRight, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Resources & Blog | Copper Bay Tech",
  description:
    "Practical IT and web advice for Sonoma County small businesses. Learn how to protect your data, improve your website, and make better tech decisions.",
};

type Post = {
  slug: string;
  tag: string;
  title: string;
  excerpt: string;
  readTime: string;
  date: string;
};

const posts: Post[] = [
  {
    slug: "how-to-choose-an-it-company-sonoma-county",
    tag: "IT Support",
    title: "How to Choose an IT Company in Sonoma County (Without Getting Burned)",
    excerpt:
      "Most small businesses hire their first IT vendor after something breaks. Here's what to look for — and what to avoid — before you're in crisis mode.",
    readTime: "5 min read",
    date: "May 2026",
  },
  {
    slug: "is-my-small-business-website-hipaa-compliant",
    tag: "Cybersecurity",
    title: "Is My Small Business Website HIPAA Compliant? A Plain-English Checklist",
    excerpt:
      "If your business handles any patient or health information — even just appointment scheduling — HIPAA applies to your website. Here's what that actually means.",
    readTime: "6 min read",
    date: "April 2026",
  },
  {
    slug: "5-signs-your-business-website-is-costing-you-customers",
    tag: "Web Development",
    title: "5 Signs Your Business Website Is Costing You Customers Right Now",
    excerpt:
      "Slow load times, broken mobile layouts, and missing contact info are invisible revenue killers. Here's how to diagnose them in under 10 minutes — no technical knowledge required.",
    readTime: "4 min read",
    date: "March 2026",
  },
];

export default function BlogPage() {
  return (
    <>
      <Nav />
      <main>
        {/* Hero */}
        <section className="grain relative pt-32 pb-16 bg-[var(--ink-900)] overflow-hidden">
          <div
            className="aurora animate-drift"
            style={{ top: "-30%", left: "10%", width: "40vw", height: "40vw", background: "radial-gradient(circle, rgba(232,133,58,0.2), transparent 65%)" }}
          />
          <div className="relative z-10 max-w-4xl mx-auto px-6">
            <span className="eyebrow inline-block mb-4 px-3 py-1.5 rounded-full glass-dark text-[var(--copper-300)]">
              Resources
            </span>
            <h1
              className="text-4xl md:text-6xl font-bold text-white mb-4 leading-[1.05]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Practical tech advice for
              <br />
              <span className="text-gradient-copper">Sonoma County businesses.</span>
            </h1>
            <p
              className="text-white/60 text-lg max-w-xl"
              style={{ fontFamily: "var(--font-body)" }}
            >
              No jargon, no fluff. Just honest guidance on websites, IT, and security for local business owners.
            </p>
          </div>
        </section>

        {/* Posts */}
        <section className="py-16 bg-[var(--linen)]">
          <div className="max-w-4xl mx-auto px-6">
            <div className="space-y-6">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="card-premium group block overflow-hidden"
                >
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <span
                        className="text-xs font-semibold uppercase tracking-widest px-2.5 py-1 rounded-md"
                        style={{
                          backgroundColor: "rgba(232,133,58,0.1)",
                          color: "var(--copper-700)",
                          fontFamily: "var(--font-heading)",
                        }}
                      >
                        {post.tag}
                      </span>
                      <span
                        className="flex items-center gap-1.5 text-xs text-[#3F3F46]/40"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        <Clock size={12} /> {post.readTime}
                      </span>
                      <span
                        className="text-xs text-[#3F3F46]/30"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {post.date}
                      </span>
                    </div>
                    <h2
                      className="text-xl font-bold text-[#18181B] mb-3 group-hover:text-[var(--copper-700)] transition-colors leading-snug"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {post.title}
                    </h2>
                    <p
                      className="text-sm text-[#3F3F46]/60 leading-relaxed mb-4"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {post.excerpt}
                    </p>
                    <span
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--copper-600)] group-hover:gap-2.5 transition-all"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      Read article <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* CTA */}
            <div className="grain relative overflow-hidden mt-16 rounded-2xl bg-[var(--ink-900)] ring-copper p-10 text-center">
              <div
                className="aurora animate-float"
                style={{ top: "-40%", right: "10%", width: "45%", height: "150%", background: "radial-gradient(circle, rgba(232,133,58,0.18), transparent 65%)" }}
              />
              <div className="relative z-10">
                <p className="eyebrow text-gradient-copper mb-3">
                  Want personalized advice?
                </p>
                <h3
                  className="text-2xl font-bold text-white mb-3"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Skip the reading — just ask us.
                </h3>
                <p
                  className="text-white/60 text-sm mb-6 max-w-md mx-auto"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Free 30-minute consultation. We&rsquo;ll tell you exactly where you stand and what matters most for your business.
                </p>
                <Link
                  href="/#contact"
                  className="btn-copper inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Get a Free Consultation <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
