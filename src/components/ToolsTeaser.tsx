import Link from "next/link";
import { ArrowRight, Zap, Lock, Search, Link2, Smartphone } from "lucide-react";

const checks = [
  { icon: Zap, label: "Speed" },
  { icon: Lock, label: "SSL" },
  { icon: Search, label: "SEO" },
  { icon: Link2, label: "Broken Links" },
  { icon: Smartphone, label: "Mobile" },
];

export default function ToolsTeaser() {
  return (
    <section className="py-24 px-6 bg-[var(--linen)]">
      <div className="max-w-5xl mx-auto">
        <div className="grain relative overflow-hidden rounded-3xl bg-[var(--ink-900)] ring-copper px-6 py-16 sm:px-12 text-center">
          {/* Aurora glow */}
          <div
            className="aurora animate-drift"
            style={{
              top: "-30%",
              left: "10%",
              width: "50%",
              height: "120%",
              background: "radial-gradient(circle, rgba(232,133,58,0.22), transparent 65%)",
            }}
          />
          <div
            className="aurora animate-float"
            style={{
              bottom: "-40%",
              right: "5%",
              width: "45%",
              height: "120%",
              background: "radial-gradient(circle, rgba(245,166,35,0.15), transparent 65%)",
            }}
          />

          <div className="relative z-10">
            <span className="eyebrow inline-block glass-dark text-[var(--copper-300)] px-4 py-1.5 rounded-full mb-6">
              Free Tool · 30 seconds
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4 leading-tight">
              Get a free{" "}
              <span className="text-gradient-copper">Website Health Check</span>
            </h2>
            <p className="text-white/60 text-lg mb-9 max-w-xl mx-auto" style={{ fontFamily: "var(--font-body)" }}>
              Enter your URL once and instantly see your speed score, SSL status, SEO
              health, broken links, and mobile readiness — all in one report.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {checks.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-2 glass-dark text-white/75 text-xs font-medium px-4 py-2 rounded-full"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  <Icon size={14} className="text-[var(--copper-400)]" />
                  {label}
                </span>
              ))}
            </div>

            <Link
              href="/tools"
              className="btn-copper group inline-flex items-center gap-2 text-white font-semibold px-9 py-4 rounded-full text-sm"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Run Free Audit
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <p className="text-white/35 text-xs mt-5" style={{ fontFamily: "var(--font-body)" }}>
              No signup required · Instant results
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
