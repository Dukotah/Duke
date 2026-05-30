"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, AlertTriangle, CheckCircle, ShieldAlert, Mail } from "lucide-react";

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
  recommendations: string[];
};

function getResult(score: number): Result {
  if (score >= 12) {
    return {
      label: "High Risk",
      description: "Your business has several significant vulnerabilities that could result in data loss, a breach, or extended downtime. The good news: most of these are fixable quickly.",
      color: "#DC2626",
      icon: AlertTriangle,
      cta: "Get a Security Assessment",
      recommendations: [
        "Implement a centralized password manager immediately",
        "Schedule a firewall and network security review",
        "Set up automated offsite backups with tested restore procedures",
        "Create a formal employee offboarding checklist",
        "Enable automatic software and OS updates",
      ],
    };
  } else if (score >= 6) {
    return {
      label: "Moderate Risk",
      description: "You've got some things handled but there are real gaps. A few targeted improvements would significantly reduce your exposure — and you probably don't need a major overhaul.",
      color: "#F97316",
      icon: ShieldAlert,
      cta: "Talk to Us — No Obligation",
      recommendations: [
        "Audit password practices and enforce a manager company-wide",
        "Review router/firewall settings and update firmware",
        "Test your backup restore process — don't assume it works",
        "Tighten your employee offboarding process",
      ],
    };
  } else {
    return {
      label: "Low Risk",
      description: "Your business is in reasonably good shape. There may still be room to improve performance, automation, or your online presence — but you're not in immediate danger.",
      color: "#16A34A",
      icon: CheckCircle,
      cta: "See How We Can Help Further",
      recommendations: [
        "Consider a periodic third-party security audit to stay ahead",
        "Review your website performance and lead generation metrics",
        "Explore automation opportunities to reduce manual overhead",
        "Document your current IT setup for continuity planning",
      ],
    };
  }
}

type QuizStep = "quiz" | "capture" | "revealed";

export default function ITQuiz() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [step, setStep] = useState<QuizStep>("quiz");
  const [captureEmail, setCaptureEmail] = useState("");
  const [capturing, setCapturing] = useState(false);
  const [captureError, setCaptureError] = useState(false);

  const totalScore = answers.reduce((a, b) => a + b, 0);
  const result = getResult(totalScore);
  const ResultIcon = result.icon;

  const handleNext = () => {
    if (selected === null) return;
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);
    setSelected(null);
    if (current + 1 >= questions.length) {
      setStep("capture");
    } else {
      setCurrent(current + 1);
    }
  };

  const handleReset = () => {
    setCurrent(0);
    setAnswers([]);
    setSelected(null);
    setStep("quiz");
    setCaptureEmail("");
    setCaptureError(false);
  };

  const handleCapture = async () => {
    if (!captureEmail.trim() || !captureEmail.includes("@")) {
      setCaptureError(true);
      return;
    }
    setCapturing(true);
    setCaptureError(false);
    const answerSummary = questions.map((q, i) => {
      const chosen = q.options.find(o => o.risk === answers[i]);
      return `• ${q.q}\n  → ${chosen?.label ?? "N/A"}`;
    }).join("\n\n");
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "IT Quiz Lead",
          business: "Unknown",
          email: captureEmail,
          service: "cybersecurity",
          message: `IT Self-Assessment Result: ${result.label} (score ${totalScore}/18)\n\nAnswers:\n${answerSummary}`,
        }),
      });
    } catch (_) {}
    setCapturing(false);
    setStep("revealed");
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
          <p className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-4" style={{ fontFamily: "var(--font-heading)" }}>
            Free Self-Assessment
          </p>
          <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-heading)" }}>
            How exposed is your business?
          </h2>
          <p className="text-white/60 text-lg" style={{ fontFamily: "var(--font-body)" }}>
            6 questions. 2 minutes. Find out where you actually stand.
          </p>
        </motion.div>

        <div className="bg-[#1F1F23] rounded-2xl border border-white/10 overflow-hidden">
          {/* ── Quiz questions ── */}
          {step === "quiz" && (
            <>
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
                  <span className="text-xs font-semibold uppercase tracking-widest text-white/40" style={{ fontFamily: "var(--font-heading)" }}>
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
                    <h3 className="text-xl font-bold text-white mb-6" style={{ fontFamily: "var(--font-heading)" }}>
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
          )}

          {/* ── Email capture gate ── */}
          {step === "capture" && (
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
              <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: result.color, fontFamily: "var(--font-heading)" }}>
                Assessment Complete
              </p>
              <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                Your result is ready
              </h3>
              <p className="text-white/50 text-sm mb-8 max-w-sm mx-auto" style={{ fontFamily: "var(--font-body)" }}>
                Enter your email and we&apos;ll show your full risk report — plus a personalized action plan sent to your inbox.
              </p>

              <div className="max-w-sm mx-auto space-y-3">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                      type="email"
                      value={captureEmail}
                      onChange={e => { setCaptureEmail(e.target.value); setCaptureError(false); }}
                      onKeyDown={e => e.key === "Enter" && handleCapture()}
                      placeholder="your@email.com"
                      className={`w-full pl-9 pr-4 py-3 rounded-xl bg-white/8 border text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#F97316] transition-colors ${captureError ? "border-red-500" : "border-white/15"}`}
                      style={{ fontFamily: "var(--font-body)" }}
                    />
                  </div>
                  <button
                    onClick={handleCapture}
                    disabled={capturing}
                    className="px-5 py-3 rounded-xl bg-[#F97316] hover:bg-[#ea6c0a] text-white text-sm font-semibold transition-colors disabled:opacity-50 whitespace-nowrap"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {capturing ? "Sending…" : "Get Report"}
                  </button>
                </div>
                {captureError && (
                  <p className="text-red-400 text-xs">Please enter a valid email address.</p>
                )}
                <button
                  onClick={() => setStep("revealed")}
                  className="text-white/30 text-xs hover:text-white/50 transition-colors"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Skip — just show my result
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Full result ── */}
          {step === "revealed" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="p-8"
            >
              <div className="text-center mb-8">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: result.color + "22" }}
                >
                  <ResultIcon size={28} color={result.color} />
                </div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: result.color, fontFamily: "var(--font-heading)" }}>
                  Your Result
                </p>
                <h3 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                  {result.label}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed max-w-md mx-auto" style={{ fontFamily: "var(--font-body)" }}>
                  {result.description}
                </p>
              </div>

              {/* Recommendations */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3" style={{ fontFamily: "var(--font-heading)" }}>
                  Recommended Next Steps
                </p>
                <ul className="space-y-2">
                  {result.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold" style={{ backgroundColor: result.color + "22", color: result.color }}>
                        {i + 1}
                      </span>
                      <span className="text-white/70 text-sm" style={{ fontFamily: "var(--font-body)" }}>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
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
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
