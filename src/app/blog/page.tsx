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
    slug: "google-business-profile-setup-sonoma-county",
    tag: "Local SEO",
    title: "How to Set Up and Optimize Your Google Business Profile in Sonoma County",
    excerpt:
      "Getting into Google's Map Pack is one of the highest-ROI things a local business can do. Here's a step-by-step guide to claiming, verifying, and fully optimizing your profile.",
    readTime: "6 min read",
    date: "June 2026",
  },
  {
    slug: "google-workspace-vs-microsoft-365-small-business",
    tag: "IT Support",
    title: "Google Workspace vs Microsoft 365: Which Is Right for Your Small Business?",
    excerpt:
      "An honest comparison of Google Workspace and Microsoft 365 — pricing, real-world strengths, and who should use which. No brand favoritism, just practical guidance.",
    readTime: "5 min read",
    date: "June 2026",
  },
  {
    slug: "how-to-rank-on-google-maps-local-business",
    tag: "Local SEO",
    title: "How to Get Your Sonoma County Business to Rank Higher on Google Maps",
    excerpt:
      "The 3 factors Google uses to rank local businesses — and the specific, actionable steps you can take to move up in Google Maps results.",
    readTime: "5 min read",
    date: "June 2026",
  },
  {
    slug: "ransomware-protection-small-business",
    tag: "Cybersecurity",
    title: "Ransomware Protection for Small Business: What Actually Works",
    excerpt:
      "Small businesses are the #1 ransomware target. Here's what actually protects you — and what's a waste of money — explained without the technical jargon.",
    readTime: "7 min read",
    date: "May 2026",
  },
  {
    slug: "best-website-for-a-sonoma-county-winery",
    tag: "Web Development",
    title: "What Makes a Great Website for a Sonoma County Winery?",
    excerpt:
      "Tasting room visits, wine club signups, and DTC sales all start with your website. Here's what most winery sites get wrong — and what actually drives results.",
    readTime: "5 min read",
    date: "May 2026",
  },
  {
    slug: "how-much-does-it-support-cost-for-small-business",
    tag: "IT Support",
    title: "How Much Does IT Support Cost for a Small Business in Sonoma County?",
    excerpt:
      "Hourly? Retainer? Break-fix? Here's what IT support actually costs for small businesses — and how to avoid overpaying.",
    readTime: "6 min read",
    date: "May 2026",
  },
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
        <section className="pt-32 pb-16 bg-[#18181B]">
          <div className="max-w-4xl mx-auto px-6">
            <span
              className="inline-block mb-4 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest"
              style={{
                backgroundColor: "rgba(249,115,22,0.15)",
                color: "#F97316",
                fontFamily: "var(--font-heading)",
              }}
            >
              Resources
            </span>
            <h1
              className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Practical tech advice for
              <br />
              <span style={{ color: "#F97316" }}>Sonoma County businesses.</span>
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
        <section className="py-16 bg-[#FAFAF9]">
          <div className="max-w-4xl mx-auto px-6">
            <div className="space-y-6">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block rounded-2xl bg-white border border-[#18181B]/10 hover:border-[#18181B]/30 transition-all overflow-hidden shadow-sm hover:shadow-md"
                >
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <span
                        className="text-xs font-semibold uppercase tracking-widest px-2.5 py-1 rounded-md"
                        style={{
                          backgroundColor: "rgba(249,115,22,0.1)",
                          color: "#F97316",
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
                      className="text-xl font-bold text-[#18181B] mb-3 group-hover:text-[#F97316] transition-colors leading-snug"
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
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#F97316] group-hover:gap-2.5 transition-all"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      Read article <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-16 rounded-2xl bg-[#18181B] p-10 text-center">
              <p
                className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-3"
                style={{ fontFamily: "var(--font-heading)" }}
              >
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
                Free 30-minute consultation. We'll tell you exactly where you stand and what matters most for your business.
              </p>
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-semibold text-[#18181B] bg-[#F97316] hover:bg-[#ea6c0a] transition-colors"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Get a Free Consultation <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
