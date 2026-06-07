"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";

type Question = {
  id: string;
  q: string;
  options: { value: string; label: string }[];
};

const questions: Question[] = [
  {
    id: "focus",
    q: "What's the #1 thing holding your business back right now?",
    options: [
      { value: "website", label: "My website is outdated, slow, or I don't have one" },
      { value: "it-support", label: "Tech problems and downtime keep slowing us down" },
      { value: "cybersecurity", label: "I'm worried about security, data, or compliance" },
      { value: "automation", label: "I waste hours on manual, repetitive tasks" },
    ],
  },
  {
    id: "visibility",
    q: "How are new customers finding you today?",
    options: [
      { value: "referrals", label: "Mostly word of mouth and referrals" },
      { value: "okay", label: "We show up okay on Google" },
      { value: "struggle", label: "Honestly, they struggle to find us online" },
    ],
  },
  {
    id: "support",
    q: "When something tech-related breaks, who handles it?",
    options: [
      { value: "me", label: "Me — I figure it out as I go" },
      { value: "friend", label: "A friend or part-time helper" },
      { value: "slow", label: "We have someone, but they're slow or pricey" },
      { value: "nobody", label: "Nobody — we just live with it" },
    ],
  },
  {
    id: "goal",
    q: "If we fixed ONE thing in the next 30 days, what would matter most?",
    options: [
      { value: "leads", label: "More leads coming from my website" },
      { value: "uptime", label: "Less downtime and fewer headaches" },
      { value: "security", label: "Peace of mind that we're secure" },
      { value: "time", label: "Getting hours back from busywork" },
    ],
  },
];

type Plan = {
  headline: string;
  steps: { title: string; detail: string }[];
  service: string;
};

const basePlans: Record<string, Plan> = {
  website: {
    headline: "Turn your website into your hardest-working salesperson",
    service: "website",
    steps: [
      { title: "Rebuild on a fast, mobile-first foundation", detail: "A modern, custom-coded site that loads in under two seconds and looks sharp on every phone." },
      { title: "Make it easy to get found and get in touch", detail: "Clear calls-to-action and local SEO basics that turn visitors into real inquiries." },
      { title: "Track what's actually working", detail: "Simple analytics so you can see exactly where your leads come from." },
    ],
  },
  "it-support": {
    headline: "Stop fighting your tech and get back to running your business",
    service: "it-support",
    steps: [
      { title: "Stabilize the essentials", detail: "Audit your network, devices, and backups so the daily breakages stop." },
      { title: "Put real support in place", detail: "A responsive go-to person for when things go wrong — no more guessing." },
      { title: "Prevent the next fire", detail: "Proactive monitoring and updates so problems get caught before they cost you." },
    ],
  },
  cybersecurity: {
    headline: "Lock down your business before a problem finds you",
    service: "cybersecurity",
    steps: [
      { title: "Run a real security assessment", detail: "Find the gaps in passwords, access, and backups that put you at risk." },
      { title: "Close the high-risk holes first", detail: "Prioritized fixes that cut the most exposure for the least effort." },
      { title: "Build an ongoing safety net", detail: "Backups, monitoring, and a clear plan for when something does go wrong." },
    ],
  },
  automation: {
    headline: "Win back the hours you're losing to busywork",
    service: "automation",
    steps: [
      { title: "Map your repetitive tasks", detail: "Pinpoint the manual work that's quietly eating your week." },
      { title: "Automate the biggest time-sinks", detail: "Custom tools and integrations that do the busywork for you." },
      { title: "Connect your systems", detail: "Stop re-entering the same data between the apps you already use." },
    ],
  },
};

function personalNote(answers: Record<string, string>): string {
  if (answers.support === "me" || answers.support === "nobody") {
    return "Right now you're effectively the IT department — this plan is built to take that off your plate.";
  }
  if (answers.visibility === "struggle") {
    return "Since customers struggle to find you online, getting discoverable is baked into the first move.";
  }
  if (answers.goal === "leads") {
    return "Your priority is more leads, so every step here is aimed at turning attention into inquiries.";
  }
  return "Each step is ordered so the highest-impact work happens first.";
}

