"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, AlertTriangle, CheckCircle, ShieldAlert, Mail } from "lucide-react";
import { trackQuizComplete } from "@/lib/analytics";

const questions = [
  {
    id: "passwords",
    q: "How does your team manage passwords?",
    options: [
      { label: "We share passwords or use simple ones like the company name", risk: 3 },
      { label: "Everyone uses their own passwords but they're not managed centrally", risk: 2 },
      { label: "We use a password manager (LastPass, 1Password, Bitwarden, etc.)", risk: 0 },
    ],
  },
  {
    id: "router",
    q: "When was your office router/firewall last reviewed?",
    options: [
      { label: "Never, or we don't know who set it up", risk: 3 },
      { label: "More than 2 years ago", risk: 2 },
      { label: "Within the last year — firmware is up to date", risk: 0 },
    ],
  },
  {
    id: "backups",
    q: "How are your critical business files backed up?",
    options: [
      { label: "They're on one computer or a local drive — no offsite backup", risk: 3 },
      { label: "We use cloud storage (Google Drive, Dropbox) but haven't tested restoring", risk: 1 },
      { label: "Automated backups to the cloud, tested within the last 6 months", risk: 0 },
    ],
  },
  {
    id: "website",
    q: "What best describes your current website?",
    options: [
      { label: "We don't have one, or it looks outdated / broken on mobile", risk: 3 },
      { label: "It exists but loads slowly or rarely gets inquiries", risk: 2 },
      { label: "Fast, mobile-friendly, and actively generating leads", risk: 0 },
    ],
  },
  {
    id: "updates",
    q: "How do you handle software and system updates?",
    options: [
      { label: "We click 'Remind me later' or ignore them", risk: 3 },
      { label: "We update when we remember, maybe once a month", risk: 1 },
      { label: "Updates are applied promptly or automated", risk: 0 },
    ],
  },
  {
    id: "offboarding",
    q: "When an employee leaves, what happens to their accounts?",
    options: [
      { label: "We're not sure — they might still have access", risk: 3 },
      { label: "We try to disable their email but don't always catch everything", risk: 2 },
      { label: "We have a documented offboarding checklist and revoke access immediately", risk: 0 },
    ],
  },
];

type Result = {
  label: string;
  description: string;
  color: string;
  icon: typeof AlertTriangle;
  cta: string;
};

function getResult(score: number): Result {
  if (score >= 12) {
    return {
      label: "High Risk",
      description: "Your business has several significant vulnerabilities that could result in data loss, a breach, or extended downtime. The good news: most of these are fixable quickly.",
      color: "#DC2626",
      icon: AlertTriangle,
      cta: "Get a Security Assessment",
    };
  } else if (score >= 6) {
    return {
      label: "Moderate Risk",
      description: "You've got some things handled but there are real gaps. A few targeted improvements would significantly reduce your exposure — and you probably don't need a major overhaul.",
      color: "#F97316",
      icon: ShieldAlert,
      cta: "Talk to Us — No Obligation",
    };
  } else {
    return {
      label: "Low Risk",
      description: "Your business is in reasonably good shape. There may still be room to improve performance, automation, or your online presence — but you're not in immediate danger.",
      color: "#16A34A",
      icon: CheckCircle,
      cta: "See How We Can Help Further",
    };
  }
}

