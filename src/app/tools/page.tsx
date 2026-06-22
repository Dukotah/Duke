import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ToolDeck from "@/components/tools/ToolDeck";

// Metadata lives in ./layout.tsx (this page renders the client deck).
export default function ToolsPage() {
  return (
    <div className="theme-dark min-h-screen bg-ink-0 text-white">
      <Nav />
      <main className="pt-16">
        {/* Hero */}
        <section className="relative overflow-hidden px-6 pt-20 pb-10 text-center">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(60% 50% at 50% 0%, rgba(221,170,117,0.12) 0%, rgba(221,170,117,0) 70%)",
            }}
          />
          <div className="mx-auto max-w-2xl">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-copper-dim bg-copper/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-copper-bright">
              Free tools
            </span>
            <h1 className="text-balance text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl">
              Every tool,{" "}
              <span className="bg-gradient-to-r from-copper to-copper-bright bg-clip-text text-transparent">
                one place
              </span>
              .
            </h1>
            <p className="text-pretty mx-auto mt-5 max-w-xl text-lg leading-relaxed text-zinc-400">
              Audit a site, compare to a competitor, size up missed-call revenue, check
              your security posture, and more — no signup, no catch.
            </p>
          </div>
        </section>

        {/* Deck */}
        <section className="px-6 pb-24">
          <div className="mx-auto max-w-3xl">
            <ToolDeck />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
