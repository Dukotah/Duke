import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowRight, Globe, ShieldCheck, Cloud } from "lucide-react";

const cases = [
  {
    slug: "petaluma-home-staging",
    tag: "Web Development",
    client: "Petaluma Home Staging Co.",
    title: "From invisible to booked out — a full website rebuild",
    icon: Globe,
    metrics: [
      { label: "Load time", value: "8s → 1.4s" },
      { label: "New inquiries in 6 weeks", value: "8" },
      { label: "Days to launch", value: "11" },
    ],
    summary: "Maria's staging business was losing leads daily because of an 8-second load time and a broken contact form. We rebuilt everything from scratch in 11 days.",
  },
  {
    slug: "santa-rosa-insurance",
    tag: "Cybersecurity",
    client: "Santa Rosa Insurance Group",
    title: "Security audit finds two critical vulnerabilities — fixed same day",
    icon: ShieldCheck,
    metrics: [
      { label: "Vulnerabilities found", value: "2 critical" },
      { label: "Time to fix", value: "Same day" },
      { label: "Firmware lag", value: "4 years behind" },
    ],
    summary: "James had no idea how exposed his firm was. We ran a full network security audit, found two open ports and outdated firmware, and closed everything the same day.",
  },
  {
    slug: "sebastopol-family-dental",
    tag: "IT Support & Cloud",
    client: "Sebastopol Family Dental",
    title: "Full office cloud migration — zero downtime, staff up in a day",
    icon: Cloud,
    metrics: [
      { label: "Staff trained", value: "12 people" },
      { label: "Downtime", value: "Zero" },
      { label: "Migration window", value: "1 weekend" },
    ],
    summary: "Sandra's office of 12 was running on an aging local server. We migrated everything to Google Workspace over a single weekend — no disruption to patient care.",
  },
];

const tagColors: Record<string, string> = {
  "Web Development": "text-blue-400 bg-blue-500/10",
  "Cybersecurity": "text-red-400 bg-red-500/10",
  "IT Support & Cloud": "text-purple-400 bg-purple-500/10",
};

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen bg-[#18181B] text-white">
      <Nav />

      <section className="pt-32 pb-16 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <span className="inline-block bg-orange-500/10 text-orange-400 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 border border-orange-500/20">
            Client Results
          </span>
          <h1 className="text-4xl sm:text-5xl font-black mb-4 leading-tight">
            Real Work.{" "}
            <span className="text-orange-400">Real Results.</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Detailed case studies from Sonoma County businesses — what the problem was, exactly what we did, and the numbers that came out the other side.
          </p>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="max-w-4xl mx-auto space-y-6">
          {cases.map((c) => {
            const Icon = c.icon;
            return (
              <Link key={c.slug} href={`/case-studies/${c.slug}`} className="group block bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-600 transition-colors">
                <div className="p-6 sm:p-8 grid sm:grid-cols-3 gap-6">
                  <div className="sm:col-span-2 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                        <Icon size={18} className="text-orange-400" />
                      </div>
                      <div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${tagColors[c.tag] ?? "text-zinc-400 bg-zinc-800"}`}>
                          {c.tag}
                        </span>
                        <p className="text-zinc-500 text-xs mt-0.5">{c.client}</p>
                      </div>
                    </div>
                    <h2 className="text-white text-xl font-black leading-snug group-hover:text-orange-400 transition-colors">{c.title}</h2>
                    <p className="text-zinc-400 text-sm leading-relaxed">{c.summary}</p>
                    <span className="inline-flex items-center gap-1.5 text-orange-400 text-sm font-semibold group-hover:gap-2.5 transition-all">
                      Read full case study <ArrowRight size={14} />
                    </span>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-1 gap-3">
                    {c.metrics.map(m => (
                      <div key={m.label} className="bg-[#18181B] rounded-xl p-4">
                        <p className="text-orange-400 text-xl font-black">{m.value}</p>
                        <p className="text-zinc-500 text-[11px] mt-1">{m.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            );
          })}

          <div className="mt-8 rounded-2xl p-8 text-center border border-orange-500/30" style={{ background: "linear-gradient(135deg, #1C1917 0%, #18181B 100%)" }}>
            <h2 className="text-white text-2xl font-black mb-3">Become the next case study</h2>
            <p className="text-zinc-400 text-sm mb-6 max-w-md mx-auto">
              Free 30-minute consultation. We&apos;ll dig into your specific situation and tell you straight what we can do.
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
