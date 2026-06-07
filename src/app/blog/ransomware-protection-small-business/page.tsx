import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ArrowLeft, ArrowRight, ShieldAlert } from "lucide-react";
import ArticleHeader from "@/components/ArticleHeader";
import BlogEmailCapture from "@/components/BlogEmailCapture";
import JsonLd, { blogPostingSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Ransomware Protection for Small Business: What Actually Works | Copper Bay Tech",
  description:
    "Small businesses are the #1 ransomware target. Here's what actually protects you — and what's a waste of money — explained without the technical jargon.",
  alternates: {
    canonical: "https://copperbaytech.com/blog/ransomware-protection-small-business",
  },
  openGraph: {
    title: "Ransomware Protection for Small Business: What Actually Works | Copper Bay Tech",
    description:
      "Small businesses are the #1 ransomware target. Here's what actually protects you — and what's a waste of money — explained without the technical jargon.",
    url: "https://copperbaytech.com/blog/ransomware-protection-small-business",
    siteName: "Copper Bay Tech",
    type: "article",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

const protections = [
  {
    rank: "01",
    title: "Offline, tested backups",
    impact: "High",
    desc: "The single most important thing. If ransomware encrypts your files, a recent backup means you recover in hours instead of paying tens of thousands of dollars. The key word is 'tested' — most businesses have backups they've never verified actually work.",
  },
  {
    rank: "02",
    title: "Multi-factor authentication (MFA) on everything",
    impact: "High",
    desc: "Most ransomware gets in through stolen credentials. MFA means a stolen password alone isn't enough. Enable it on email, cloud storage, banking, and any remote access tools. It takes 10 minutes to set up and eliminates a massive attack surface.",
  },
  {
    rank: "03",
    title: "Email filtering and phishing training",
    impact: "High",
    desc: "Over 90% of ransomware starts with a phishing email. A good email filter catches most of them. Staff training catches the rest. One 30-minute phishing awareness session can prevent a $200k incident.",
  },
  {
    rank: "04",
    title: "Software and firmware updates",
    impact: "Medium",
    desc: "Ransomware frequently exploits known vulnerabilities in unpatched software. Keeping Windows, applications, routers, and firewalls up to date eliminates a huge category of attack. Automate this wherever possible.",
  },
  {
    rank: "05",
    title: "Endpoint detection (EDR) software",
    impact: "Medium",
    desc: "Better than standard antivirus. EDR tools detect suspicious behavior — not just known malware signatures — and can stop an attack in progress. For businesses with 5+ workstations, this is worth the investment.",
  },
  {
    rank: "06",
    title: "Network segmentation",
    impact: "Medium",
    desc: "Separating your guest Wi-Fi from your business network, and your point-of-sale system from everything else, limits how far ransomware can spread if it gets in. Simple to implement, often overlooked.",
  },
];

export default function Article() {
  return (
    <>
      <JsonLd schema={blogPostingSchema({ title: "Ransomware Protection for Small Business: What Actually Works", description: "Small businesses are the #1 ransomware target. Here's what actually protects you — and what's a waste of money — explained without the technical jargon.", url: "https://copperbaytech.com/blog/ransomware-protection-small-business", datePublished: "2026-05-25" })} />
      <JsonLd schema={breadcrumbSchema([{ name: "Home", url: "https://copperbaytech.com" }, { name: "Blog", url: "https://copperbaytech.com/blog" }, { name: "Ransomware Protection Small Business" }])} />
      <Nav />
      <main>
        <ArticleHeader tag="Cybersecurity" title="Ransomware Protection for Small Business: What Actually Works" date="May 2026" readTime="7 min read" />

        <section className="py-12 bg-white">
          <div className="max-w-2xl mx-auto px-6" style={{ fontFamily: "var(--font-body)" }}>
            <p className="text-lg text-[#3F3F46]/70 mb-6 leading-relaxed">
              Small businesses now account for more than half of all ransomware attacks. The reason is simple: you&apos;re a softer target than an enterprise, and you&apos;re more likely to pay because you can&apos;t afford weeks of downtime. The average ransom paid by a small business is $36,000. The average total cost of recovery — including downtime, lost data, and remediation — is closer to $200,000.
            </p>
            <p className="text-[#3F3F46]/70 mb-10 leading-relaxed">
              The good news: most ransomware attacks are preventable with a handful of basic measures. Here&apos;s what actually works, ranked by impact.
            </p>

            <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-6" style={{ fontFamily: "var(--font-heading)" }}>
              What actually works
            </h2>

            <div className="space-y-6 mb-10">
              {protections.map((p) => (
                <div key={p.rank} className="flex gap-5">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-[#18181B] flex items-center justify-center">
                      <span className="text-sm font-bold text-[#F97316]" style={{ fontFamily: "var(--font-heading)" }}>{p.rank}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-[#18181B]" style={{ fontFamily: "var(--font-heading)" }}>{p.title}</h3>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.impact === "High" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`} style={{ fontFamily: "var(--font-heading)" }}>
                        {p.impact} impact
                      </span>
                    </div>
                    <p className="text-sm text-[#3F3F46]/70 leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              What doesn&apos;t work (on its own)
            </h2>
            <div className="space-y-3 mb-10">
              {[
                { item: "Antivirus alone", why: "Traditional antivirus catches known threats. Ransomware is constantly evolving and often slips past it. It's necessary but not sufficient." },
                { item: "Cyber insurance without controls", why: "Insurance is important but it doesn't prevent an attack — it just helps you recover financially. And premiums are rising fast for businesses without basic controls in place." },
                { item: "One-time security setup", why: "Security is not a project, it's an ongoing practice. Threats evolve, software changes, staff turns over. A setup from 3 years ago may have significant gaps today." },
              ].map((w) => (
                <div key={w.item} className="rounded-xl border border-[#18181B]/10 p-5 bg-[#FAFAF9]">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldAlert size={15} color="#F97316" />
                    <h3 className="font-semibold text-[#18181B] text-sm" style={{ fontFamily: "var(--font-heading)" }}>{w.item}</h3>
                  </div>
                  <p className="text-sm text-[#3F3F46]/60 leading-relaxed">{w.why}</p>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Where to start if you&apos;re starting from zero
            </h2>
            <p className="text-[#3F3F46]/70 mb-4 leading-relaxed">
              Don&apos;t try to implement everything at once. In order of priority: verify your backups, turn on MFA for email and cloud storage, and schedule a 30-minute phishing awareness session with your staff. Those three things dramatically reduce your risk at minimal cost.
            </p>
            <p className="text-[#3F3F46]/70 mb-8 leading-relaxed">
              A professional security audit will identify your specific gaps and give you a prioritized list. For most small businesses in Sonoma County, a basic audit runs $600–$1,200 and takes less than a week.
            </p>

            <div className="mt-10 p-6 rounded-2xl bg-[#18181B] text-white">
              <p className="text-sm font-semibold mb-2 text-[#F97316]" style={{ fontFamily: "var(--font-heading)" }}>One question to ask yourself</p>
              <p className="text-sm text-white/70">
                If ransomware hit your business tomorrow and encrypted everything — how long would it take to recover, and what would it cost? If you don&apos;t have a clear answer, that&apos;s the gap to close.
              </p>
            </div>

            <BlogEmailCapture />

            <div className="mt-10 pt-8 border-t border-[#18181B]/10 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-[#3F3F46]/50 hover:text-[#18181B] transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
                <ArrowLeft size={14} /> Back to Resources
              </Link>
              <Link href="/#contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-semibold text-white bg-[#F97316] hover:bg-[#ea6c0a] transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
                Book a Security Audit <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
