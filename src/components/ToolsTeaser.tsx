import Link from "next/link";
import {
  Zap, Lock, Search, Link2, Smartphone,
  Activity, Calculator, PhoneMissed, ArrowRight,
} from "lucide-react";

const auditFeatures = [
  { icon: Zap, label: "Speed" },
  { icon: Lock, label: "SSL" },
  { icon: Search, label: "SEO" },
  { icon: Link2, label: "Broken Links" },
  { icon: Smartphone, label: "Mobile" },
];

// Secondary free tools — top-of-funnel lead magnets for visitors who aren't
// ready to book yet. Each is a real, working tool route.
const moreTools = [
  {
    href: "/it-health-check",
    icon: Activity,
    title: "IT Health Check",
    desc: "A 2-minute quiz that flags the security and IT risks hiding in your business.",
  },
  {
    href: "/tools/website-cost-estimator",
    icon: Calculator,
    title: "Website Cost Estimator",
    desc: "See what a site like yours should actually cost — no sales call required.",
  },
  {
    href: "/tools/missed-call-calculator",
    icon: PhoneMissed,
    title: "Missed-Call Calculator",
    desc: "Estimate the revenue you lose every month from calls that go unanswered.",
  },
];

const H = { fontFamily: "var(--font-heading)" };
const BODY = { fontFamily: "var(--font-body)" };

export default function ToolsTeaser() {
  return (
    <section className="py-24 px-6 bg-[#18181B]">
      <div className="max-w-5xl mx-auto">
        {/* Section heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block bg-[#F97316]/10 text-[#F97316] text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 border border-[#F97316]/20" style={H}>
            Free Tools · No Signup
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4" style={H}>
            See exactly where you stand
          </h2>
          <p className="text-lg" style={{ color: "#A1A1AA", ...BODY }}>
            Free, instant tools — no email wall, no sales call. Run one and find out
            what&apos;s costing you customers.
          </p>
        </div>

        {/* Primary tool — Website Audit */}
        <div className="rounded-2xl border border-[#3F3F46] bg-[#1C1C1F] p-8 sm:p-10 text-center mb-6">
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3" style={H}>
            Free{" "}
            <span className="text-[#F97316]">Website Health Check</span>
          </h3>
          <p className="text-base mb-6 max-w-xl mx-auto" style={{ color: "#A1A1AA", ...BODY }}>
            Enter your URL once and instantly see your speed score, SSL status, SEO
            health, broken links, and mobile readiness — all in one report.
          </p>
          <div className="flex flex-wrap justify-center gap-2.5 mb-8 text-xs" style={{ color: "#A1A1AA" }}>
            {auditFeatures.map(({ icon: Icon, label }) => (
              <span key={label} className="inline-flex items-center gap-1.5 bg-[#18181B] border border-[#3F3F46] px-3 py-1.5 rounded-full" style={H}>
                <Icon size={13} className="text-[#F97316]" />
                {label}
              </span>
            ))}
          </div>
          <Link
            href="/audit"
            className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#ea6c0a] text-white font-bold px-10 py-4 rounded-lg transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-2 focus-visible:ring-offset-[#18181B]"
            style={H}
          >
            Run free audit <ArrowRight size={15} />
          </Link>
          <p className="text-xs mt-4" style={{ color: "#52525B", ...BODY }}>Takes about 30 seconds</p>
        </div>

        {/* Secondary tools grid */}
        <div className="grid sm:grid-cols-3 gap-4">
          {moreTools.map(({ href, icon: Icon, title, desc }) => (
            <Link
              key={href}
              href={href}
              className="group flex flex-col rounded-2xl border border-[#3F3F46] bg-[#1C1C1F] p-6 transition-all hover:border-[#F97316]/40 hover:bg-[#F97316]/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316]/40"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#F97316]/10 border border-[#F97316]/20 mb-4">
                <Icon size={18} className="text-[#F97316]" />
              </span>
              <h4 className="text-base font-bold text-white mb-1.5 flex items-center gap-1.5" style={H}>
                {title}
                <ArrowRight size={14} className="text-white/20 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100 group-hover:text-[#F97316]" />
              </h4>
              <p className="text-sm leading-relaxed" style={{ color: "#A1A1AA", ...BODY }}>
                {desc}
              </p>
            </Link>
          ))}
        </div>

        {/* View all */}
        <div className="text-center mt-8">
          <Link
            href="/tools"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/60 hover:text-[#F97316] transition-colors"
            style={H}
          >
            View all free tools <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
