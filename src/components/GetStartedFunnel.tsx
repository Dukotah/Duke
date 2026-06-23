"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, Phone, Mail } from "lucide-react";
import { BOOKING_URL, PHONE_HREF, PHONE } from "@/config/site";
import { track } from "@/lib/analytics";
import { getAttribution } from "@/lib/attribution";

// Module-level so the purity linter does not flag a Date.now() call inside the
// component body during render.
const nowMs = () => Date.now();

// ─── Types ────────────────────────────────────────────────────────────────────

type ServiceOption = {
  label: string;
  value: string;
  description: string;
};

type BudgetOption = {
  label: string;
  value: string;
};

type TimelineOption = {
  label: string;
  value: string;
};

type ContactFields = {
  name: string;
  business: string;
  email: string;
  phone: string;
};

type ContactErrors = {
  name?: string;
  business?: string;
  email?: string;
};

// ─── Static data ──────────────────────────────────────────────────────────────

const SERVICE_OPTIONS: ServiceOption[] = [
  {
    label: "Website",
    value: "website",
    description: "New site, redesign, or landing page",
  },
  {
    label: "IT Support",
    value: "it-support",
    description: "Networks, devices, and day-to-day tech help",
  },
  {
    label: "Cybersecurity",
    value: "cybersecurity",
    description: "Security audit, hardening, and compliance",
  },
  {
    label: "AI Integration",
    value: "automation",
    description: "Automate workflows and add AI to your business",
  },
  {
    label: "Not sure",
    value: "other",
    description: "Tell us what&apos;s on your mind",
  },
];

const BUDGET_OPTIONS: BudgetOption[] = [
  { label: "Under $1,000", value: "under-1k" },
  { label: "$1,000 – $3,000", value: "1k-3k" },
  { label: "$3,000 – $7,500", value: "3k-7500" },
  { label: "$7,500 – $20,000", value: "7500-20k" },
  { label: "$20,000+", value: "20k-plus" },
  { label: "Not sure yet", value: "tbd" },
];

