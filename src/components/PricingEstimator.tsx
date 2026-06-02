"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Info } from "lucide-react";

type Option = { label: string; value: string; modifier: number; note?: string };

type Step = {
  id: string;
  question: string;
  subtitle?: string;
  options: Option[];
};

const steps: Step[] = [
  {
    id: "type",
    question: "What do you need help with?",
    options: [
      { label: "New Website", value: "website", modifier: 0 },
      { label: "IT Support / Networking", value: "it", modifier: 0 },
      { label: "Cybersecurity Audit", value: "security", modifier: 0 },
      { label: "Custom Web App", value: "app", modifier: 0 },
    ],
  },
  {
    id: "size",
    question: "How many people work at your business?",
    options: [
      { label: "Just me / 1–2 people", value: "solo", modifier: 0 },
      { label: "3–10 people", value: "small", modifier: 500 },
      { label: "11–30 people", value: "medium", modifier: 1500 },
      { label: "31+ people", value: "large", modifier: 3000 },
    ],
  },
  {
    id: "urgency",
    question: "What's your timeline?",
    options: [
      { label: "Flexible — within a few months", value: "flexible", modifier: 0 },
      { label: "Within the next 4–6 weeks", value: "normal", modifier: 0 },
      { label: "ASAP — this is urgent", value: "urgent", modifier: 500, note: "Rush projects may incur a priority fee" },
    ],
  },
  {
    id: "extras",
    question: "Any extras you know you'll need?",
    subtitle: "Select all that apply",
    options: [
      { label: "Ongoing monthly support / retainer", value: "retainer", modifier: 250 },
      { label: "Staff training", value: "training", modifier: 300 },
      { label: "Content writing / copywriting", value: "copy", modifier: 400 },
      { label: "None of the above", value: "none", modifier: 0 },
    ],
  },
];

const baseRanges: Record<string, [number, number]> = {
  website: [2500, 7500],
  it: [550, 2200],
  security: [750, 1200],
  app: [4000, 12000],
};

