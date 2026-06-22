"use client";

import { useState } from "react";
import Link from "next/link";
import { getAttribution } from "@/lib/attribution";
import { PhoneMissed, ArrowRight, Loader2, CheckCircle2, Mail, Sparkles } from "lucide-react";

// Average weeks per month (52 / 12) — keeps the monthly math honest.
const WEEKS_PER_MONTH = 4.33;
// What a well-set-up AI receptionist realistically recaptures of missed calls.
// Deliberately conservative — it answers instantly, but some callers still won't convert.
const RECAPTURE_RATE = 0.6;

const fmtMoney = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function Field({
  label,
  suffix,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  suffix: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="bg-ink-2 border border-hairline rounded-2xl p-5">
      <div className="flex items-baseline justify-between gap-3 mb-3">
        <label className="text-zinc-300 text-sm font-semibold">{label}</label>
        <span className="text-white font-black tabular-nums text-lg">
          {suffix === "$" ? fmtMoney(value) : `${value}${suffix}`}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        className="w-full accent-copper cursor-pointer"
      />
    </div>
  );
}

export default function MissedCallTool() {
  const [callsPerWeek, setCallsPerWeek] = useState(50);
  const [missedPct, setMissedPct] = useState(25);
  const [avgValue, setAvgValue] = useState(400);
  const [closeRate, setCloseRate] = useState(40);

  const [captureEmail, setCaptureEmail] = useState("");
  const [captureStatus, setCaptureStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  // ── The math ───────────────────────────────────────────────────────────────
  const missedPerMonth = callsPerWeek * (missedPct / 100) * WEEKS_PER_MONTH;
  const lostCustomersPerMonth = missedPerMonth * (closeRate / 100);
  const lostPerMonth = lostCustomersPerMonth * avgValue;
  const lostPerYear = lostPerMonth * 12;
  const recoverablePerYear = lostPerYear * RECAPTURE_RATE;

  const handleEmailCapture = async () => {
    if (!captureEmail.includes("@") || captureStatus !== "idle") return;
    setCaptureStatus("loading");
    try {
      const res = await fetch("/api/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: captureEmail,
          attribution: getAttribution(),
          context: `Missed-Call Calculator — ~${fmtMoney(lostPerYear)}/yr at risk (${Math.round(
            missedPerMonth,
          )} missed calls/mo, ${fmtMoney(avgValue)} avg job, ${closeRate}% close)`,
        }),
      });
      if (!res.ok) {
        setCaptureStatus("error");
        return;
      }
    } catch {
      setCaptureStatus("error");
      return;
    }
    setCaptureStatus("done");
  };

  return (
    <div className="text-white">
      {/* Hero */}
      <section className="relative overflow-hidden pt-6 pb-10 px-0 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 0%, rgba(221,170,117,0.14) 0%, rgba(221,170,117,0) 70%)",
          }}
        />
        <div className="max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 bg-copper/10 text-copper-bright text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 border border-copper/25">
            <PhoneMissed size={13} strokeWidth={2.5} />
            Free Tool
          </span>
          <h1 className="text-balance text-4xl sm:text-6xl font-black mb-5 leading-[1.05] tracking-tight">
            What are missed calls{" "}
            <span className="bg-gradient-to-r from-copper to-copper-bright bg-clip-text text-transparent">
              costing you?
            </span>
          </h1>
          <p className="text-pretty text-zinc-400 text-lg leading-relaxed max-w-xl mx-auto">
            Every call that goes to voicemail is a customer who often just dials the next business on
            the list. Move the sliders to your numbers and see the damage — then what an AI
            receptionist could win back.
          </p>
        </div>
      </section>

      {/* Calculator */}
      <section className="px-0 pb-8">
        <div className="max-w-3xl mx-auto">
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Calls you get per week" suffix="" value={callsPerWeek} min={5} max={400} step={5} onChange={setCallsPerWeek} />
            <Field label="Calls you miss" suffix="%" value={missedPct} min={5} max={80} step={5} onChange={setMissedPct} />
            <Field label="Average value of a job / customer" suffix="$" value={avgValue} min={50} max={5000} step={50} onChange={setAvgValue} />
            <Field label="Of missed callers, how many would have bought" suffix="%" value={closeRate} min={10} max={90} step={5} onChange={setCloseRate} />
          </div>

          {/* Headline result */}
          <div
            className="cbt-rise relative overflow-hidden mt-6 rounded-2xl p-8 text-center shadow-xl shadow-black/20"
            style={{ border: "1px solid rgba(221,170,117,0.45)", background: "linear-gradient(135deg, #1C1917 0%, #18181B 100%)" }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-copper/70 to-transparent"
            />
            <p className="text-copper-bright text-xs font-semibold uppercase tracking-[0.18em] mb-3">
              Estimated revenue walking out the door
            </p>
            <p
              className="text-5xl sm:text-6xl font-black tabular-nums tracking-tight leading-none mb-2"
              style={{ color: "#F97316", filter: "drop-shadow(0 0 22px rgba(249,115,22,0.35))" }}
            >
              {fmtMoney(lostPerYear)}
              <span className="text-2xl text-zinc-500 font-bold"> / yr</span>
            </p>
            <p className="text-zinc-400 text-sm">
              That&apos;s about <span className="text-white font-semibold">{fmtMoney(lostPerMonth)}</span> a
              month — roughly <span className="text-white font-semibold">{Math.round(missedPerMonth)}</span>{" "}
              missed calls turning into{" "}
              <span className="text-white font-semibold">{Math.round(lostCustomersPerMonth)}</span> lost
              customers.
            </p>
          </div>

          {/* Recoverable */}
          <div className="cbt-rise mt-4 grid sm:grid-cols-2 gap-4">
            <div className="bg-ink-2 border border-hairline rounded-2xl p-6">
              <p className="inline-flex items-center gap-1.5 text-zinc-500 text-xs font-semibold uppercase tracking-[0.16em] mb-2">
                <PhoneMissed size={13} />
                Doing nothing
              </p>
              <p className="text-3xl font-black text-red-400 tabular-nums">{fmtMoney(lostPerYear)}</p>
              <p className="text-zinc-500 text-xs mt-1">lost every year to voicemail</p>
            </div>
            <div className="bg-ink-2 border border-copper/30 rounded-2xl p-6">
              <p className="inline-flex items-center gap-1.5 text-copper-bright text-xs font-semibold uppercase tracking-[0.16em] mb-2">
                <Sparkles size={13} />
                With an AI receptionist
              </p>
              <p className="text-3xl font-black text-green-400 tabular-nums">~{fmtMoney(recoverablePerYear)}</p>
              <p className="text-zinc-500 text-xs mt-1">
                recaptured per year (conservative {Math.round(RECAPTURE_RATE * 100)}% of missed calls answered)
              </p>
            </div>
          </div>

          {/* Email capture */}
          <div className="cbt-rise mt-4 bg-ink-2 border border-hairline rounded-2xl p-6 shadow-lg shadow-black/10">
            <p className="inline-flex items-center gap-1.5 text-copper-bright text-xs font-semibold uppercase tracking-[0.16em] mb-1">
              <Mail size={13} />
              Save Your Numbers
            </p>
            {captureStatus === "done" ? (
              <p className="mt-2 flex items-start gap-2 text-green-400 text-sm">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                <span>Sent — check your inbox. Duke will follow up with where to start if you&apos;d like a hand.</span>
              </p>
            ) : (
              <>
                <p className="text-white text-sm font-semibold mb-3">Email me this breakdown</p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    value={captureEmail}
                    onChange={(e) => setCaptureEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleEmailCapture()}
                    placeholder="your@email.com"
                    aria-label="Your email address"
                    className="flex-1 bg-ink-3 border border-hairline rounded-full px-4 py-2.5 text-white placeholder-zinc-500 text-sm transition-all outline-none focus:border-copper focus:ring-4 focus:ring-copper/15 hover:border-copper-dim"
                  />
                  <button
                    onClick={handleEmailCapture}
                    disabled={!captureEmail.includes("@") || captureStatus === "loading"}
                    className="inline-flex items-center justify-center gap-2 bg-copper hover:bg-copper-bright active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 text-ink-0 font-bold px-5 py-2.5 rounded-full text-sm transition-all whitespace-nowrap shadow-md shadow-copper/20 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-copper/30"
                  >
                    {captureStatus === "loading" ? <Loader2 size={15} className="animate-spin" /> : "Send Breakdown"}
                  </button>
                </div>
                {captureStatus === "error" ? (
                  <p className="text-red-400 text-xs mt-2">Something went wrong — email us at contact@copperbaytech.com</p>
                ) : (
                  <p className="text-zinc-600 text-xs mt-2">No spam. Just your numbers and an offer to help.</p>
                )}
              </>
            )}
          </div>

          {/* CTA */}
          <div
            className="cbt-rise relative overflow-hidden mt-4 rounded-2xl p-7 text-center shadow-xl shadow-black/20"
            style={{ border: "1px solid rgba(221,170,117,0.45)", background: "linear-gradient(135deg, #1C1917 0%, #18181B 100%)" }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-copper/70 to-transparent"
            />
            <h4 className="text-white text-2xl font-black mb-2 tracking-tight">Stop sending leads to voicemail.</h4>
            <p className="text-pretty text-zinc-400 text-sm leading-relaxed mb-6 max-w-md mx-auto">
              We set up an AI receptionist that answers every call and chat 24/7, books the
              appointment, and texts you the details — built for your business and supported locally.
            </p>
            <Link
              href="/ai-integration-small-business"
              className="group inline-flex items-center gap-2 bg-copper hover:bg-copper-bright active:scale-[0.98] text-ink-0 font-bold px-8 py-3 rounded-full transition-all text-sm shadow-lg shadow-copper/25 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-copper/30"
            >
              See how AI works for small business
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <p className="text-zinc-600 text-xs text-center mt-6 max-w-lg mx-auto">
            Estimates only, based on the numbers you enter — every business is different. Use it as a
            gut-check, not a guarantee.
          </p>
        </div>
      </section>
    </div>
  );
}