const TIMELINE_OPTIONS: TimelineOption[] = [
  { label: "ASAP", value: "asap" },
  { label: "1 – 3 months", value: "1-3-months" },
  { label: "Just exploring", value: "exploring" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProgressBar({ step, total }: { step: number; total: number }) {
  const pct = Math.round(((step) / total) * 100);
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: "#DDAA75", fontFamily: "var(--font-heading)" }}
        >
          Step {step} of {total}
        </span>
        <span
          className="text-xs text-white/40"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {pct}% complete
        </span>
      </div>
      <div
        className="w-full h-1.5 rounded-full overflow-hidden"
        style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
        role="progressbar"
        aria-valuenow={step}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label={`Step ${step} of ${total}`}
      >
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%`, backgroundColor: "#C68A5A" }}
        />
      </div>
    </div>
  );
}

function ServiceCard({
  option,
  selected,
  onSelect,
}: {
  option: ServiceOption;
  selected: boolean;
  onSelect: (value: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(option.value)}
      aria-pressed={selected}
      className="w-full text-left rounded-xl p-4 border transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-ink-0"
      style={{
        borderColor: selected ? "#C68A5A" : "rgba(255,255,255,0.1)",
        backgroundColor: selected
          ? "rgba(221,170,117,0.12)"
          : "rgba(255,255,255,0.04)",
      }}
    >
      <p
        className="font-semibold text-white mb-1"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {option.label}
      </p>
      <p
        className="text-sm text-white/50"
        style={{ fontFamily: "var(--font-body)" }}
      >
        {option.description.replace(/&apos;/g, "'")}
      </p>
    </button>
  );
}

function ChipButton({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className="px-4 py-2.5 rounded-lg text-sm font-medium border transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-ink-0"
      style={{
        fontFamily: "var(--font-heading)",
        borderColor: selected ? "#C68A5A" : "rgba(255,255,255,0.1)",
        backgroundColor: selected
          ? "rgba(221,170,117,0.12)"
          : "rgba(255,255,255,0.04)",
        color: selected ? "#DDAA75" : "rgba(255,255,255,0.7)",
      }}
    >
      {label}
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function GetStartedFunnel() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [service, setService] = useState("");
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [contact, setContact] = useState<ContactFields>({
    name: "",
    business: "",
    email: "",
    phone: "",
  });
  const [contactErrors, setContactErrors] = useState<ContactErrors>({});
  const [honeypot, setHoneypot] = useState("");
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "error">("idle");
  const [startedAt] = useState(() => Date.now());

  const TOTAL_STEPS = 3;

  // ── Validation ──────────────────────────────────────────────────────────────

  function validateContact(): boolean {
    const errs: ContactErrors = {};
    if (!contact.name.trim()) errs.name = "Your name is required";
    if (!contact.business.trim()) errs.business = "Business name is required";
    if (!contact.email.trim()) {
      errs.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
      errs.email = "Enter a valid email address";
    }
    setContactErrors(errs);
    return Object.keys(errs).length === 0;
  }

  // ── Navigation ──────────────────────────────────────────────────────────────

  function handleNext() {
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }

  function handleBack() {
    setStep((s) => Math.max(s - 1, 1));
  }

  // ── Submit ──────────────────────────────────────────────────────────────────

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validateContact()) return;

    setSubmitStatus("loading");

    const budgetLabel =
      BUDGET_OPTIONS.find((b) => b.value === budget)?.label ?? budget;
    const timelineLabel =
      TIMELINE_OPTIONS.find((t) => t.value === timeline)?.label ?? timeline;

    const messageParts: string[] = [];
    if (budgetLabel) messageParts.push(`Budget: ${budgetLabel}`);
    if (timelineLabel) messageParts.push(`Timeline: ${timelineLabel}`);
    const message = messageParts.join(" · ");

    const body = {
      name: contact.name,
      business: contact.business,
      email: contact.email,
      phone: contact.phone || undefined,
      service,
      message,
      company_website: honeypot,
      elapsedMs: nowMs() - startedAt,
      attribution: getAttribution(),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        track("get_started_submit");
        router.push("/thank-you");
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    }
  }

  // ── Input helpers ────────────────────────────────────────────────────────────

  const inputBase =
    "w-full px-4 py-3 rounded-md border bg-ink-2 text-white text-sm placeholder-zinc-500 outline-none transition-all focus:ring-2 focus:ring-copper focus:border-copper";

  const inputClass = (hasError: boolean) =>
    `${inputBase} ${hasError ? "border-red-500" : "border-hairline"}`;

  const labelClass =
    "block text-xs font-semibold uppercase tracking-widest text-white/50 mb-1.5";

  // ── Render steps ─────────────────────────────────────────────────────────────

  return (
    <div className="max-w-2xl mx-auto px-6 pb-24">
      <ProgressBar step={step} total={TOTAL_STEPS} />

      {/* ── Step 1: Pick a service ─────────────────────────────────────────── */}
      {step === 1 && (
        <div>
          <h2
            className="text-2xl md:text-3xl font-bold text-white mb-2"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            What can we help you with?
          </h2>
          <p
            className="text-white/50 mb-8"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Pick the area that fits best — we&apos;ll tailor the conversation from there.
          </p>

          <div className="grid sm:grid-cols-2 gap-3 mb-8" role="group" aria-label="Service options">
            {SERVICE_OPTIONS.map((opt) => (
              <ServiceCard
                key={opt.value}
                option={opt}
                selected={service === opt.value}
                onSelect={setService}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleNext}
            disabled={!service}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-bold text-ink-0 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-ink-0"
            style={{ backgroundColor: "#C68A5A", fontFamily: "var(--font-heading)" }}
          >
            Next <ArrowRight size={15} />
          </button>
        </div>
      )}

      {/* ── Step 2: Budget + timeline ──────────────────────────────────────── */}
      {step === 2 && (
        <div>
          <h2
            className="text-2xl md:text-3xl font-bold text-white mb-2"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Budget &amp; timeline
          </h2>
          <p
            className="text-white/50 mb-8"
            style={{ fontFamily: "var(--font-body)" }}
          >
            No wrong answers — this just helps us come prepared.
          </p>

          <div className="mb-8">
            <p
              className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-3"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Approximate budget
            </p>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Budget options">
              {BUDGET_OPTIONS.map((opt) => (
                <ChipButton
                  key={opt.value}
                  label={opt.label}
                  selected={budget === opt.value}
                  onSelect={() => setBudget(opt.value)}
                />
              ))}
            </div>
          </div>

          <div className="mb-10">
            <p
              className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-3"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Timeline
            </p>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Timeline options">
              {TIMELINE_OPTIONS.map((opt) => (
                <ChipButton
                  key={opt.value}
                  label={opt.label}
                  selected={timeline === opt.value}
                  onSelect={() => setTimeline(opt.value)}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-md text-sm font-semibold text-zinc-300 border border-hairline hover:border-copper-dim transition-colors outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-ink-0"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <ArrowLeft size={15} /> Back
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={!budget || !timeline}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-bold text-ink-0 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-ink-0"
              style={{ backgroundColor: "#C68A5A", fontFamily: "var(--font-heading)" }}
            >
              Next <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* ── Step 3: Contact details ────────────────────────────────────────── */}
      {step === 3 && (
        <div>
          <h2
            className="text-2xl md:text-3xl font-bold text-white mb-2"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            How do we reach you?
          </h2>
          <p
            className="text-white/50 mb-8"
            style={{ fontFamily: "var(--font-body)" }}
          >
            We reply within one business day — no spam, no pressure.
          </p>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Honeypot — hidden from users and the a11y tree, catnip for bots */}
            <input
              type="text"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute left-[-9999px] top-[-9999px] h-0 w-0 opacity-0"
            />

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="gs-name"
                  className={labelClass}
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Your Name *
                </label>
                <input
                  id="gs-name"
                  type="text"
                  value={contact.name}
                  onChange={(e) =>
                    setContact((c) => ({ ...c, name: e.target.value }))
                  }
                  placeholder="Jane Smith"
                  className={inputClass(!!contactErrors.name)}
                  style={{ fontFamily: "var(--font-body)" }}
                  aria-required="true"
                  aria-invalid={contactErrors.name ? "true" : undefined}
                  aria-describedby={
                    contactErrors.name ? "gs-name-error" : undefined
                  }
                />
                {contactErrors.name && (
                  <p
                    id="gs-name-error"
                    role="alert"
                    className="text-red-400 text-xs mt-1.5"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {contactErrors.name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="gs-business"
                  className={labelClass}
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Business Name *
                </label>
                <input
                  id="gs-business"
                  type="text"
                  value={contact.business}
                  onChange={(e) =>
                    setContact((c) => ({ ...c, business: e.target.value }))
                  }
                  placeholder="Acme Co."
                  className={inputClass(!!contactErrors.business)}
                  style={{ fontFamily: "var(--font-body)" }}
                  aria-required="true"
                  aria-invalid={contactErrors.business ? "true" : undefined}
                  aria-describedby={
                    contactErrors.business ? "gs-business-error" : undefined
                  }
                />
                {contactErrors.business && (
                  <p
                    id="gs-business-error"
                    role="alert"
                    className="text-red-400 text-xs mt-1.5"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {contactErrors.business}
                  </p>
                )}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="gs-email"
                  className={labelClass}
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Email *
                </label>
                <input
                  id="gs-email"
                  type="email"
                  value={contact.email}
                  onChange={(e) =>
                    setContact((c) => ({ ...c, email: e.target.value }))
                  }
                  placeholder="jane@example.com"
                  className={inputClass(!!contactErrors.email)}
                  style={{ fontFamily: "var(--font-body)" }}
                  aria-required="true"
                  aria-invalid={contactErrors.email ? "true" : undefined}
                  aria-describedby={
                    contactErrors.email ? "gs-email-error" : undefined
                  }
                />
                {contactErrors.email && (
                  <p
                    id="gs-email-error"
                    role="alert"
                    className="text-red-400 text-xs mt-1.5"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {contactErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="gs-phone"
                  className={labelClass}
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Phone (optional)
                </label>
                <input
                  id="gs-phone"
                  type="tel"
                  value={contact.phone}
                  onChange={(e) =>
                    setContact((c) => ({ ...c, phone: e.target.value }))
                  }
                  placeholder="(707) 555-0100"
                  className={inputClass(false)}
                  style={{ fontFamily: "var(--font-body)" }}
                />
              </div>
            </div>

            {submitStatus === "error" && (
              <div role="alert" className="rounded-xl bg-red-950/40 border border-red-500/30 p-4">
                <p
                  className="text-red-400 text-sm font-semibold mb-1"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Something went wrong
                </p>
                <p
                  className="text-red-300/80 text-sm"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Please email{" "}
                  <a
                    href="mailto:contact@copperbaytech.com"
                    className="underline font-medium text-red-300 hover:text-red-200 transition-colors"
                  >
                    contact@copperbaytech.com
                  </a>{" "}
                  or call{" "}
                  <a
                    href={PHONE_HREF}
                    className="underline font-medium text-red-300 hover:text-red-200 transition-colors"
                  >
                    {PHONE}
                  </a>
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-md text-sm font-semibold text-zinc-300 border border-hairline hover:border-copper-dim transition-colors outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-ink-0"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                <ArrowLeft size={15} /> Back
              </button>
              <button
                type="submit"
                disabled={submitStatus === "loading"}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md text-sm font-bold text-ink-0 transition-all duration-200 disabled:opacity-60 outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-ink-0"
                style={{ backgroundColor: "#C68A5A", fontFamily: "var(--font-heading)" }}
              >
                {submitStatus === "loading" ? (
                  "Sending..."
                ) : (
                  <>
                    Send <ArrowRight size={15} />
                  </>
                )}
              </button>
            </div>

            <p
              className="text-xs text-white/30 text-center pt-1"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Or book a free 30-minute call directly —{" "}
              <a
                href={BOOKING_URL}
                className="underline text-white/50 hover:text-white/70 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-copper rounded-sm"
              >
                pick a time
              </a>
            </p>
          </form>
        </div>
      )}

      {/* ── Secondary contact row (all steps) ─────────────────────────────── */}
      <div className="mt-12 pt-8 border-t border-hairline flex flex-col sm:flex-row items-center justify-center gap-6">
        <a
          href={PHONE_HREF}
          className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-copper rounded-sm"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          <Phone size={14} className="text-copper-bright" />
          {PHONE}
        </a>
        <a
          href="mailto:contact@copperbaytech.com"
          className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-copper rounded-sm"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          <Mail size={14} className="text-copper-bright" />
          contact@copperbaytech.com
        </a>
      </div>
    </div>
  );
}
