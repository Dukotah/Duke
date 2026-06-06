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
  // June 2026 — comparison guides
  {
    slug: "squarespace-vs-custom-website-for-small-business",
    tag: "Web Development",
    title: "Squarespace vs Custom Website for Small Business: An Honest Comparison",
    excerpt: "Website builders like Squarespace are genuinely fine for some businesses — and the wrong call for others. A both-sides look at cost, SEO ceilings, lock-in, and when each option actually makes sense.",
    readTime: "7 min read",
    date: "June 2026",
  },
  {
    slug: "local-it-company-vs-national-msp",
    tag: "IT Support",
    title: "Local IT Company vs National MSP: Which Is Right for Your Small Business?",
    excerpt: "Ticket queues, rotating technicians, and per-device fees — or a direct line, flat monthly pricing, and someone who already knows your setup. An honest comparison of local IT vs national MSPs.",
    readTime: "6 min read",
    date: "June 2026",
  },
  {
    slug: "free-antivirus-vs-managed-security-small-business",
    tag: "Cybersecurity",
    title: "Free Antivirus vs Managed Security: What Small Businesses Actually Need",
    excerpt: "Free antivirus like Windows Defender is a useful layer — but only one layer. What free AV covers, the gaps that actually cause breaches, and when to move to managed security.",
    readTime: "6 min read",
    date: "June 2026",
  },
  // June 2026
  {
    slug: "how-ai-helps-sonoma-county-small-businesses",
    tag: "AI & Automation",
    title: "How AI Actually Helps a Sonoma County Small Business (2026)",
    excerpt: "Practical, non-hype ways small businesses are using AI in 2026 — answering every call, responding to leads in seconds, automating reviews, and clearing the busywork. What works, what to skip, and where to start.",
    readTime: "6 min read",
    date: "June 2026",
  },
  {
    slug: "small-business-cybersecurity-threats-sonoma-county",
    tag: "Cybersecurity",
    title: "The 5 Cybersecurity Threats Most Likely to Hit a Sonoma County Small Business in 2026",
    excerpt: "Phishing, ransomware, weak passwords, unpatched software, and lost laptops account for nearly every local breach we see. Here's what each one looks like — and the fixes that actually stop them.",
    readTime: "6 min read",
    date: "June 2026",
  },
  {
    slug: "google-business-profile-setup-sonoma-county",
    tag: "Local SEO",
    title: "How to Set Up and Optimize Your Google Business Profile in Sonoma County",
    excerpt: "A step-by-step guide to claiming, verifying, and optimizing your Google Business Profile so Sonoma County customers can find you in Google Maps and local search.",
    readTime: "6 min read",
    date: "June 2026",
  },
  {
    slug: "google-workspace-vs-microsoft-365-small-business",
    tag: "IT Support",
    title: "Google Workspace vs Microsoft 365: Which Is Right for Your Small Business?",
    excerpt: "An honest comparison of Google Workspace and Microsoft 365 for small businesses — pricing, features, and who should use which.",
    readTime: "5 min read",
    date: "June 2026",
  },
  {
    slug: "how-to-rank-on-google-maps-local-business",
    tag: "Local SEO",
    title: "How to Get Your Sonoma County Business to Rank Higher on Google Maps",
    excerpt: "The 3 factors Google uses to rank local businesses on Google Maps — and the specific steps you can take to improve your ranking in Sonoma County.",
    readTime: "5 min read",
    date: "June 2026",
  },
  {
    slug: "how-to-speed-up-your-business-website",
    tag: "Web Development",
    title: "How to Speed Up Your Business Website (Without a Developer)",
    excerpt: "Five things you can do today without touching code — and three signs it's time to call in a developer.",
    readTime: "5 min read",
    date: "June 2026",
  },
  {
    slug: "small-business-website-cost-guide",
    tag: "Web Development",
    title: "How Much Does a Business Website Cost in 2026? A Plain-English Guide",
    excerpt: "DIY builders, freelancers, agencies, custom dev — the honest price ranges, what drives costs up, and what you should expect to pay in Sonoma County.",
    readTime: "6 min read",
    date: "June 2026",
  },
  {
    slug: "what-is-a-managed-service-provider",
    tag: "IT Support",
    title: "What Is a Managed Service Provider (MSP) — and Does Your Small Business Need One?",
    excerpt: "MSP, break-fix, in-house IT — what's the difference, when does each make sense, and what should a small business in Sonoma County actually expect to pay?",
    readTime: "5 min read",
    date: "June 2026",
  },
  {
    slug: "why-your-business-needs-mfa",
    tag: "Cybersecurity",
    title: "Why Every Small Business Needs Multi-Factor Authentication (And How to Set It Up)",
    excerpt: "95% of account takeovers rely on stolen passwords alone. MFA stops them. Here's what it is, why it matters, and how to turn it on in under 10 minutes.",
    readTime: "4 min read",
    date: "June 2026",
  },
  // May 2026
  {
    slug: "best-website-for-a-sonoma-county-winery",
    tag: "Web Development",
    title: "What Makes a Great Website for a Sonoma County Winery?",
    excerpt: "Tasting room visits, wine club signups, and direct-to-consumer sales all start with your website. Here's what Sonoma County wineries get wrong — and what works.",
    readTime: "5 min read",
    date: "May 2026",
  },
  {
    slug: "hipaa-security-checklist-sonoma-county-healthcare",
    tag: "Cybersecurity",
    title: "HIPAA Security Checklist for Sonoma County Healthcare Practices",
    excerpt: "A practical HIPAA technical security checklist for small healthcare practices in Sonoma County. What you actually need — and what most practices are missing.",
    readTime: "7 min read",
    date: "May 2026",
  },
  {
    slug: "how-much-does-a-website-cost-sonoma-county",
    tag: "Web Development",
    title: "How Much Does a Website Cost in Sonoma County? (2026)",
    excerpt: "Real pricing for small business websites in Sonoma County. What you should expect to pay, what drives costs up, and how to avoid getting ripped off.",
    readTime: "6 min read",
    date: "May 2026",
  },
  {
    slug: "how-much-does-it-support-cost-for-small-business",
    tag: "IT Support",
    title: "How Much Does IT Support Cost for a Small Business in Sonoma County?",
    excerpt: "Hourly? Retainer? Break-fix? Here's what IT support actually costs for small businesses in Sonoma County — and how to avoid overpaying.",
    readTime: "6 min read",
    date: "May 2026",
  },
  {
    slug: "how-to-back-up-your-small-business-data",
    tag: "IT Support",
    title: "How to Back Up Your Small Business Data (The Right Way)",
    excerpt: "Most small business backups fail when they're actually needed. The 3-2-1 rule, cloud vs. local, and how to know your backups will actually work.",
    readTime: "6 min read",
    date: "May 2026",
  },
  {
    slug: "how-to-choose-an-it-company-sonoma-county",
    tag: "IT Support",
    title: "How to Choose an IT Company in Sonoma County (Without Getting Burned)",
    excerpt: "Most small businesses hire their first IT vendor after something breaks. Here's what to look for — and what to avoid — before you're in crisis mode.",
    readTime: "5 min read",
    date: "May 2026",
  },
  {
    slug: "managed-it-support-vs-break-fix-sonoma-county",
    tag: "IT Support",
    title: "Managed IT Support vs. Break-Fix: Which Is Right for Your Sonoma County Business?",
    excerpt: "Break-fix IT feels cheaper until something breaks at the worst possible moment. Here's how to decide which model makes sense for your Sonoma County business.",
    readTime: "5 min read",
    date: "May 2026",
  },
  {
    slug: "ransomware-protection-small-business",
    tag: "Cybersecurity",
    title: "Ransomware Protection for Small Business: What Actually Works",
    excerpt: "Small businesses are the #1 ransomware target. Here's what actually protects you — and what's a waste of money — explained without the technical jargon.",
    readTime: "7 min read",
    date: "May 2026",
  },
  {
    slug: "why-slow-websites-hurt-sonoma-county-businesses",
    tag: "Web Performance",
    title: "Why a Slow Website Is Costing Your Sonoma County Business Customers",
    excerpt: "If your site takes more than 3 seconds to load, more than half your visitors are already gone. Here's what's slowing you down and how to fix it.",
    readTime: "4 min read",
    date: "May 2026",
  },
  // April 2026
  {
    slug: "how-much-should-a-small-business-website-cost",
    tag: "Web Development",
    title: "How Much Should a Small Business Website Cost? (Honest Answer)",
    excerpt: "Website pricing ranges wildly — from $500 DIY to $50,000 agency builds. Here's what actually drives the cost and what Sonoma County small businesses should realistically expect to pay.",
    readTime: "5 min read",
    date: "April 2026",
  },
  {
    slug: "is-my-small-business-website-hipaa-compliant",
    tag: "Cybersecurity",
    title: "Is My Small Business Website HIPAA Compliant? A Plain-English Checklist",
    excerpt: "If your business collects patient info online, HIPAA applies. Here is a plain-English checklist.",
    readTime: "6 min read",
    date: "April 2026",
  },
  {
    slug: "signs-you-need-a-new-website",
    tag: "Web Development",
    title: "7 Signs It's Time for a New Business Website (Not Just a Refresh)",
    excerpt: "Some website problems can be patched. Others mean it's time to start over. Here are 7 signs your current site is holding your business back.",
    readTime: "6 min read",
    date: "April 2026",
  },
  {
    slug: "winery-cybersecurity-sonoma-county",
    tag: "Cybersecurity",
    title: "Why Sonoma County Wineries Are a Cybersecurity Target (And What to Do About It)",
    excerpt: "Wine club data, tasting room POS systems, and reservation platforms make Sonoma County wineries attractive targets. Here's what to do about it.",
    readTime: "6 min read",
    date: "April 2026",
  },
  // March 2026
  {
    slug: "5-signs-your-business-website-is-costing-you-customers",
    tag: "Web Development",
    title: "5 Signs Your Business Website Is Costing You Customers Right Now",
    excerpt: "Slow load times, broken mobile layouts, and missing contact info are invisible revenue killers. Here is how to diagnose them fast.",
    readTime: "4 min read",
    date: "March 2026",
  },
  {
    slug: "cloud-vs-local-server-small-business",
    tag: "IT Support",
    title: "Cloud vs. Local Server: What's Actually Right for Your Small Business?",
    excerpt: "Should your small business move to the cloud or keep a local server? Here's a direct comparison for businesses with 3–30 employees — including when local still makes sense.",
    readTime: "6 min read",
    date: "March 2026",
  },
  {
    slug: "google-business-profile-tips-local-business",
    tag: "Local SEO",
    title: "Google Business Profile Tips That Actually Get You Found Locally",
    excerpt: "Most local businesses leave their Google Business Profile half-filled. Here's exactly what to do to show up when customers are searching nearby.",
    readTime: "6 min read",
    date: "March 2026",
  },
  {
    slug: "restaurant-technology-guide-sonoma-county",
    tag: "IT Support",
    title: "The Small Restaurant Owner's Guide to Technology in Sonoma County",
    excerpt: "POS systems, WiFi reliability, online ordering, and data backup — a practical technology guide for Sonoma County restaurant owners.",
    readTime: "7 min read",
    date: "March 2026",
  },
  // February 2026
  {
    slug: "do-small-businesses-need-cybersecurity",
    tag: "Cybersecurity",
    title: "Do Small Businesses Really Need Cybersecurity? (Yes, Here's Why)",
    excerpt: "The myth that hackers only target large companies is costing small businesses millions. Here's the truth — and what to do about it.",
    readTime: "6 min read",
    date: "February 2026",
  },
  {
    slug: "what-is-managed-it-support",
    tag: "IT Support",
    title: "What Is Managed IT Support — and Does Your Business Need It?",
    excerpt: "Break/fix IT is reactive and unpredictable. Managed IT support is proactive and flat-fee. Here's how to know which model is right for your business.",
    readTime: "6 min read",
    date: "February 2026",
  },
  {
    slug: "what-is-ransomware-and-how-do-you-stop-it",
    tag: "Cybersecurity",
    title: "What Is Ransomware and How Do Small Businesses Actually Stop It?",
    excerpt: "Ransomware attacks on small businesses are up 300%. This is what it is, how it gets in, and the specific steps Sonoma County business owners can take to protect themselves.",
    readTime: "7 min read",
    date: "February 2026",
  },
  {
    slug: "why-your-google-business-profile-matters",
    tag: "Local SEO",
    title: "Why Your Google Business Profile Is the Most Important Page You Don't Own",
    excerpt: "Most Sonoma County small businesses ignore their Google Business Profile. Here's why it matters more than your website for local search, and exactly what to fix today.",
    readTime: "5 min read",
    date: "February 2026",
  },
  // January 2026
  {
    slug: "how-much-does-a-website-cost-for-a-small-business",
    tag: "Web Development",
    title: "How Much Does a Website Cost for a Small Business in 2026?",
    excerpt: "DIY, freelancer, or agency? We break down real website costs for small businesses in 2026 — and explain why the cheapest option often costs the most.",
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