function formatRange(low: number, high: number): string {
  const fmt = (n: number) =>
    n >= 1000 ? "$" + (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + "k" : "$" + n;
  return fmt(low) + " – " + fmt(high);
}

export default function PricingEstimator() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [done, setDone] = useState(false);

  const step = steps[current];
  const isMulti = step.id === "extras";
  const selected = answers[step.id] || [];

  const toggleOption = (val: string) => {
    if (!isMulti) {
      setAnswers({ ...answers, [step.id]: [val] });
      return;
    }
    if (val === "none") {
      setAnswers({ ...answers, [step.id]: ["none"] });
      return;
    }
    const without = selected.filter((v) => v !== "none" && v !== val);
    if (selected.includes(val)) {
      setAnswers({ ...answers, [step.id]: without });
    } else {
      setAnswers({ ...answers, [step.id]: [...without, val] });
    }
  };

  const canNext = selected.length > 0;

  const handleNext = () => {
    if (!canNext) return;
    if (current + 1 >= steps.length) {
      setDone(true);
    } else {
      setCurrent(current + 1);
    }
  };

  const computeEstimate = () => {
    const type = (answers.type || ["website"])[0];
    const [baseLow, baseHigh] = baseRanges[type] || [1500, 4000];
    let addedLow = 0;
    let addedHigh = 0;
    Object.entries(answers).forEach(([stepId, vals]) => {
      if (stepId === "type") return;
      const s = steps.find((s) => s.id === stepId);
      if (!s) return;
      vals.forEach((val) => {
        const opt = s.options.find((o) => o.value === val);
        if (opt) {
          addedLow += opt.modifier * 0.8;
          addedHigh += opt.modifier;
        }
      });
    });
    return [Math.round(baseLow + addedLow), Math.round(baseHigh + addedHigh)];
  };

  const [estLow, estHigh] = done ? computeEstimate() : [0, 0];

  const progress = ((current) / steps.length) * 100;

  return (
    <section id="estimator" className="py-24 bg-[#FAFAF9]">
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
            Transparent Pricing
          </p>
          <h2
            className="text-4xl font-bold text-[#18181B] mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            What might it cost?
          </h2>
          <p
            className="text-[#3F3F46]/60 text-lg"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Answer 4 quick questions and get a rough ballpark — no email required.
          </p>
        </motion.div>

        <div className="bg-white rounded-2xl border border-[#18181B]/10 shadow-sm overflow-hidden">
          {!done ? (
            <>
              {/* Progress */}
              <div className="h-1 bg-[#18181B]/8">
                <motion.div
                  className="h-full bg-[#F97316]"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              <div className="p-8">
                <div className="mb-6">
                  <span
                    className="text-xs font-semibold uppercase tracking-widest text-[#3F3F46]/40"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Step {current + 1} of {steps.length}
                  </span>
                  <h3
                    className="text-xl font-bold text-[#18181B] mt-2"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {step.question}
                  </h3>
                  {step.subtitle && (
                    <p className="text-sm text-[#3F3F46]/50 mt-1" style={{ fontFamily: "var(--font-body)" }}>
                      {step.subtitle}
                    </p>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  {step.options.map((opt) => {
                    const isSelected = selected.includes(opt.value);
                    return (
                      <button
                        key={opt.value}
                        onClick={() => toggleOption(opt.value)}
                        className={`text-left px-5 py-4 rounded-xl border text-sm transition-all ${
                          isSelected
                            ? "border-[#18181B] bg-[#18181B] text-white"
                            : "border-[#18181B]/15 bg-[#FAFAF9] text-[#3F3F46]/80 hover:border-[#18181B]/40"
                        }`}
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        <span className="font-medium" style={{ fontFamily: "var(--font-heading)" }}>
                          {opt.label}
                        </span>
                        {opt.note && (
                          <span className={`flex items-center gap-1 mt-1 text-xs ${isSelected ? "text-white/60" : "text-[#3F3F46]/40"}`}>
                            <Info size={11} /> {opt.note}
                          </span>
                        )}
                        {opt.modifier > 0 && (
                          <span className={`block mt-1 text-xs ${isSelected ? "text-white/60" : "text-[#3F3F46]/40"}`}>
                            +~${opt.modifier.toLocaleString()}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={handleNext}
                    disabled={!canNext}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-semibold text-white bg-[#18181B] hover:bg-[#111113] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {current + 1 === steps.length ? "Get My Estimate" : "Next"}
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-8 text-center"
            >
              <p
                className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-3"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Rough Estimate
              </p>
              <p
                className="text-5xl font-bold text-[#18181B] mb-2"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {formatRange(estLow, estHigh)}
              </p>
              <p
                className="text-[#3F3F46]/50 text-sm mb-8"
                style={{ fontFamily: "var(--font-body)" }}
              >
                This is a ballpark only — not a quote. Actual pricing depends on specifics.
                We provide a flat-fee proposal after a free consultation.
              </p>
              <div className="bg-[#FAFAF9] rounded-xl p-5 mb-8 text-left">
                <p
                  className="text-xs font-semibold uppercase tracking-widest text-[#3F3F46]/40 mb-3"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  What you told us
                </p>
                {Object.entries(answers).map(([stepId, vals]) => {
                  const s = steps.find((s) => s.id === stepId);
                  if (!s) return null;
                  return (
                    <div key={stepId} className="flex gap-2 mb-2">
                      <span className="text-xs text-[#3F3F46]/40 w-24 flex-shrink-0" style={{ fontFamily: "var(--font-heading)" }}>
                        {s.question.split(" ").slice(0, 3).join(" ")}...
                      </span>
                      <span className="text-xs text-[#18181B]" style={{ fontFamily: "var(--font-body)" }}>
                        {vals.map((v) => s.options.find((o) => o.value === v)?.label).join(", ")}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md text-sm font-semibold text-white bg-[#F97316] hover:bg-[#ea6c0a] transition-colors"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Get an Exact Quote <ArrowRight size={15} />
                </a>
                <button
                  onClick={() => { setCurrent(0); setAnswers({}); setDone(false); }}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-md text-sm font-semibold text-[#3F3F46]/70 border border-[#18181B]/15 hover:border-[#18181B]/40 transition-colors"
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
