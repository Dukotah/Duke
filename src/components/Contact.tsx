"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  Mail,
  Clock,
  ArrowRight,
  ArrowLeft,
  Globe,
  Network,
  Workflow,
  ShieldCheck,
  Code2,
  HelpCircle,
  Zap,
  CalendarClock,
  Compass,
  MessageSquare,
  Video,
  Sunrise,
  Sun,
  Sunset,
} from "lucide-react";

type ContactMethod = "call" | "text" | "email" | "video";

type BookingData = {
  service: string;
  timeline: string;
  method: ContactMethod | "";
};

type FormData = {
  name: string;
  business: string;
  email: string;
  phone?: string;
  bestTime?: string;
  message?: string;
};

const services = [
  { value: "website", label: "Website Design & Development", icon: Globe },
  { value: "it-support", label: "IT Support & Networking", icon: Network },
  { value: "automation", label: "Process Automation", icon: Workflow },
  { value: "cybersecurity", label: "Cybersecurity Audit", icon: ShieldCheck },
  { value: "custom-dev", label: "Custom Web Application", icon: Code2 },
  { value: "other", label: "Not sure — I need advice", icon: HelpCircle },
];

const timelines = [
  { value: "asap", label: "As soon as possible", note: "Something's broken or urgent", icon: Zap },
  { value: "weeks", label: "In the next few weeks", note: "Planning ahead", icon: CalendarClock },
  { value: "exploring", label: "Just exploring options", note: "No rush — gathering info", icon: Compass },
];

const methods: { value: ContactMethod; label: string; icon: typeof Phone }[] = [
  { value: "call", label: "Phone call", icon: Phone },
  { value: "text", label: "Text message", icon: MessageSquare },
  { value: "email", label: "Email", icon: Mail },
  { value: "video", label: "Video call", icon: Video },
];

const bestTimes = [
  { value: "morning", label: "Morning", icon: Sunrise },
  { value: "afternoon", label: "Afternoon", icon: Sun },
  { value: "evening", label: "Evening", icon: Sunset },
];

const TOTAL_STEPS = 4;

