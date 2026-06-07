"use client";

import { useState } from "react";
import Link from "next/link";
import { getAttribution } from "@/lib/attribution";
import { Calculator, ArrowRight, Loader2, CheckCircle2, Mail, Check } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { BOOKING_URL } from "@/config/site";

const fmtMoney = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

// Round to the nearest $100 so the ballpark reads like a real quote, not a
// false-precision number.
const round100 = (n: number) => Math.round(n / 100) * 100;

// Anchored to Copper Bay Tech's published web pricing (/pricing):
// Starter (≤5 pages) $2,500 · Business (≤10) $4,500 · Premium (10–20, e-comm) $7,500.
function pageBase(pages: number): number {
  if (pages <= 5) return 2500;
  if (pages <= 10) return 4500;
  if (pages <= 20) return 7500;
  return 7500 + (pages - 20) * 350;
}

// One-time add-ons, in line with the pricing page's e-commerce/booking range.
const FEATURES = [
  { key: "ecommerce", label: "Online store / e-commerce", note: "Sell products & take payment", cost: 1500 },
  { key: "booking", label: "Online booking / scheduling", note: "Let customers book themselves", cost: 800 },
  { key: "cms", label: "Editable blog / CMS", note: "Update content yourself, no dev needed", cost: 600 },
  { key: "copy", label: "Professional copywriting", note: "We write the words that convert", cost: 700 },
  { key: "brand", label: "Logo & brand kit", note: "Logo, colors, fonts done right", cost: 500 },
] as const;

type FeatureKey = (typeof FEATURES)[number]["key"];

