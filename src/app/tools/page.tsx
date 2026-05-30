import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const tools = [
  {
    realHref: "/tools/health-check",
    icon: "🏥",
    title: "Full Website Health Check",
    desc: "Speed, SSL, SEO, broken links, and mobile readiness — all in one audit. The most complete free site check available.",
    tags: ["Speed", "SSL", "SEO", "Links", "Mobile"],
    cta: "Run Health Check",
  },
  {
    realHref: "/audit",
    icon: "⚡",
    title: "PageSpeed Audit",
    desc: "Google PageSpeed score with Core Web Vitals breakdown — FCP, LCP, CLS, TBT, and the top issues dragging your score down.",
    tags: ["Performance", "Core Web Vitals"],
    cta: "Run Speed Audit",
  },
  {
    realHref: "/compare",
    icon: "⚖️",
    title: "Competitor Comparison",
    desc: "Enter your URL and a competitor's — get a side-by-side score breakdown across speed, SEO, mobile, and accessibility.",
    tags: ["Speed", "SEO", "Mobile", "Accessibility"],
    cta: "Compare Sites",
  },
  {
    realHref: "/tools/email-headers",
    icon: "📧",
    title: "Email Header Analyzer",
    desc: "Paste raw email headers and check SPF, DKIM, DMARC authentication, trace the delivery path, and spot spoofing red flags.",
    tags: ["SPF", "DKIM", "DMARC", "Security"],
    cta: "Analyze Headers",
  },
  {
    realHref: "/tools/password",
    icon: "🔐",
    title: "Password Strength & Breach Checker",
    desc: "Check if a password has appeared in known data breaches using Have I Been Pwned's k-anonymity API — your password never leaves your browser.",
    tags: ["Passwords", "Breaches", "Security"],
    cta: "Check Password",
  },
];

export default function ToolsIndexPage() {
  return (
    <div className="min-h-screen bg-[#18181B] text-white">
      <Nav />

      <section className="pt-32 pb-16 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <span className="inline-block bg-orange-500/10 text-orange-400 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 border border-orange-500/20">
            Free Tools
          </span>
          <h1 className="text-4xl sm:text-5xl font-black mb-4 leading-tight">
            Free Tools for{" "}
            <span className="text-orange-400">Small Business Owners</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Audit your website, check your security, analyze email headers — all free, no signup, no fluff. Built by Copper Bay Tech for Sonoma County businesses.
          </p>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="max-w-3xl mx-auto space-y-4">
          {tools.map((tool, i) => (
            <Link
              key={i}
              href={tool.realHref}
              className="group flex items-start gap-5 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-600 transition-colors"
            >
              <span className="text-3xl flex-shrink-0">{tool.icon}</span>
              <div className="flex-1 min-w-0">
                <h2 className="text-white font-bold text-lg group-hover:text-orange-400 transition-colors mb-1">{tool.title}</h2>
                <p className="text-zinc-400 text-sm leading-relaxed mb-3">{tool.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {tool.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-orange-400 text-sm font-semibold flex-shrink-0 group-hover:gap-2.5 transition-all pt-1">
                {tool.cta} <ArrowRight size={14} />
              </div>
            </Link>
          ))}

          <div className="mt-8 rounded-2xl p-8 text-center border border-zinc-800 bg-zinc-900">
            <p className="text-orange-400 text-xs font-semibold uppercase tracking-wider mb-3">Need the full picture?</p>
            <h2 className="text-white text-xl font-black mb-3">Talk to a human</h2>
            <p className="text-zinc-400 text-sm mb-5 max-w-md mx-auto">
              These tools find the issues. We fix them. Free 30-minute consultation — no obligation, no sales pitch.
            </p>
            <a href="/schedule" className="inline-block bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-3 rounded-full transition-colors text-sm">
              Book a Free Call
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
