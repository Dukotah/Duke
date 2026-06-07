"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Phone, Mail, Clock, CalendarDays } from "lucide-react";
import { BOOKING_URL } from "@/config/site";
import { track } from "@/lib/analytics";
import { getAttribution } from "@/lib/attribution";

// Module-level so the purity linter doesn't flag a Date.now() call inside the
// component (it's only ever called from the submit event handler, not render).
const nowMs = () => Date.now();

type FormData = {
  name: string;
  business: string;
  email: string;
  phone?: string;
  service: string;
  message?: string;
  // Honeypot — must stay empty. Bots that auto-fill every field trip this.
  company_website?: string;
};

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  // Captured once at mount; a near-instant submit (< 2s) is almost certainly a bot.
  const [startedAt] = useState(() => Date.now());
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, elapsedMs: nowMs() - startedAt, attribution: getAttribution() }),
        // Never let the UI spin forever if the API hangs — surface an error instead.
        signal: AbortSignal.timeout(15000),
      });
      if (res.ok) {
        track("contact_form_submit");
        router.push("/thank-you");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-md border border-[#18181B]/15 bg-white text-[#3F3F46] text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-1 transition placeholder-[#3F3F46]/30";

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
              className="text-[#3F3F46]/60 leading-relaxed mb-8"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Tell us what you&apos;re working with. We&apos;ll give you an honest assessment
              and a clear path forward — no fluff, no pressure.
            </p>

            {/* Book a call CTA → on-site /schedule */}
            <a
              href={BOOKING_URL}
              className="inline-flex items-center gap-3 w-full px-5 py-4 rounded-xl border-2 border-[#F97316] mb-8 hover:bg-[#F97316]/5 transition-colors group"
            >
              <div className="w-10 h-10 rounded-md bg-[#F97316] flex items-center justify-center flex-shrink-0">
                <CalendarDays size={18} color="white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-[#18181B]" style={{ fontFamily: "var(--font-heading)" }}>
                  Book a free 30-minute call
                </p>
                <p className="text-xs text-[#3F3F46]/50" style={{ fontFamily: "var(--font-body)" }}>
                  Pick a time that works — no back and forth
                </p>
              </div>
              <span className="text-[#F97316] text-sm font-semibold" style={{ fontFamily: "var(--font-heading)" }}>→</span>
            </a>

            <p className="text-xs text-[#3F3F46]/40 mb-6 text-center" style={{ fontFamily: "var(--font-body)" }}>
              or send a message below
            </p>

            <div className="space-y-4">
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
                  <a href="mailto:contact@copperbaytech.com" className="text-sm font-medium text-[#18181B] hover:underline" style={{ fontFamily: "var(--font-heading)" }}>
                    contact@copperbaytech.com
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

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Honeypot: hidden from users (and the a11y tree), catnip for bots. */}
              <input
                type="text"
                {...register("company_website")}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute left-[-9999px] top-[-9999px] h-0 w-0 opacity-0"
              />
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="contact-name" className={labelClass} style={{ fontFamily: "var(--font-heading)" }}>Your Name *</label>
                  <input id="contact-name" {...register("name", { required: true })} placeholder="Jane Smith" className={inputClass} style={{ fontFamily: "var(--font-body)" }} aria-required="true" aria-invalid={errors.name ? "true" : undefined} aria-describedby={errors.name ? "contact-name-error" : undefined} />
                  {errors.name && <p id="contact-name-error" role="alert" className="text-red-700 text-xs mt-1">Required</p>}
                </div>
                <div>
                  <label htmlFor="contact-business" className={labelClass} style={{ fontFamily: "var(--font-heading)" }}>Business Name *</label>
                  <input id="contact-business" {...register("business", { required: true })} placeholder="Acme Co." className={inputClass} style={{ fontFamily: "var(--font-body)" }} aria-required="true" aria-invalid={errors.business ? "true" : undefined} aria-describedby={errors.business ? "contact-business-error" : undefined} />
                  {errors.business && <p id="contact-business-error" role="alert" className="text-red-700 text-xs mt-1">Required</p>}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="contact-email" className={labelClass} style={{ fontFamily: "var(--font-heading)" }}>Email *</label>
                  <input id="contact-email" {...register("email", { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })} type="email" placeholder="jane@example.com" className={inputClass} style={{ fontFamily: "var(--font-body)" }} aria-required="true" aria-invalid={errors.email ? "true" : undefined} aria-describedby={errors.email ? "contact-email-error" : undefined} />
                  {errors.email && <p id="contact-email-error" role="alert" className="text-red-700 text-xs mt-1">{errors.email.type === "pattern" ? "Enter a valid email" : "Required"}</p>}
                </div>
                <div>
                  <label htmlFor="contact-phone" className={labelClass} style={{ fontFamily: "var(--font-heading)" }}>Phone (optional)</label>
                  <input id="contact-phone" {...register("phone")} type="tel" placeholder="(707) 239-6725" className={inputClass} style={{ fontFamily: "var(--font-body)" }} />
                </div>
              </div>

              <div>
                <label htmlFor="contact-service" className={labelClass} style={{ fontFamily: "var(--font-heading)" }}>What can we help with? *</label>
                <select id="contact-service" {...register("service", { required: true })} className={inputClass} style={{ fontFamily: "var(--font-body)" }} aria-required="true" aria-invalid={errors.service ? "true" : undefined} aria-describedby={errors.service ? "contact-service-error" : undefined}>
                  <option value="">Select a service...</option>
                  <option value="website">Website Design & Development</option>
                  <option value="it-support">IT Support & Networking</option>
                  <option value="automation">Process Automation</option>
                  <option value="cybersecurity">Cybersecurity Audit</option>
                  <option value="custom-dev">Custom Web Application</option>
                  <option value="other">Not sure — I need advice</option>
                </select>
                {errors.service && <p id="contact-service-error" role="alert" className="text-red-700 text-xs mt-1">Please select a service</p>}
              </div>

              <div>
                <label htmlFor="contact-message" className={labelClass} style={{ fontFamily: "var(--font-heading)" }}>Tell us more (optional)</label>
                <textarea
                  id="contact-message"
                  {...register("message")}
                  rows={4}
                  placeholder="Describe your situation, current setup, or what you'd like to accomplish..."
                  className={inputClass}
                  style={{ fontFamily: "var(--font-body)", resize: "none" }}
                />
              </div>

              {status === "error" && (
                <div role="alert" className="rounded-md bg-red-50 border border-red-200 p-4">
                  <p className="text-red-700 text-sm font-medium mb-1" style={{ fontFamily: "var(--font-heading)" }}>
                    Message couldn&apos;t be sent
                  </p>
                  <p className="text-red-600 text-sm" style={{ fontFamily: "var(--font-body)" }}>
                    Please email{" "}
                    <a href="mailto:contact@copperbaytech.com" className="underline font-medium">contact@copperbaytech.com</a>
                    {" "}or call{" "}
                    <a href="tel:+17072396725" className="underline font-medium">(707) 239-6725</a>
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-3.5 rounded-md text-sm font-semibold text-white bg-[#18181B] hover:bg-[#111113] transition-colors disabled:opacity-60 outline-none focus-visible:ring-2 focus-visible:ring-[#18181B] focus-visible:ring-offset-2"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {status === "loading" ? "Sending..." : "Send Message"}
              </button>

              <p className="text-xs text-[#3F3F46]/60 text-center" style={{ fontFamily: "var(--font-body)" }}>
                We reply within one business day. No spam, no sales pressure — and
                we never share your details.
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
