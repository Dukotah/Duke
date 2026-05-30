import Link from "next/link";

const TOOLS = [
  {
    icon: "⚡",
    name: "Speed Audit",
    desc: "Google PageSpeed score + Core Web Vitals breakdown",
  },
  {
    icon: "🔒",
    name: "SSL Check",
    desc: "Verify your certificate is valid and not expiring soon",
  },
  {
    icon: "🔍",
    name: "SEO Inspector",
    desc: "Scan titles, meta tags, headings, and Open Graph data",
  },
  {
    icon: "🔗",
    name: "Broken Links",
    desc: "Find 404s and redirects before your visitors do",
  },
  {
    icon: "📱",
    name: "Mobile Check",
    desc: "Accessibility, tap targets, and mobile-readiness scores",
  },
];

export default function ToolsTeaser() {
  return (
    <section className="py-24 px-6 bg-[#18181B]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block bg-orange-500/10 text-orange-400 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 border border-orange-500/20">
            Free Tools
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Free Tools to{" "}
            <span className="text-orange-400">Audit Your Website</span>
          </h2>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            See exactly what&apos;s holding your site back. Run any of our five free checks — no email, no signup, instant results.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          {TOOLS.map((tool) => (
            <div
              key={tool.name}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-center hover:border-zinc-600 transition-colors"
            >
              <div className="text-3xl mb-3">{tool.icon}</div>
              <h3 className="text-white font-bold text-sm mb-1">{tool.name}</h3>
              <p className="text-zinc-500 text-xs">{tool.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/tools"
            className="inline-block bg-orange-500 hover:bg-orange-400 text-white font-bold px-7 py-3.5 rounded-full transition-colors text-sm"
          >
            Try the Free Tools →
          </Link>
        </div>
      </div>
    </section>
  );
}
