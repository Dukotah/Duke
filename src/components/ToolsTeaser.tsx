import Link from "next/link";

const CHECKS = [
  "⚡ Speed", "🔒 SSL", "🛡️ Security Headers", "🔍 SEO",
  "🗺️ Crawlability", "📡 DNS & Email", "🔗 Links", "📱 Mobile", "🧱 Tech Stack",
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
          Enter your URL and get a 9-point audit — speed, security headers, SSL, SEO,
          DNS, broken links, mobile readiness, tech stack, and crawlability. Free, no signup.
        </p>

        <div className="flex flex-wrap justify-center gap-2 mb-10 text-xs text-zinc-500">
          {CHECKS.map(item => (
            <span key={item} className="bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-full">
              {item}
            </span>
          ))}
        </div>

        <Link
          href="/tools"
          className="inline-block bg-orange-500 hover:bg-orange-400 text-white font-bold px-10 py-4 rounded-full transition-colors text-sm"
        >
          Run Free Audit →
        </Link>

        <p className="text-zinc-600 text-xs mt-4">No signup required · Results in under 60 seconds</p>
      </div>
    </section>
  );
}
