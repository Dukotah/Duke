"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Phone, Mail, Clock, Calendar, MessageSquare } from "lucide-react";

// Set NEXT_PUBLIC_CALENDLY_URL in your .env.local (or Vercel env vars)
// Example: NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/duke-copperbaytech/30min
const CALENDLY_URL =
  process.env.NEXT_PUBLIC_CALENDLY_URL ?? "https://calendly.com/copperbaytech/30min";

type FormData = {
  name: string;
  business: string;
  email: string;
  phone?: string;
  service: string;
  message?: string;
};

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [tab, setTab] = useState<"book" | "message">("book");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setStatus("success");
        reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-md border border-[#18181B]/15 bg-white text-[#3F3F46] text-sm focus:outline-none focus:ring-2 focus:ring-[#18181B]/30 transition placeholder-[#3F3F46]/30";

  const labelClass = "block text-xs font-semibold uppercase tracking-widest text-[#18181B]/60 mb-1.5";

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
              Get in touch
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
              Book a free 30-minute call and we&apos;ll give you an honest assessment
              and a clear path forward — no fluff, no pressure.
            </p>

            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(24,24,27,0.07)" }}>
                  <Phone size={16} color="#18181B" />
                </div>
                <div>
                  <p className="text-xs text-[#3F3F46]/40 uppercase tracking-widest" style={{ fontFamily: "var(--font-heading)" }}>Phone / Text</p>
                  <a href="tel:+17072396725" className="text-sm font-medium text-[#18181B] hover:underline" style={{ fontFamily: "var(--font-heading)" }}>
                    (707) 239-6725
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(24,24,27,0.07)" }}>
                  <Mail size={16} color="#18181B" />
                </div>
                <div>
                  <p className="text-xs text-[#3F3F46]/40 uppercase tracking-widest" style={{ fontFamily: "var(--font-heading)" }}>Email</p>
                  <a href="mailto:duke@copperbaytech.com" className="text-sm font-medium text-[#18181B] hover:underline" style={{ fontFamily: "var(--font-heading)" }}>
                    duke@copperbaytech.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(24,24,27,0.07)" }}>
                  <Clock size={16} color="#18181B" />
                </div>
                <div>
                  <p className="text-xs text-[#3F3F46]/40 uppercase tracking-widest" style={{ fontFamily: "var(--font-heading)" }}>Response Time</p>
                  <p className="text-sm font-medium text-[#18181B]" style={{ fontFamily: "var(--font-heading)" }}>Within one business day</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Tab switcher + content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Tab toggle */}
            <div className="flex gap-1 p-1 bg-[#F4F4F5] rounded-xl mb-6">
              <button
                onClick={() => setTab("book")}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  tab === "book"
                    ? "bg-white text-[#18181B] shadow-sm"
                    : "text-[#3F3F46]/60 hover:text-[#18181B]"
                }`}
                style={{ fontFamily: "var(--font-heading)" }}
              >
                <Calendar size={15} />
                Book a Free Call
              </button>
              <button
                onClick={() => setTab("message")}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  tab === "message"
                    ? "bg-white text-[#18181B] shadow-sm"
                    : "text-[#3F3F46]/60 hover:text-[#18181B]"
                }`}
                style={{ fontFamily: "var(--font-heading)" }}
              >
                <MessageSquare size={15} />
                Send a Message
              </button>
            </div>

            {/* Book tab: Calendly embed */}
            {tab === "book" && (
              <div className="rounded-2xl overflow-hidden border border-[#18181B]/10 bg-white">
                <div className="px-5 py-4 border-b border-[#18181B]/8 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#F97316] flex items-center justify-center flex-shrink-0">
                    <Calendar size={14} color="white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#18181B]" style={{ fontFamily: "var(--font-heading)" }}>
                      Free 30-Minute Strategy Call
                    </p>
                    <p className="text-xs text-[#3F3F46]/50" style={{ fontFamily: "var(--font-body)" }}>
                      Pick a time that works for you — no obligation
                    </p>
                  </div>
                </div>
                <iframe
                  src={CALENDLY_URL}
                  width="100%"
                  height="540"
                  frameBorder="0"
                  title="Book a free call with Copper Bay Tech"
                  className="block"
                />
              </div>
            )}

            {/* Message tab: contact form */}
            {tab === "message" && (
              <>
                {status === "success" ? (
                  <div className="h-full flex items-center justify-center rounded-2xl bg-[#FAFAF9] p-12 text-center">
                    <div>
                      <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "rgba(45,106,79,0.12)" }}>
                        <span className="text-2xl">✓</span>
                      </div>
                      <h3 className="text-xl font-bold text-[#18181B] mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                        Message received
                      </h3>
                      <p className="text-[#3F3F46]/60 text-sm" style={{ fontFamily: "var(--font-body)" }}>
                        We&apos;ll be in touch within one business day.
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className={labelClass} style={{ fontFamily: "var(--font-heading)" }}>Your Name *</label>
                        <input {...register("name", { required: true })} placeholder="Jane Smith" className={inputClass} style={{ fontFamily: "var(--font-body)" }} />
                        {errors.name && <p className="text-red-500 text-xs mt-1">Required</p>}
                      </div>
                      <div>
                        <label className={labelClass} style={{ fontFamily: "var(--font-heading)" }}>Business Name *</label>
                        <input {...register("business", { required: true })} placeholder="Acme Co." className={inputClass} style={{ fontFamily: "var(--font-body)" }} />
                        {errors.business && <p className="text-red-500 text-xs mt-1">Required</p>}
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className={labelClass} style={{ fontFamily: "var(--font-heading)" }}>Email *</label>
                        <input {...register("email", { required: true })} type="email" placeholder="jane@example.com" className={inputClass} style={{ fontFamily: "var(--font-body)" }} />
                        {errors.email && <p className="text-red-500 text-xs mt-1">Required</p>}
                      </div>
                      <div>
                        <label className={labelClass} style={{ fontFamily: "var(--font-heading)" }}>Phone (optional)</label>
                        <input {...register("phone")} type="tel" placeholder="(707) 239-6725" className={inputClass} style={{ fontFamily: "var(--font-body)" }} />
                      </div>
                    </div>

                    <div>
                      <label className={labelClass} style={{ fontFamily: "var(--font-heading)" }}>What can we help with? *</label>
                      <select {...register("service", { required: true })} className={inputClass} style={{ fontFamily: "var(--font-body)" }}>
                        <option value="">Select a service...</option>
                        <option value="website">Website Design & Development</option>
                        <option value="it-support">IT Support & Networking</option>
                        <option value="automation">Process Automation</option>
                        <option value="cybersecurity">Cybersecurity Audit</option>
                        <option value="custom-dev">Custom Web Application</option>
                        <option value="other">Not sure — I need advice</option>
                      </select>
                      {errors.service && <p className="text-red-500 text-xs mt-1">Please select a service</p>}
                    </div>

                    <div>
                      <label className={labelClass} style={{ fontFamily: "var(--font-heading)" }}>Tell us more (optional)</label>
                      <textarea
                        {...register("message")}
                        rows={4}
                        placeholder="Describe your situation, current setup, or what you'd like to accomplish..."
                        className={inputClass}
                        style={{ fontFamily: "var(--font-body)", resize: "none" }}
                      />
                    </div>

                    {status === "error" && (
                      <div className="rounded-md bg-red-50 border border-red-200 p-4">
                        <p className="text-red-700 text-sm font-medium mb-1" style={{ fontFamily: "var(--font-heading)" }}>Message couldn&apos;t be sent</p>
                        <p className="text-red-600 text-sm" style={{ fontFamily: "var(--font-body)" }}>
                          Please email us at{" "}
                          <a href="mailto:duke@copperbaytech.com" className="underline font-medium">duke@copperbaytech.com</a>{" "}
                          or call <a href="tel:+17072396725" className="underline font-medium">(707) 239-6725</a>
                        </p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="w-full py-3.5 rounded-md text-sm font-semibold text-white transition-colors disabled:opacity-60"
                      style={{ backgroundColor: "#18181B", fontFamily: "var(--font-heading)" }}
                      onMouseEnter={e => { if (status !== "loading") e.currentTarget.style.backgroundColor = "#111113"; }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = "#18181B"; }}
                    >
                      {status === "loading" ? "Sending..." : "Send Message"}
                    </button>
                  </form>
                )}
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
