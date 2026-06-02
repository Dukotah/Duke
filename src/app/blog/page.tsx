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
    slug: "how-ai-helps-sonoma-county-small-businesses",
    tag: "AI & Automation",
    title: "How AI Actually Helps a Sonoma County Small Business (2026)",
    excerpt:
      "No hype, no doom — just the practical ways small businesses use AI in 2026: answer every call, reply to leads in seconds, automate reviews, and clear the busywork. What works, what to skip, and where to start.",
    readTime: "6 min read",
    date: "June 2026",
  },
  {
    slug: "small-business-cybersecurity-threats-sonoma-county",
    tag: "Cybersecurity",
    title: "The 5 Cybersecurity Threats Most Likely to Hit a Sonoma County Small Business in 2026",
    excerpt:
      "Phishing, ransomware, weak passwords, unpatched software, and lost laptops account for nearly every local breach we see. Here's what each one looks like — and the fixes that actually stop them.",
    readTime: "6 min read",
    date: "June 2026",
  },
  {
    slug: "how-much-does-a-website-cost-sonoma-county",
    tag: "Web Development",
    title: "How Much Does a Website Cost in Sonoma County? (2026)",
    excerpt:
      "Real pricing for small business websites in Sonoma County. What you should expect to pay, what drives costs up, and how to avoid getting ripped off.",
    readTime: "6 min read",
    date: "May 2026",
  },
  {
    slug: "managed-it-support-vs-break-fix-sonoma-county",
    tag: "IT Support",
    title: "Managed IT Support vs. Break-Fix: Which Is Right for Your Business?",
    excerpt:
      "Break-fix IT feels cheaper until something breaks at the worst moment. Here's how to actually think through which model makes sense for a Sonoma County small business.",
    readTime: "5 min read",
    date: "May 2026",
  },
  {
    slug: "hipaa-security-checklist-sonoma-county-healthcare",
    tag: "Cybersecurity",
    title: "HIPAA Security Checklist for Sonoma County Healthcare Practices",
    excerpt:
      "A practical checklist covering technical safeguards under the HIPAA Security Rule — what small practices need, what most are missing, and the four gaps we find almost every time.",
    readTime: "7 min read",
    date: "May 2026",
  },
  {
    slug: "how-to-choose-an-it-company-sonoma-county",
    tag: "IT Support",
    title: "How to Choose an IT Company in Sonoma County (Without Getting Burned)",
    excerpt:
      "Most small businesses hire their first IT vendor after something breaks. Here's what to look for — and what to avoid — before you're in crisis mode.",
    readTime: "5 min read",
    date: "April 2026",
  },
  {
    slug: "winery-cybersecurity-sonoma-county",
    tag: "Cybersecurity",
    title: "Why Sonoma County Wineries Are a Cybersecurity Target (And What to Do About It)",
    excerpt:
      "Wine club member data, tasting room POS systems, and supplier email relationships make Sonoma County wineries attractive targets. Here's what to do about it.",
    readTime: "6 min read",
    date: "April 2026",
  },
  {
    slug: "signs-you-need-a-new-website",
    tag: "Web Development",
    title: "7 Signs It's Time for a New Business Website (Not Just a Refresh)",
    excerpt:
      "Some website problems can be patched. Others mean it's time to start over. Here are the seven signs your current site is actively holding your business back.",
    readTime: "6 min read",
    date: "April 2026",
  },
  {
    slug: "is-my-small-business-website-hipaa-compliant",
    tag: "Cybersecurity",
    title: "Is My Small Business Website HIPAA Compliant? A Plain-English Checklist",
    excerpt:
      "If your business handles any patient or health information — even just appointment scheduling — HIPAA applies to your website. Here's what that actually means.",
    readTime: "6 min read",
    date: "March 2026",
  },
  {
    slug: "google-business-profile-tips-local-business",
    tag: "Web Development",
    title: "Google Business Profile Tips That Actually Get You Found Locally",
    excerpt:
      "Most local businesses leave their Google Business Profile half-filled. Here's exactly what to complete — and what to do weekly — to show up when customers are searching nearby.",
    readTime: "6 min read",
    date: "March 2026",
  },
  {
    slug: "restaurant-technology-guide-sonoma-county",
    tag: "IT Support",
    title: "The Small Restaurant Owner's Guide to Technology in Sonoma County",
    excerpt:
      "POS systems, WiFi setup, online ordering, review management, and data backup — a practical technology guide written for Sonoma County restaurant owners.",
    readTime: "7 min read",
    date: "March 2026",
  },
  {
    slug: "5-signs-your-business-website-is-costing-you-customers",
    tag: "Web Development",
    title: "5 Signs Your Business Website Is Costing You Customers Right Now",
    excerpt:
      "Slow load times, broken mobile layouts, and missing contact info are invisible revenue killers. Here's how to diagnose them in under 10 minutes — no technical knowledge required.",
    readTime: "4 min read",
    date: "February 2026",
  },
  {
    slug: "what-is-managed-it-support",
    tag: "IT Support",
    title: "What Is Managed IT Support — and Does Your Business Need It?",
    excerpt:
      "Break/fix IT is reactive and unpredictable. Managed IT support is proactive and flat-fee. Here's how the two compare — and how to know which model is right for your business.",
    readTime: "6 min read",
    date: "February 2026",
  },
  {
    slug: "do-small-businesses-need-cybersecurity",
    tag: "Cybersecurity",
    title: "Do Small Businesses Really Need Cybersecurity? (Yes, Here's Why)",
    excerpt:
      "\"We're too small to be a target\" is the most dangerous sentence in small business IT. Here's what the data actually shows — and the steps that make the biggest difference.",
    readTime: "6 min read",
    date: "February 2026",
  },
  {
    slug: "how-much-does-a-website-cost-for-a-small-business",
    tag: "Web Development",
    title: "How Much Does a Website Cost for a Small Business in 2026?",
    excerpt:
      "DIY, freelancer, or agency? We break down real website costs, what drives the price up, and why the cheapest option almost always costs the most in the long run.",
    readTime: "7 min read",
    date: "January 2026",
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
                Free 30-minute consultation. We&apos;ll tell you exactly where you stand and what matters most for your business.
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
