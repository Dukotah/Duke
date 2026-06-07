import Link from "next/link";
import { Zap, Lock, Search, Link2, Smartphone } from "lucide-react";

const auditFeatures = [
  { icon: Zap, label: "Speed" },
  { icon: Lock, label: "SSL" },
  { icon: Search, label: "SEO" },
  { icon: Link2, label: "Broken Links" },
  { icon: Smartphone, label: "Mobile" },
];

export default function ToolsTeaser() {
  return (
    <section className="py-24 px-6 bg-[#18181B]">
      <div className="max-w-3xl mx-auto text-center">
        <span className="inline-block bg-[#F97316]/10 text-[#F97316] text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 border border-[#F97316]/20">
          Free Tool
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Get a Free{" "}
          <span className="text-[#F97316]">Website Health Check</span>
        </h2>
        <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: "#A1A1AA" }}>
          Enter your URL once and instantly see your speed score, SSL status, SEO health,
          broken links, and mobile readiness — all in one report.
        </p>

        <div className="flex flex-wrap justify-center gap-3 mb-10 text-xs" style={{ color: "#A1A1AA" }}>
          {auditFeatures.map(({ icon: Icon, label }) => (
            <span key={label} className="inline-flex items-center gap-1.5 bg-[#18181B] border border-[#3F3F46] px-3 py-1.5 rounded-full">
              <Icon size={13} className="text-[#F97316]" />
              {label}
            </span>
          ))}
        </div>

        <Link
          href="/tools"
          className="inline-block bg-[#F97316] hover:bg-[#ea6c0a] text-white font-bold px-10 py-4 rounded-full transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-2 focus-visible:ring-offset-[#18181B]"
        >
          Run Free Audit →
        </Link>

        <p className="text-xs mt-4" style={{ color: "#52525B" }}>No signup required · Takes about 30 seconds</p>
      </div>
    </section>
  );
}