type Lead = { name: string; business: string; email: string; phone: string };

export default function GamePlan() {
  const reduce = useReducedMotion();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [phase, setPhase] = useState<"questions" | "plan" | "form" | "done">("questions");
  const [lead, setLead] = useState<Lead>({ name: "", business: "", email: "", phone: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  const question = questions[current];
  const selected = answers[question?.id];
  const plan = basePlans[answers.focus] || basePlans.website;
  const progress = (current / questions.length) * 100;

  const handleNext = () => {
    if (!selected) return;
    if (current + 1 >= questions.length) {
      setPhase("plan");
    } else {
      setCurrent(current + 1);
    }
  };

  const handleReset = () => {
    setCurrent(0);
    setAnswers({});
    setLead({ name: "", business: "", email: "", phone: "" });
    setStatus("idle");
    setPhase("questions");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    const message =
      "Free Game Plan request.\n" +
      questions
        .map((q) => {
          const val = answers[q.id];
          const label = q.options.find((o) => o.value === val)?.label || "—";
          return `${q.q}\n  → ${label}`;
        })
        .join("\n");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...lead, service: plan.service, message }),
      });
      if (res.ok) {
        setPhase("done");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white text-sm focus:outline-none focus:border-[#F97316] transition placeholder-white/30";

  return (
    <section id="game-plan" className="py-24 bg-[#18181B]">
      <div className="max-w-2xl mx-auto px-6">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={reduce ? { duration: 0 } : { duration: 0.6 }}
          className="text-center mb-12"
        >
          <p
            className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Free 30-Day Game Plan
          </p>
          <h2
            className="text-4xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Not sure where to start? Let&apos;s build your plan.
          </h2>
          <p className="text-white/60 text-lg" style={{ fontFamily: "var(--font-body)" }}>
            Answer 4 quick questions and get a tailored action plan on the spot — then claim
            the full version on a free call. No pressure.
          </p>
        </motion.div>

        <div className="bg-[#1F1F23] rounded-2xl border border-white/10 overflow-hidden">
          {phase === "questions" && (
            <>
              <div className="h-1 bg-white/10">
                <motion.div
                  className="h-full bg-[#F97316]"
                  initial={reduce ? false : { width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={reduce ? { duration: 0 } : { duration: 0.3 }}
                />
              </div>
              <div className="p-8">
                <span
                  className="text-xs font-semibold uppercase tracking-widest text-white/40"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Question {current + 1} of {questions.length}
                </span>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current}
                    initial={reduce ? false : { opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={reduce ? {} : { opacity: 0, x: -20 }}
                    transition={reduce ? { duration: 0 } : { duration: 0.25 }}
                  >
                    <h3
                      className="text-xl font-bold text-white mt-3 mb-6"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {question.q}
                    </h3>
                    <div className="space-y-3">
                      {question.options.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setAnswers({ ...answers, [question.id]: opt.value })}
                          className={`w-full text-left px-5 py-4 rounded-xl border text-sm transition-all ${
                            selected === opt.value
                              ? "border-[#F97316] bg-[#F97316]/10 text-white"
                              : "border-white/10 bg-white/5 text-white/70 hover:border-white/30"
                          }`}
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
                <div className="mt-8 flex justify-end">
                  <button
                    onClick={handleNext}
                    disabled={!selected}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-semibold text-white bg-[#F97316] hover:bg-[#ea6c0a] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {current + 1 === questions.length ? "Build My Game Plan" : "Next"}
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </>
          )}

          {phase === "plan" && (
            <motion.div
              initial={reduce ? false : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={reduce ? { duration: 0 } : { duration: 0.4 }}
              className="p-8"
            >
              <p
                className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-2"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Your 30-Day Game Plan
              </p>
              <h3
                className="text-2xl font-bold text-white mb-3"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {plan.headline}
              </h3>
              <p className="text-white/60 text-sm mb-8" style={{ fontFamily: "var(--font-body)" }}>
                {personalNote(answers)}
              </p>
              <div className="space-y-4 mb-8">
                {plan.steps.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold text-[#18181B]"
                      style={{ backgroundColor: "#F97316", fontFamily: "var(--font-heading)" }}
                    >
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm mb-1" style={{ fontFamily: "var(--font-heading)" }}>
                        {step.title}
                      </p>
                      <p className="text-white/55 text-sm leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                        {step.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setPhase("form")}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md text-sm font-semibold text-[#18181B] bg-[#F97316] hover:bg-[#ea6c0a] transition-colors"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Claim My Full Game Plan <ArrowRight size={15} />
                </button>
                <button
                  onClick={handleReset}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-md text-sm font-semibold text-white/60 border border-white/20 hover:border-white/40 hover:text-white transition-colors"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Start Over
                </button>
              </div>
            </motion.div>
          )}

          {phase === "form" && (
            <motion.div
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={reduce ? { duration: 0 } : undefined}
              className="p-8"
            >
              <h3
                className="text-2xl font-bold text-white mb-2"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Where should we send it?
              </h3>
              <p className="text-white/55 text-sm mb-6" style={{ fontFamily: "var(--font-body)" }}>
                Duke will personally walk you through your full game plan on a free 15-minute
                call — and send a written version to keep.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    required
                    value={lead.name}
                    onChange={(e) => setLead({ ...lead, name: e.target.value })}
                    placeholder="Your name"
                    className={inputClass}
                    style={{ fontFamily: "var(--font-body)" }}
                  />
                  <input
                    required
                    value={lead.business}
                    onChange={(e) => setLead({ ...lead, business: e.target.value })}
                    placeholder="Business name"
                    className={inputClass}
                    style={{ fontFamily: "var(--font-body)" }}
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    required
                    type="email"
                    value={lead.email}
                    onChange={(e) => setLead({ ...lead, email: e.target.value })}
                    placeholder="Email"
                    className={inputClass}
                    style={{ fontFamily: "var(--font-body)" }}
                  />
                  <input
                    type="tel"
                    value={lead.phone}
                    onChange={(e) => setLead({ ...lead, phone: e.target.value })}
                    placeholder="Phone (optional)"
                    className={inputClass}
                    style={{ fontFamily: "var(--font-body)" }}
                  />
                </div>
                {status === "error" && (
                  <p className="text-red-400 text-sm" style={{ fontFamily: "var(--font-body)" }}>
                    Something went wrong. Email{" "}
                    <a href="mailto:duke@copperbaytech.com" className="underline">duke@copperbaytech.com</a>{" "}
                    or call{" "}
                    <a href="tel:+17072396725" className="underline">(707) 239-6725</a>.
                  </p>
                )}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-3.5 rounded-md text-sm font-semibold text-[#18181B] bg-[#F97316] hover:bg-[#ea6c0a] transition-colors disabled:opacity-60"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {status === "loading" ? "Sending..." : "Send Me My Game Plan"}
                </button>
              </form>
            </motion.div>
          )}

          {phase === "done" && (
            <motion.div
              initial={reduce ? false : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={reduce ? { duration: 0 } : { duration: 0.4 }}
              className="p-8 text-center"
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: "rgba(249,115,22,0.15)" }}
              >
                <span className="text-2xl">✓</span>
              </div>
              <h3
                className="text-2xl font-bold text-white mb-3"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Your game plan is on its way, {lead.name.split(" ")[0]}.
              </h3>
              <p className="text-white/60 text-sm mb-8 max-w-md mx-auto" style={{ fontFamily: "var(--font-body)" }}>
                Duke will reach out within one business day to walk you through it. Want to talk
                sooner? Call or text anytime.
              </p>
              <a
                href="tel:+17072396725"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md text-sm font-semibold text-[#18181B] bg-[#F97316] hover:bg-[#ea6c0a] transition-colors"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                <Phone size={15} /> (707) 239-6725
              </a>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
