import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ToolDeck from "@/components/tools/ToolDeck";

export default function BusinessAnalysisPage() {
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
              Free online business analysis
            </h1>
            <p className="text-pretty mx-auto mt-5 max-w-xl text-lg text-zinc-400">
              See how your business shows up online — website, Google presence, social, and branding scored in one scan, with the single biggest improvement to make next.
            </p>
          </div>
        </section>
        <section className="px-6 pb-24">
          <div className="mx-auto max-w-3xl">
            <ToolDeck initial="business-analysis" />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