function Toggle({
  active,
  label,
  note,
  cost,
  onClick,
}: {
  active: boolean;
  label: string;
  note: string;
  cost: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`group flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all ${
        active
          ? "border-orange-500/60 bg-orange-500/10"
          : "border-zinc-800 bg-zinc-900/70 hover:border-zinc-700"
      }`}
    >
      <span
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-all ${
          active ? "border-orange-500 bg-orange-500 text-white" : "border-zinc-600 text-transparent"
        }`}
      >
        <Check size={14} strokeWidth={3} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-white">{label}</span>
        <span className="block text-xs text-zinc-500">{note}</span>
      </span>
      <span className="shrink-0 text-sm font-bold tabular-nums text-zinc-300">
        +{fmtMoney(cost)}
      </span>
    </button>
  );
}

export default function WebsiteCostEstimator() {
  const [pages, setPages] = useState(6);
  const [features, setFeatures] = useState<Record<FeatureKey, boolean>>({
    ecommerce: false,
    booking: false,
    cms: true,
    copy: false,
    brand: false,
  });
  const [carePlan, setCarePlan] = useState(true);

  const [captureEmail, setCaptureEmail] = useState("");
  const [captureStatus, setCaptureStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  // ── The math ───────────────────────────────────────────────────────────────
  const featuresTotal = FEATURES.reduce((sum, f) => (features[f.key] ? sum + f.cost : sum), 0);
  const subtotal = pageBase(pages) + featuresTotal;
  // Present a range, not false precision — projects flex with scope.
  const low = round100(subtotal);
  const high = round100(subtotal * 1.2);
  const monthly = carePlan ? 95 : 0;

  const selectedFeatures = FEATURES.filter((f) => features[f.key]).map((f) => f.label);

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
          context: `Website Cost Estimator — ${fmtMoney(low)}–${fmtMoney(high)}${
            monthly ? ` + ${fmtMoney(monthly)}/mo care plan` : ""
          } (${pages} pages; ${selectedFeatures.length ? selectedFeatures.join(", ") : "no add-ons"})`,
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
    <div className="min-h-screen bg-[#18181B] text-white">
      <Nav />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-10 px-6 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 0%, rgba(249,115,22,0.14) 0%, rgba(249,115,22,0) 70%)",
          }}
        />
        <div className="max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 bg-orange-500/10 text-orange-400 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 border border-orange-500/25">
            <Calculator size={13} strokeWidth={2.5} />
            Free Tool
          </span>
          <h1 className="text-balance text-4xl sm:text-6xl font-black mb-5 leading-[1.05] tracking-tight">
            What should your website{" "}
            <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
              actually cost?
            </span>
          </h1>
          <p className="text-pretty text-zinc-400 text-lg leading-relaxed max-w-xl mx-auto">
            No &quot;contact us for pricing.&quot; Pick what you need and get an honest ballpark in
            seconds — built on the same numbers we quote real Sonoma County businesses.
          </p>
        </div>
      </section>

      {/* Estimator */}
      <section className="px-6 pb-24">
        <div className="max-w-3xl mx-auto">
          {/* Pages slider */}
          <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5">
            <div className="flex items-baseline justify-between gap-3 mb-3">
              <label className="text-zinc-300 text-sm font-semibold">How many pages?</label>
              <span className="text-white font-black tabular-nums text-lg">
                {pages}
                {pages >= 25 ? "+" : ""} page{pages === 1 ? "" : "s"}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={25}
              step={1}
              value={pages}
              onChange={(e) => setPages(Number(e.target.value))}
              aria-label="Number of pages"
              className="w-full accent-orange-500 cursor-pointer"
            />
            <p className="text-zinc-600 text-xs mt-2">
              Most small-business sites land at 5–10: Home, About, Services, Contact, plus a page per
              service or location.
            </p>
          </div>

          {/* Features */}
          <p className="mt-6 mb-3 text-zinc-400 text-xs font-semibold uppercase tracking-[0.16em]">
            Add what you need
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {FEATURES.map((f) => (
              <Toggle
                key={f.key}
                active={features[f.key]}
                label={f.label}
                note={f.note}
                cost={f.cost}
                onClick={() => setFeatures((prev) => ({ ...prev, [f.key]: !prev[f.key] }))}
              />
            ))}
            <Toggle
              active={carePlan}
              label="Care plan (hosting, updates, security)"
              note="We keep it fast, safe & current"
              cost={95}
              onClick={() => setCarePlan((v) => !v)}
            />
          </div>

          {/* Headline result */}
          <div
            className="cbt-rise relative overflow-hidden mt-6 rounded-2xl p-8 text-center shadow-xl shadow-black/20"
            style={{ border: "1px solid rgba(249,115,22,0.45)", background: "linear-gradient(135deg, #1C1917 0%, #18181B 100%)" }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-orange-500/70 to-transparent"
            />
            <p className="text-orange-400 text-xs font-semibold uppercase tracking-[0.18em] mb-3">
              Estimated one-time build
            </p>
            <p
              className="text-4xl sm:text-5xl font-black tabular-nums tracking-tight leading-none mb-2"
              style={{ color: "#F97316", filter: "drop-shadow(0 0 22px rgba(249,115,22,0.35))" }}
            >
              {fmtMoney(low)} <span className="text-zinc-500">–</span> {fmtMoney(high)}
            </p>
            {monthly > 0 && (
              <p className="text-zinc-400 text-sm">
                plus <span className="text-white font-semibold">{fmtMoney(monthly)}/mo</span> for the
                care plan — hosting, updates, security & small edits handled.
              </p>
            )}
            <p className="text-zinc-500 text-xs mt-3">
              Custom-coded and owned by you. No page-builder rentals, no surprise renewals.
            </p>
          </div>

          {/* Email capture */}
          <div className="cbt-rise mt-4 bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 shadow-lg shadow-black/10">
            <p className="inline-flex items-center gap-1.5 text-orange-400 text-xs font-semibold uppercase tracking-[0.16em] mb-1">
              <Mail size={13} />
              Save your estimate
            </p>
            {captureStatus === "done" ? (
              <p className="mt-2 flex items-start gap-2 text-green-400 text-sm">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                <span>
                  Sent — check your inbox. Duke will follow up with a firm quote if you&apos;d like one.
                </span>
              </p>
            ) : (
              <>
                <p className="text-white text-sm font-semibold mb-3">Email me this estimate</p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    value={captureEmail}
                    onChange={(e) => setCaptureEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleEmailCapture()}
                    placeholder="your@email.com"
                    aria-label="Your email address"
                    className="flex-1 bg-zinc-800/80 border border-zinc-700 rounded-full px-4 py-2.5 text-white placeholder-zinc-500 text-sm transition-all outline-none focus:border-orange-500/70 focus:ring-4 focus:ring-orange-500/15 hover:border-zinc-600"
                  />
                  <button
                    onClick={handleEmailCapture}
                    disabled={!captureEmail.includes("@") || captureStatus === "loading"}
                    className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 text-white font-bold px-5 py-2.5 rounded-full text-sm transition-all whitespace-nowrap shadow-md shadow-orange-500/20 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/30"
                  >
                    {captureStatus === "loading" ? <Loader2 size={15} className="animate-spin" /> : "Send Estimate"}
                  </button>
                </div>
                {captureStatus === "error" ? (
                  <p className="text-red-400 text-xs mt-2">Something went wrong — email us at contact@copperbaytech.com</p>
                ) : (
                  <p className="text-zinc-600 text-xs mt-2">No spam. Just your estimate and an offer to help.</p>
                )}
              </>
            )}
          </div>

          {/* CTA */}
          <div
            className="cbt-rise relative overflow-hidden mt-4 rounded-2xl p-7 text-center shadow-xl shadow-black/20"
            style={{ border: "1px solid rgba(249,115,22,0.45)", background: "linear-gradient(135deg, #1C1917 0%, #18181B 100%)" }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-orange-500/70 to-transparent"
            />
            <h4 className="text-white text-2xl font-black mb-2 tracking-tight">Want a firm number?</h4>
            <p className="text-pretty text-zinc-400 text-sm leading-relaxed mb-6 max-w-md mx-auto">
              A 15-minute call is all it takes to turn this ballpark into a fixed quote — no pressure,
              no obligation, and you&apos;ll talk to the person who&apos;d build it.
            </p>
            <Link
              href={BOOKING_URL}
              className="group inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 active:scale-[0.98] text-white font-bold px-8 py-3 rounded-full transition-all text-sm shadow-lg shadow-orange-500/25 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/30"
            >
              Get a free, firm quote
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <p className="mt-4 text-xs text-zinc-500">
              Prefer to browse first?{" "}
              <Link href="/pricing" className="text-orange-400 underline-offset-2 hover:underline">
                See full pricing
              </Link>
            </p>
          </div>

          <p className="text-zinc-600 text-xs text-center mt-6 max-w-lg mx-auto">
            Estimates only, based on the options you pick — every project is different. Use it as a
            gut-check, not a guarantee. Your real quote is always fixed and in writing before we start.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
