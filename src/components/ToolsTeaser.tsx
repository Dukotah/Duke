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
        <span className="inline-block bg-orange-500/10 text-orange-400 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 border border-orange-500/20">
          Free Tool
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
          Get a Free{" "}
          <span className="text-orange-400">Website Health Check</span>
        </h2>
        <p className="text-zinc-400 text-lg mb-8 max-w-xl mx-auto">
          Enter your URL once and instantly see your speed score, SSL status, SEO health,
          broken links, and mobile readiness — all in one report.
        </p>

        <div className="flex flex-wrap justify-center gap-3 mb-10 text-xs text-zinc-400">
          {auditFeatures.map(({ icon: Icon, label }) => (
            <span key={label} className="inline-flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-full">
              <Icon size={13} className="text-orange-400" />
              {label}
            </span>
          ))}
        </div>

        <Link
          href="/tools"
          className="inline-block bg-orange-500 hover:bg-orange-400 text-white font-bold px-10 py-4 rounded-full transition-colors text-sm"
        >
          Run Free Audit →
        </Link>

        <p className="text-zinc-600 text-xs mt-4">No signup required · Takes about 30 seconds</p>
      </div>
    </section>
  );
}
