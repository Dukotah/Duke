import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ToolDeck from "@/components/tools/ToolDeck";

export default function PasswordPage() {
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
              Password Strength & Breach Checker
            </h1>
            <p className="text-pretty mx-auto mt-5 max-w-xl text-lg text-zinc-400">
              Test how strong your password is and check it against known data breaches — all in your browser. Your password never leaves your device.
            </p>
          </div>
        </section>
        <section className="px-6 pb-24">
          <div className="mx-auto max-w-3xl">
            <ToolDeck initial="password" />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