export default function Contact() {
  const [step, setStep] = useState(0);
  const [booking, setBooking] = useState<BookingData>({
    service: "",
    timeline: "",
    method: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<FormData>();

  // Single-select steps advance automatically — keeps the flow snappy.
  const choose = (key: keyof BookingData, value: string) => {
    setBooking((prev) => ({ ...prev, [key]: value }));
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  };

  const back = () => setStep((s) => Math.max(s - 1, 0));

  const onSubmit = async (data: FormData) => {
    setStatus("loading");

    const serviceLabel =
      services.find((s) => s.value === booking.service)?.label ?? booking.service;
    const timelineLabel =
      timelines.find((t) => t.value === booking.timeline)?.label ?? booking.timeline;
    const methodLabel =
      methods.find((m) => m.value === booking.method)?.label ?? booking.method;

    const summary = [
      `Preferred contact: ${methodLabel}`,
      `Timeline: ${timelineLabel}`,
      data.bestTime ? `Best time to reach: ${data.bestTime}` : null,
      data.message ? `\nNotes: ${data.message}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          business: data.business,
          email: data.email,
          phone: data.phone,
          service: serviceLabel,
          timeline: timelineLabel,
          method: methodLabel,
          bestTime: data.bestTime,
          message: summary,
        }),
      });
      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-md border border-[#18181B]/15 bg-white text-[#3F3F46] text-sm focus:outline-none focus:ring-2 focus:ring-[#18181B]/30 transition placeholder-[#3F3F46]/30";
  const labelClass =
    "block text-xs font-semibold uppercase tracking-widest text-[#18181B]/60 mb-1.5";

  const selectedService = services.find((s) => s.value === booking.service);
  const selectedTimeline = timelines.find((t) => t.value === booking.timeline);
  const selectedMethod = methods.find((m) => m.value === booking.method);
  const progress = (step / TOTAL_STEPS) * 100;

  const stepTitles = [
    "What can we help you with?",
    "How soon are you looking to start?",
    "How should we reach you?",
    "Last step — where do we send the details?",
  ];

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16">
          {/* Left: Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Book a free strategy call
            </p>
            <h2
              className="text-4xl font-bold text-[#18181B] mb-6 leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Let&apos;s talk about what&apos;s holding your business back.
            </h2>
            <p
              className="text-[#3F3F46]/60 leading-relaxed mb-10"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Answer a few quick questions and we&apos;ll set up a free 15-minute call —
              an honest assessment and a clear path forward, on your terms. No fluff,
              no pressure.
            </p>

            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "rgba(24,24,27,0.07)" }}
                >
                  <Phone size={16} color="#18181B" />
                </div>
                <div>
                  <p
                    className="text-xs text-[#3F3F46]/40 uppercase tracking-widest"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Prefer to call now?
                  </p>
                  <a
                    href="tel:+17072396725"
                    className="text-sm font-medium text-[#18181B] hover:underline"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    (707) 239-6725
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "rgba(24,24,27,0.07)" }}
                >
                  <Mail size={16} color="#18181B" />
                </div>
                <div>
                  <p
                    className="text-xs text-[#3F3F46]/40 uppercase tracking-widest"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Email
                  </p>
                  <a
                    href="mailto:duke@copperbaytech.com"
                    className="text-sm font-medium text-[#18181B] hover:underline"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    duke@copperbaytech.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "rgba(24,24,27,0.07)" }}
                >
                  <Clock size={16} color="#18181B" />
                </div>
                <div>
                  <p
                    className="text-xs text-[#3F3F46]/40 uppercase tracking-widest"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Response Time
                  </p>
                  <p
                    className="text-sm font-medium text-[#18181B]"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Within one business day
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Booking flow */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-[#FAFAF9] rounded-2xl border border-[#18181B]/10 shadow-sm overflow-hidden">
              {status === "success" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="p-10 text-center"
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                    style={{ backgroundColor: "rgba(45,106,79,0.12)" }}
                  >
                    <span className="text-2xl">✓</span>
                  </div>
                  <h3
                    className="text-2xl font-bold text-[#18181B] mb-2"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    You&apos;re all set, {getValues("name")?.split(" ")[0] || "thanks"}.
                  </h3>
                  <p
                    className="text-[#3F3F46]/60 text-sm leading-relaxed mb-7 max-w-sm mx-auto"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    We&apos;ll reach out by{" "}
                    <span className="font-medium text-[#18181B]">
                      {selectedMethod?.label.toLowerCase()}
                    </span>{" "}
                    within one business day to lock in your free 15-minute strategy call.
                  </p>

                  <div className="bg-white rounded-xl border border-[#18181B]/10 p-5 text-left max-w-sm mx-auto">
                    <p
                      className="text-xs font-semibold uppercase tracking-widest text-[#3F3F46]/40 mb-3"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      Your request
                    </p>
                    <Recap label="Topic" value={selectedService?.label} />
                    <Recap label="Timeline" value={selectedTimeline?.label} />
                    <Recap label="Reach you via" value={selectedMethod?.label} />
                    {getValues("bestTime") && (
                      <Recap label="Best time" value={getValues("bestTime")} />
                    )}
                  </div>
                </motion.div>
              ) : (
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
                    <div className="flex items-center justify-between mb-6">
                      <span
                        className="text-xs font-semibold uppercase tracking-widest text-[#3F3F46]/40"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        Step {step + 1} of {TOTAL_STEPS}
                      </span>
                      {step > 0 && (
                        <button
                          type="button"
                          onClick={back}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#3F3F46]/50 hover:text-[#18181B] transition-colors"
                          style={{ fontFamily: "var(--font-heading)" }}
                        >
                          <ArrowLeft size={13} /> Back
                        </button>
                      )}
                    </div>

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.25 }}
                      >
                        <h3
                          className="text-xl font-bold text-[#18181B] mb-6"
                          style={{ fontFamily: "var(--font-heading)" }}
                        >
                          {stepTitles[step]}
                        </h3>

                        {/* Step 1 — Service */}
                        {step === 0 && (
                          <div className="grid sm:grid-cols-2 gap-3">
                            {services.map((s) => {
                              const Icon = s.icon;
                              const active = booking.service === s.value;
                              return (
                                <button
                                  key={s.value}
                                  type="button"
                                  onClick={() => choose("service", s.value)}
                                  className={`flex items-start gap-3 text-left px-4 py-4 rounded-xl border text-sm transition-all ${
                                    active
                                      ? "border-[#18181B] bg-[#18181B] text-white"
                                      : "border-[#18181B]/15 bg-white text-[#3F3F46]/80 hover:border-[#18181B]/40"
                                  }`}
                                >
                                  <Icon
                                    size={18}
                                    className="flex-shrink-0 mt-0.5"
                                    color={active ? "#F97316" : "#18181B"}
                                  />
                                  <span
                                    className="font-medium leading-snug"
                                    style={{ fontFamily: "var(--font-heading)" }}
                                  >
                                    {s.label}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {/* Step 2 — Timeline */}
                        {step === 1 && (
                          <div className="space-y-3">
                            {timelines.map((t) => {
                              const Icon = t.icon;
                              const active = booking.timeline === t.value;
                              return (
                                <button
                                  key={t.value}
                                  type="button"
                                  onClick={() => choose("timeline", t.value)}
                                  className={`w-full flex items-center gap-4 text-left px-5 py-4 rounded-xl border transition-all ${
                                    active
                                      ? "border-[#18181B] bg-[#18181B] text-white"
                                      : "border-[#18181B]/15 bg-white text-[#3F3F46]/80 hover:border-[#18181B]/40"
                                  }`}
                                >
                                  <Icon
                                    size={20}
                                    className="flex-shrink-0"
                                    color={active ? "#F97316" : "#18181B"}
                                  />
                                  <span>
                                    <span
                                      className="block text-sm font-medium"
                                      style={{ fontFamily: "var(--font-heading)" }}
                                    >
                                      {t.label}
                                    </span>
                                    <span
                                      className={`block text-xs mt-0.5 ${
                                        active ? "text-white/60" : "text-[#3F3F46]/40"
                                      }`}
                                      style={{ fontFamily: "var(--font-body)" }}
                                    >
                                      {t.note}
                                    </span>
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {/* Step 3 — Contact method */}
                        {step === 2 && (
                          <div className="grid grid-cols-2 gap-3">
                            {methods.map((m) => {
                              const Icon = m.icon;
                              const active = booking.method === m.value;
                              return (
                                <button
                                  key={m.value}
                                  type="button"
                                  onClick={() => choose("method", m.value)}
                                  className={`flex flex-col items-center justify-center gap-2 px-4 py-6 rounded-xl border text-sm transition-all ${
                                    active
                                      ? "border-[#18181B] bg-[#18181B] text-white"
                                      : "border-[#18181B]/15 bg-white text-[#3F3F46]/80 hover:border-[#18181B]/40"
                                  }`}
                                >
                                  <Icon
                                    size={22}
                                    color={active ? "#F97316" : "#18181B"}
                                  />
                                  <span
                                    className="font-medium"
                                    style={{ fontFamily: "var(--font-heading)" }}
                                  >
                                    {m.label}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {/* Step 4 — Details + submit */}
                        {step === 3 && (
                          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            <div className="grid sm:grid-cols-2 gap-5">
                              <div>
                                <label className={labelClass} style={{ fontFamily: "var(--font-heading)" }}>
                                  Your Name *
                                </label>
                                <input
                                  {...register("name", { required: true })}
                                  placeholder="Jane Smith"
                                  className={inputClass}
                                  style={{ fontFamily: "var(--font-body)" }}
                                />
                                {errors.name && (
                                  <p className="text-red-500 text-xs mt-1">Required</p>
                                )}
                              </div>
                              <div>
                                <label className={labelClass} style={{ fontFamily: "var(--font-heading)" }}>
                                  Business Name *
                                </label>
                                <input
                                  {...register("business", { required: true })}
                                  placeholder="Acme Co."
                                  className={inputClass}
                                  style={{ fontFamily: "var(--font-body)" }}
                                />
                                {errors.business && (
                                  <p className="text-red-500 text-xs mt-1">Required</p>
                                )}
                              </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-5">
                              <div>
                                <label className={labelClass} style={{ fontFamily: "var(--font-heading)" }}>
                                  Email *
                                </label>
                                <input
                                  {...register("email", { required: true })}
                                  type="email"
                                  placeholder="jane@example.com"
                                  className={inputClass}
                                  style={{ fontFamily: "var(--font-body)" }}
                                />
                                {errors.email && (
                                  <p className="text-red-500 text-xs mt-1">Required</p>
                                )}
                              </div>
                              <div>
                                <label className={labelClass} style={{ fontFamily: "var(--font-heading)" }}>
                                  Phone{" "}
                                  {booking.method === "call" || booking.method === "text"
                                    ? "*"
                                    : "(optional)"}
                                </label>
                                <input
                                  {...register("phone", {
                                    required:
                                      booking.method === "call" ||
                                      booking.method === "text",
                                  })}
                                  type="tel"
                                  placeholder="(707) 239-6725"
                                  className={inputClass}
                                  style={{ fontFamily: "var(--font-body)" }}
                                />
                                {errors.phone && (
                                  <p className="text-red-500 text-xs mt-1">
                                    Required for {selectedMethod?.label.toLowerCase()}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div>
                              <label className={labelClass} style={{ fontFamily: "var(--font-heading)" }}>
                                Best time to reach you (optional)
                              </label>
                              <div className="grid grid-cols-3 gap-3">
                                {bestTimes.map((t) => {
                                  const Icon = t.icon;
                                  return (
                                    <label
                                      key={t.value}
                                      className="cursor-pointer"
                                    >
                                      <input
                                        type="radio"
                                        value={t.label}
                                        {...register("bestTime")}
                                        className="peer sr-only"
                                      />
                                      <span className="flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border border-[#18181B]/15 bg-white text-[#3F3F46]/70 text-xs font-medium transition-all hover:border-[#18181B]/40 peer-checked:border-[#18181B] peer-checked:bg-[#18181B] peer-checked:text-white">
                                        <Icon size={16} />
                                        {t.label}
                                      </span>
                                    </label>
                                  );
                                })}
                              </div>
                            </div>

                            <div>
                              <label className={labelClass} style={{ fontFamily: "var(--font-heading)" }}>
                                Anything we should know? (optional)
                              </label>
                              <textarea
                                {...register("message")}
                                rows={3}
                                placeholder="A sentence or two about your situation helps us prepare for the call."
                                className={inputClass}
                                style={{ fontFamily: "var(--font-body)", resize: "none" }}
                              />
                            </div>

                            {status === "error" && (
                              <div className="rounded-md bg-red-50 border border-red-200 p-4">
                                <p className="text-red-700 text-sm font-medium mb-1" style={{ fontFamily: "var(--font-heading)" }}>
                                  Something went wrong
                                </p>
                                <p className="text-red-600 text-sm" style={{ fontFamily: "var(--font-body)" }}>
                                  Please email us directly at{" "}
                                  <a href="mailto:duke@copperbaytech.com" className="underline font-medium">
                                    duke@copperbaytech.com
                                  </a>{" "}
                                  or call{" "}
                                  <a href="tel:+17072396725" className="underline font-medium">
                                    (707) 239-6725
                                  </a>
                                </p>
                              </div>
                            )}

                            <button
                              type="submit"
                              disabled={status === "loading"}
                              className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-md text-sm font-semibold text-white transition-colors disabled:opacity-60"
                              style={{
                                backgroundColor: "#18181B",
                                fontFamily: "var(--font-heading)",
                              }}
                              onMouseEnter={(e) => {
                                if (status !== "loading")
                                  e.currentTarget.style.backgroundColor = "#111113";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "#18181B";
                              }}
                            >
                              {status === "loading" ? (
                                "Booking your call..."
                              ) : (
                                <>
                                  Confirm my free call <ArrowRight size={16} />
                                </>
                              )}
                            </button>
                            <p
                              className="text-center text-xs text-[#3F3F46]/40"
                              style={{ fontFamily: "var(--font-body)" }}
                            >
                              Free 15-minute call · No obligation · We reply within one business day
                            </p>
                          </form>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Recap({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex gap-3 py-1">
      <span
        className="text-xs text-[#3F3F46]/40 w-28 flex-shrink-0"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {label}
      </span>
      <span
        className="text-xs text-[#18181B] font-medium"
        style={{ fontFamily: "var(--font-body)" }}
      >
        {value}
      </span>
    </div>
  );
}
