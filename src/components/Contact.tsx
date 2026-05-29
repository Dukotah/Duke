"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Phone, Mail, Clock } from "lucide-react";

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
    "w-full px-4 py-3 rounded-md border border-[#1C3A5E]/15 bg-white text-[#1A1A1A] text-sm focus:outline-none focus:ring-2 focus:ring-[#1C3A5E]/30 transition placeholder-[#1A1A1A]/30";

  const labelClass = "block text-xs font-semibold uppercase tracking-widest text-[#1C3A5E]/60 mb-1.5";

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
              className="text-xs font-semibold uppercase tracking-widest text-[#C8A96E] mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Get in touch
            </p>
            <h2
              className="text-4xl font-bold text-[#1C3A5E] mb-6 leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Let&apos;s talk about what&apos;s holding your business back.
            </h2>
            <p
              className="text-[#1A1A1A]/60 leading-relaxed mb-10"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Tell us what you&apos;re working with. We&apos;ll give you an honest assessment
              and a clear path forward — no fluff, no pressure.
            </p>

            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "rgba(28,58,94,0.08)" }}
                >
                  <Phone size={16} color="#1C3A5E" />
                </div>
                <div>
                  <p
                    className="text-xs text-[#1A1A1A]/40 uppercase tracking-widest"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Phone / Text
                  </p>
                  <a
                    href="tel:+17075550100"
                    className="text-sm font-medium text-[#1C3A5E] hover:underline"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    (707) 555-0100
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "rgba(28,58,94,0.08)" }}
                >
                  <Mail size={16} color="#1C3A5E" />
                </div>
                <div>
                  <p
                    className="text-xs text-[#1A1A1A]/40 uppercase tracking-widest"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Email
                  </p>
                  <a
                    href="mailto:duke@copperbaytech.com"
                    className="text-sm font-medium text-[#1C3A5E] hover:underline"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    duke@copperbaytech.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "rgba(28,58,94,0.08)" }}
                >
                  <Clock size={16} color="#1C3A5E" />
                </div>
                <div>
                  <p
                    className="text-xs text-[#1A1A1A]/40 uppercase tracking-widest"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Response Time
                  </p>
                  <p
                    className="text-sm font-medium text-[#1C3A5E]"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Within one business day
                  </p>
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
            {status === "success" ? (
              <div className="h-full flex items-center justify-center rounded-2xl bg-[#F5F4F0] p-12 text-center">
                <div>
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: "rgba(45,106,79,0.12)" }}
                  >
                    <span className="text-2xl">✓</span>
                  </div>
                  <h3
                    className="text-xl font-bold text-[#1C3A5E] mb-2"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Message received
                  </h3>
                  <p
                    className="text-[#1A1A1A]/60 text-sm"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    We&apos;ll be in touch within one business day.
                  </p>
                </div>
              </div>
            ) : (
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
                      Phone (optional)
                    </label>
                    <input
                      {...register("phone")}
                      type="tel"
                      placeholder="(707) 555-0000"
                      className={inputClass}
                      style={{ fontFamily: "var(--font-body)" }}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass} style={{ fontFamily: "var(--font-heading)" }}>
                    What can we help with? *
                  </label>
                  <select
                    {...register("service", { required: true })}
                    className={inputClass}
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    <option value="">Select a service...</option>
                    <option value="website">Website Design & Development</option>
                    <option value="it-support">IT Support & Networking</option>
                    <option value="automation">Process Automation</option>
                    <option value="cybersecurity">Cybersecurity Audit</option>
                    <option value="custom-dev">Custom Web Application</option>
                    <option value="other">Not sure — I need advice</option>
                  </select>
                  {errors.service && (
                    <p className="text-red-500 text-xs mt-1">Please select a service</p>
                  )}
                </div>

                <div>
                  <label className={labelClass} style={{ fontFamily: "var(--font-heading)" }}>
                    Tell us more (optional)
                  </label>
                  <textarea
                    {...register("message")}
                    rows={4}
                    placeholder="Describe your situation, current setup, or what you'd like to accomplish..."
                    className={inputClass}
                    style={{ fontFamily: "var(--font-body)", resize: "none" }}
                  />
                </div>

                {status === "error" && (
                  <p className="text-red-500 text-sm">
                    Something went wrong. Please email us directly at duke@copperbaytech.com
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-3.5 rounded-md text-sm font-semibold text-white transition-colors disabled:opacity-60"
                  style={{
                    backgroundColor: "#2D6A4F",
                    fontFamily: "var(--font-heading)",
                  }}
                  onMouseEnter={(e) => {
                    if (status !== "loading")
                      e.currentTarget.style.backgroundColor = "#235540";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#2D6A4F";
                  }}
                >
                  {status === "loading" ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
