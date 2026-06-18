"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Phone, Mail, Clock, CalendarDays, ArrowRight } from "lucide-react";
import { BOOKING_URL } from "@/config/site";
import { track } from "@/lib/analytics";
import { getAttribution } from "@/lib/attribution";
import { MagneticCTA, RevealOnScroll } from "@/components/motion";

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

  // Dark focus-glow input (playbook Contact §): border→copper + 0 0 0 2px
  // copper-glow on focus. Pure CSS focus state, no JS — works under reduced
  // motion and on every device. The transition is opacity/color only (cheap).
  const inputClass =
    "w-full px-4 py-3 rounded-lg border border-hairline bg-ink-2 text-warm text-sm placeholder-text-warm-3 outline-none transition-[border-color,box-shadow] duration-200 focus-visible:border-copper focus-visible:shadow-[0_0_0_2px_var(--copper-glow)]";

  const labelClass =
    "block text-xs font-semibold uppercase tracking-widest text-warm-3 mb-1.5";

  return (
    <section id="contact" className="bg-ink-0 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-16 md:grid-cols-2">
          {/* Left: Info */}
          <RevealOnScroll as="div" direction="left" distance={20} duration={0.6}>
            <p
              className="mb-4 text-xs font-semibold uppercase tracking-widest text-copper-bright"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Get in touch
            </p>
            <h2
              className="mb-6 text-4xl font-bold leading-tight text-warm"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Let&apos;s get your website handled — for life.
            </h2>
            <p
              className="mb-8 leading-relaxed text-warm-2"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Tell us about your site and your business. We&apos;ll give you an
              honest assessment and a clear path forward — design, hosting,
              updates and support, folded into one calm care plan. No fluff, no
              pressure.
            </p>

            {/* Book a call CTA → on-site /schedule */}
            <a
              href={BOOKING_URL}
              className="group mb-8 inline-flex w-full items-center gap-3 rounded-xl border border-copper-dim bg-ink-2 px-5 py-4 transition-colors hover:border-copper hover:bg-ink-3"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-copper">
                <CalendarDays size={18} className="text-ink-0" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-warm" style={{ fontFamily: "var(--font-heading)" }}>
                  Book a free consultation
                </p>
                <p className="text-xs text-warm-3" style={{ fontFamily: "var(--font-body)" }}>
                  Pick a time that works — no back and forth
                </p>
              </div>
              <ArrowRight
                size={17}
                className="text-copper-bright transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden
              />
            </a>

            <p className="mb-6 text-center text-xs text-warm-3" style={{ fontFamily: "var(--font-body)" }}>
              or send a message below
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md border border-hairline bg-ink-2">
                  <Phone size={16} className="text-copper-bright" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-warm-3" style={{ fontFamily: "var(--font-heading)" }}>Phone / Text</p>
                  <a href="tel:+17072396725" className="text-sm font-medium text-warm transition-colors hover:text-copper-bright" style={{ fontFamily: "var(--font-heading)" }}>
                    (707) 239-6725
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md border border-hairline bg-ink-2">
                  <Mail size={16} className="text-copper-bright" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-warm-3" style={{ fontFamily: "var(--font-heading)" }}>Email</p>
                  <a href="mailto:contact@copperbaytech.com" className="text-sm font-medium text-warm transition-colors hover:text-copper-bright" style={{ fontFamily: "var(--font-heading)" }}>
                    contact@copperbaytech.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md border border-hairline bg-ink-2">
                  <Clock size={16} className="text-copper-bright" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-warm-3" style={{ fontFamily: "var(--font-heading)" }}>Response Time</p>
                  <p className="text-sm font-medium text-warm" style={{ fontFamily: "var(--font-heading)" }}>Within one business day</p>
                </div>
              </div>
            </div>
          </RevealOnScroll>

          {/* Right: Form */}
          <RevealOnScroll as="div" direction="right" distance={20} duration={0.6}>
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
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className={labelClass} style={{ fontFamily: "var(--font-heading)" }}>Your Name *</label>
                  <input id="contact-name" {...register("name", { required: true })} placeholder="Jane Smith" className={inputClass} style={{ fontFamily: "var(--font-body)" }} aria-required="true" aria-invalid={errors.name ? "true" : undefined} aria-describedby={errors.name ? "contact-name-error" : undefined} />
                  {errors.name && <p id="contact-name-error" role="alert" className="mt-1 text-xs text-red-400">Required</p>}
                </div>
                <div>
                  <label htmlFor="contact-business" className={labelClass} style={{ fontFamily: "var(--font-heading)" }}>Business Name *</label>
                  <input id="contact-business" {...register("business", { required: true })} placeholder="Acme Co." className={inputClass} style={{ fontFamily: "var(--font-body)" }} aria-required="true" aria-invalid={errors.business ? "true" : undefined} aria-describedby={errors.business ? "contact-business-error" : undefined} />
                  {errors.business && <p id="contact-business-error" role="alert" className="mt-1 text-xs text-red-400">Required</p>}
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-email" className={labelClass} style={{ fontFamily: "var(--font-heading)" }}>Email *</label>
                  <input id="contact-email" {...register("email", { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })} type="email" inputMode="email" placeholder="jane@example.com" className={inputClass} style={{ fontFamily: "var(--font-body)" }} aria-required="true" aria-invalid={errors.email ? "true" : undefined} aria-describedby={errors.email ? "contact-email-error" : undefined} />
                  {errors.email && <p id="contact-email-error" role="alert" className="mt-1 text-xs text-red-400">{errors.email.type === "pattern" ? "Enter a valid email" : "Required"}</p>}
                </div>
                <div>
                  <label htmlFor="contact-phone" className={labelClass} style={{ fontFamily: "var(--font-heading)" }}>Phone (optional)</label>
                  <input id="contact-phone" {...register("phone")} type="tel" inputMode="tel" placeholder="(707) 239-6725" className={inputClass} style={{ fontFamily: "var(--font-body)" }} />
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
                {errors.service && <p id="contact-service-error" role="alert" className="mt-1 text-xs text-red-400">Please select a service</p>}
              </div>

              <div>
                <label htmlFor="contact-message" className={labelClass} style={{ fontFamily: "var(--font-heading)" }}>Tell us more (optional)</label>
                <textarea
                  id="contact-message"
                  {...register("message")}
                  rows={4}
                  placeholder="Describe your current site, what's not working, or what you'd like to accomplish..."
                  className={inputClass}
                  style={{ fontFamily: "var(--font-body)", resize: "none" }}
                />
              </div>

              {status === "error" && (
                <div role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 p-4">
                  <p className="mb-1 text-sm font-medium text-red-300" style={{ fontFamily: "var(--font-heading)" }}>
                    Message couldn&apos;t be sent
                  </p>
                  <p className="text-sm text-red-200/80" style={{ fontFamily: "var(--font-body)" }}>
                    Please email{" "}
                    <a href="mailto:contact@copperbaytech.com" className="font-medium text-copper-bright underline">contact@copperbaytech.com</a>
                    {" "}or call{" "}
                    <a href="tel:+17072396725" className="font-medium text-copper-bright underline">(707) 239-6725</a>
                  </p>
                </div>
              )}

              <MagneticCTA
                as="button"
                type="submit"
                disabled={status === "loading"}
                className="flex w-full items-center justify-center rounded-lg bg-copper py-3.5 text-sm font-semibold text-ink-0 transition-colors duration-200 hover:bg-copper-bright disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper-bright focus-visible:ring-offset-2 focus-visible:ring-offset-ink-0"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {status === "loading" ? "Sending..." : "Send Message"}
              </MagneticCTA>

              <p className="text-center text-xs text-warm-3" style={{ fontFamily: "var(--font-body)" }}>
                We reply within one business day. No spam, no sales pressure — and
                we never share your details.
              </p>
            </form>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
