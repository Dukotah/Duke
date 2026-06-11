import { UserCheck, FileText, ShieldCheck, Clock } from "lucide-react";

// Honest credibility cues — every claim here is verifiably true of how Copper Bay
// Tech operates. This is NOT social proof (no third-party quotes); it fills the
// trust gap with concrete guarantees until real client reviews are collected.
// See Testimonials.tsx (gated on real, approved quotes) for actual social proof.
const trust = [
  {
    icon: UserCheck,
    title: "Founder-led",
    sub: "Work directly with Duke — not a call center or a rotating account rep.",
  },
  {
    icon: FileText,
    title: "Flat, published pricing",
    sub: "Real numbers on the site. Fixed scope, no hourly billing surprises.",
  },
  {
    icon: ShieldCheck,
    title: "You own everything",
    sub: "No lock-in contracts. Your site, code, and accounts stay yours.",
  },
  {
    icon: Clock,
    title: "Fast, human support",
    sub: "A real person replies within one business day — every time.",
  },
];

const H = { fontFamily: "var(--font-heading)" };
const BODY = { fontFamily: "var(--font-body)" };

export default function SocialProof() {
  return (
    <section className="bg-[#18181B] border-y border-white/[0.06] py-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8">
          {trust.map(({ icon: Icon, title, sub }) => (
            <div
              key={title}
              className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left gap-3"
            >
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F97316]/10 border border-[#F97316]/20">
                <Icon size={17} className="text-[#F97316]" />
              </span>
              <div>
                <p className="text-sm font-bold text-white" style={H}>
                  {title}
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-white/50" style={BODY}>
                  {sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
