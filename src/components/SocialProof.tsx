import {
  UserCheck,
  FileText,
  ShieldCheck,
  Clock,
  MapPin,
  RefreshCw,
} from "lucide-react";
import { LogoMarquee, RevealOnScroll } from "@/components/motion";

// Honest credibility cues — every claim here is verifiably true of how Copper
// Bay Tech operates. This is NOT social proof (no third-party quotes, and we
// have NO real client logos to show, so we never fabricate any). It fills the
// trust gap with concrete, true guarantees until real client reviews exist.
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

// Short, true operating promises repeated as a quiet marquee strip. These are
// the same honest guarantees, condensed — no fake brand names or logos.
const promises = [
  { icon: MapPin, label: "Sonoma County, local" },
  { icon: UserCheck, label: "Founder-led" },
  { icon: FileText, label: "Flat, published pricing" },
  { icon: ShieldCheck, label: "No lock-in — you own it" },
  { icon: RefreshCw, label: "Looked after for life" },
  { icon: Clock, label: "Reply in one business day" },
];

const H = { fontFamily: "var(--font-heading)" };
const BODY = { fontFamily: "var(--font-body)" };

export default function SocialProof() {
  return (
    <section className="surface-1 border-y border-hairline py-12">
      <div className="mx-auto max-w-6xl px-6">
        {/* Honest "proof" marquee — true operating promises, not client logos.
            Scrolls on desktop (pause-on-hover), static wrapping row under
            reduced motion. transform-only → GPU, CLS 0. */}
        <RevealOnScroll as="div" direction="up" distance={10} amount={0.3}>
          <LogoMarquee duration={45} gap="2.75rem" className="mb-12">
            {promises.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap text-sm font-semibold tracking-tight text-warm-2"
                style={H}
              >
                <Icon size={15} className="text-copper-bright" aria-hidden />
                {label}
              </span>
            ))}
          </LogoMarquee>
        </RevealOnScroll>

        {/* The four headline guarantees — expanded, dark + rationed copper. */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4">
          {trust.map(({ icon: Icon, title, sub }, i) => (
            <RevealOnScroll
              key={title}
              as="div"
              direction="up"
              delay={i * 0.06}
              distance={12}
              amount={0.4}
              className="flex flex-col items-center gap-3 text-center sm:flex-row sm:items-start sm:text-left"
            >
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-copper-dim bg-copper-dim">
                <Icon size={17} className="text-copper-bright" aria-hidden />
              </span>
              <div>
                <p className="text-sm font-bold text-warm" style={H}>
                  {title}
                </p>
                <p
                  className="mt-0.5 text-xs leading-relaxed text-warm-3"
                  style={BODY}
                >
                  {sub}
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
