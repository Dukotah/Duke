import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ITQuiz from "@/components/ITQuiz";

export const metadata: Metadata = {
  title: "Free IT Security Assessment | Copper Bay Tech",
  description:
    "Take our free 6-question IT security self-assessment and find out how exposed your Sonoma County business really is. Get a personalized action plan in under 2 minutes.",
  openGraph: {
    title: "Free IT Security Assessment — Copper Bay Tech",
    description: "6 questions. 2 minutes. Find out where your business actually stands.",
    url: "https://copperbaytech.com/assessment",
  },
};

export default function AssessmentPage() {
  return (
    <div className="min-h-screen bg-[#18181B]">
      <Nav />

      <section className="pt-32 pb-4 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <span className="inline-block bg-orange-500/10 text-orange-400 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 border border-orange-500/20">
            Free — No signup required
          </span>
          <h1
            className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            How exposed is your{" "}
            <span className="text-orange-400">business?</span>
          </h1>
          <p
            className="text-zinc-400 text-lg max-w-xl mx-auto"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Answer 6 quick questions about your current IT setup. We&apos;ll score your
            risk level and send you a personalized action plan — for free.
          </p>
        </div>
      </section>

      {/* ITQuiz renders its own section padding */}
      <ITQuiz />

      {/* Trust line */}
      <section className="pb-16 px-6">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-zinc-600 text-xs" style={{ fontFamily: "var(--font-body)" }}>
            Your answers are never sold or shared. We use them only to send you relevant follow-up from Duke at Copper Bay Tech.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