export default function ITQuiz() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const [captureEmail, setCaptureEmail] = useState("");
  const [captureStatus, setCaptureStatus] = useState<"idle" | "loading" | "done">("idle");

  const totalScore = answers.reduce((a, b) => a + b, 0);
  const result = getResult(totalScore);
  const ResultIcon = result.icon;

  const handleNext = () => {
    if (selected === null) return;
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);
    setSelected(null);
    if (current + 1 >= questions.length) {
      setDone(true);
      const finalScore = newAnswers.reduce((a, b) => a + b, 0);
      trackQuizComplete({ score: finalScore, riskTier: getResult(finalScore).label });
    } else {
      setCurrent(current + 1);
    }
  };

  const handleReset = () => {
    setCurrent(0);
    setAnswers([]);
    setSelected(null);
    setDone(false);
    setCaptureEmail("");
    setCaptureStatus("idle");
  };

  const handleCapture = async () => {
    if (!captureEmail.includes("@") || captureStatus !== "idle") return;
    setCaptureStatus("loading");
    try {
      await fetch("/api/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: captureEmail,
          context: `IT Risk Quiz — ${result.label} (score: ${totalScore})`,
        }),
      });
    } catch (_) {}
    setCaptureStatus("done");
  };

  const progress = ((current) / questions.length) * 100;

  return (
    <section id="quiz" className="py-24 bg-[#18181B]">
      <div className="max-w-2xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p
            className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Free Self-Assessment
          </p>
          <h2
            className="text-4xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            How exposed is your business?
          </h2>
          <p
            className="text-white/60 text-lg"
            style={{ fontFamily: "var(--font-body)" }}
          >
            6 questions. 2 minutes. Find out where you actually stand.
          </p>
        </motion.div>

        <div className="bg-[#1F1F23] rounded-2xl border border-white/10 overflow-hidden">
          {!done ? (
            <>
              {/* Progress bar */}
              <div className="h-1 bg-white/10">
                <motion.div
                  className="h-full bg-[#F97316]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <span
                    className="text-xs font-semibold uppercase tracking-widest text-white/40"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Question {current + 1} of {questions.length}
                  </span>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={current}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                  >
                    <h3
                      className="text-xl font-bold text-white mb-6"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {questions[current].q}
                    </h3>

                    <div className="space-y-3">
                      {questions[current].options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => setSelected(opt.risk)}
                          className={`w-full text-left px-5 py-4 rounded-xl border text-sm transition-all ${
                            selected === opt.risk
                              ? "border-[#F97316] bg-[#F97316]/10 text-white"
                              : "border-white/10 bg-white/5 text-white/70 hover:border-white/30 hover:bg-white/8"
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
                    disabled={selected === null}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-semibold text-white bg-[#F97316] hover:bg-[#ea6c0a] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {current + 1 === questions.length ? "See My Results" : "Next"}
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="p-8 text-center"
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: result.color + "22" }}
              >
                <ResultIcon size={28} color={result.color} />
              </div>
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-2"
                style={{ color: result.color, fontFamily: "var(--font-heading)" }}
              >
                Your Result
              </p>
              <h3
                className="text-3xl font-bold text-white mb-4"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {result.label}
              </h3>
              <p
                className="text-white/60 text-sm leading-relaxed mb-8 max-w-md mx-auto"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {result.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md text-sm font-semibold text-[#18181B] bg-[#F97316] hover:bg-[#ea6c0a] transition-colors"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {result.cta} <ArrowRight size={15} />
                </a>
                <button
                  onClick={handleReset}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-md text-sm font-semibold text-white/60 border border-white/20 hover:border-white/40 hover:text-white transition-colors"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Start Over
                </button>
              </div>

              {/* Email capture */}
              <div className="border-t border-white/10 pt-6">
                {captureStatus === "done" ? (
                  <p className="text-green-400 text-sm text-center" style={{ fontFamily: "var(--font-body)" }}>
                    ✓ Got it — Duke will follow up with personalized recommendations.
                  </p>
                ) : (
                  <>
                    <p className="text-white/50 text-xs text-center mb-3" style={{ fontFamily: "var(--font-body)" }}>
                      Want a personalized action plan sent to your inbox?
                    </p>
                    <div className="flex gap-2 max-w-sm mx-auto">
                      <div className="flex-1 flex items-center gap-2 bg-white/10 border border-white/15 rounded-lg px-3 py-2">
                        <Mail size={14} color="rgba(255,255,255,0.4)" className="flex-shrink-0" />
                        <input
                          type="email"
                          value={captureEmail}
                          onChange={(e) => setCaptureEmail(e.target.value)}
                          placeholder="your@email.com"
                          onKeyDown={(e) => e.key === "Enter" && handleCapture()}
                          className="flex-1 bg-transparent text-sm text-white placeholder-white/30 focus:outline-none"
                          style={{ fontFamily: "var(--font-body)" }}
                        />
                      </div>
                      <button
                        onClick={handleCapture}
                        disabled={!captureEmail.includes("@") || captureStatus === "loading"}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/15 rounded-lg text-white text-xs font-semibold transition-colors disabled:opacity-40"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {captureStatus === "loading" ? "…" : "Send"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
