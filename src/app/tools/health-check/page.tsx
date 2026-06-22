import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ToolDeck from "@/components/tools/ToolDeck";

// Metadata stays in ./layout.tsx (keeps the website-speed-test keyword page).
// Health-check is the speed view of the consolidated audit, so deep-link the
// Website Audit tab.
export default function HealthCheckPage() {
  return (
    <div className="theme-dark min-h-screen bg-ink-0 text-white">
      <Nav />
      <main className="pt-16">
        <section className="relative overflow-hidden px-6 pt-20 pb-10 text-center">
          <div className="mx-auto max-w-2xl">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-copper-dim bg-copper/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-copper-bright">
              Free tool
            </span>
            <h1 className="text-balance text-4xl font-black tracking-tight sm:text-5xl">
              Instant Website Health Check
            </h1>
            <p className="text-pretty mx-auto mt-5 max-w-xl text-lg text-zinc-400">
              Live Google Lighthouse speed scores, Core Web Vitals, and a full health
              read for any website — free, no signup.
            </p>
          </div>
        </section>
        <section className="px-6 pb-24">
          <div className="mx-auto max-w-3xl">
            <ToolDeck initial="audit" />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
