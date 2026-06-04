"use client";

import { useState } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Check, Clock, Calendar, ArrowRight, ArrowLeft } from "lucide-react";

const services = [
  { id: "website", label: "Website Design / Rebuild", icon: "🌐", duration: "45 min", desc: "Discuss your current site, goals, and what a new one would look like." },
  { id: "it-support", label: "IT Support & Setup", icon: "🖥️", duration: "30 min", desc: "Network setup, device management, cloud migration — let's scope it." },
  { id: "cybersecurity", label: "Security Audit", icon: "🔒", duration: "45 min", desc: "Walk through your current security posture and what needs attention." },
  { id: "general", label: "General Consultation", icon: "💬", duration: "30 min", desc: "Not sure what you need? We'll figure it out together." },
];

const timeSlots = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "1:00 PM", "1:30 PM",
  "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM",
  "4:00 PM", "4:30 PM",
];

function getDaysAhead(count: number) {
  const days = [];
  const now = new Date();
  let i = 0;
  while (days.length < count) {
    i++;
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    if (d.getDay() !== 0 && d.getDay() !== 6) days.push(d);
  }
  return days;
}

const availableDays = getDaysAhead(10);

function formatDay(d: Date) {
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

type Step = "service" | "datetime" | "details" | "done";

interface FormData {
  service: string;
  date: Date | null;
  time: string;
  name: string;
  business: string;
  email: string;
  phone: string;
  notes: string;
}

export default function ScheduleClient() {
  const [step, setStep] = useState<Step>("service");
  const [form, setForm] = useState<FormData>({
    service: "",
    date: null,
    time: "",
    name: "",
    business: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const selectedService = services.find(s => s.id === form.service);

  function set<K extends keyof FormData>(key: K, val: FormData[K]) {
    setForm(prev => ({ ...prev, [key]: val }));
  }

  async function handleSubmit() {
    if (!form.name || !form.email || !form.business) {
      setError("Please fill in all required fields.");
      return;
    }
    setError("");
    setSubmitting(true);

    const dateStr = form.date ? formatDay(form.date) : "";
    const message = `Consultation Request\n\nService: ${selectedService?.label}\nDate: ${dateStr}\nTime: ${form.time}\n${form.notes ? `\nNotes: ${form.notes}` : ""}`;

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          business: form.business,
          email: form.email,
          phone: form.phone,
          service: selectedService?.label ?? "Consultation",
          message,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setStep("done");
    } catch {
      setError("Something went wrong. Please try again or email us directly.");
    } finally {
      setSubmitting(false);
    }
  }

  const steps: Step[] = ["service", "datetime", "details"];
  const stepIndex = steps.indexOf(step);

  return (
    <div className="min-h-screen bg-[#18181B] text-white">
      <Nav />

      <section className="pt-32 pb-6 px-6 text-center">
        <div className="max-w-xl mx-auto">
          <span className="inline-block bg-orange-500/10 text-orange-400 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 border border-orange-500/20">
            Free · No Pressure
          </span>
          <h1 className="text-4xl sm:text-5xl font-black mb-4 leading-tight">
            Book a Free{" "}
            <span className="text-orange-400">Consultation</span>
          </h1>
          <p className="text-zinc-400 text-lg mb-8">
            30–45 minutes. We talk about your business, your tech problems, and whether we&apos;re a good fit. Zero obligation.
          </p>

          {/* Progress */}
          {step !== "done" && (
            <div className="flex items-center justify-center gap-2 mb-10">
              {["Service", "Date & Time", "Your Details"].map((label, i) => (
                <div key={label} className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${i < stepIndex ? "bg-green-500 text-white" : i === stepIndex ? "bg-orange-500 text-white" : "bg-zinc-800 text-zinc-500"}`}>
                    {i < stepIndex ? <Check size={12} /> : i + 1}
                  </div>
                  <span className={`text-xs hidden sm:inline ${i === stepIndex ? "text-white font-semibold" : "text-zinc-500"}`}>{label}</span>
                  {i < 2 && <div className={`w-8 h-px ${i < stepIndex ? "bg-green-500" : "bg-zinc-700"}`} />}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="max-w-xl mx-auto">

          {/* Step 1: Service */}
          {step === "service" && (
            <div className="space-y-3">
              <h2 className="text-white font-bold text-lg mb-4">What can we help with?</h2>
              {services.map(s => (
                <button
                  key={s.id}
                  onClick={() => { set("service", s.id); setStep("datetime"); }}
                  className={`w-full text-left rounded-2xl p-5 border transition-all ${form.service === s.id ? "border-orange-500 bg-orange-500/10" : "border-zinc-800 bg-zinc-900 hover:border-zinc-600"}`}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-2xl flex-shrink-0">{s.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-white font-semibold text-sm">{s.label}</p>
                        <span className="flex items-center gap-1 text-zinc-500 text-xs">
                          <Clock size={10} />{s.duration}
                        </span>
                      </div>
                      <p className="text-zinc-400 text-xs">{s.desc}</p>
                    </div>
                    <ArrowRight size={16} className="text-zinc-600 flex-shrink-0 mt-1" />
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Step 2: Date & Time */}
          {step === "datetime" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <button onClick={() => setStep("service")} className="text-zinc-400 hover:text-white transition-colors">
                  <ArrowLeft size={18} />
                </button>
                <h2 className="text-white font-bold text-lg">Pick a date & time</h2>
              </div>

              {selectedService && (
                <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3">
                  <span className="text-xl">{selectedService.icon}</span>
                  <div>
                    <p className="text-white text-sm font-semibold">{selectedService.label}</p>
                    <p className="text-zinc-500 text-xs flex items-center gap-1"><Clock size={10} />{selectedService.duration}</p>
                  </div>
                </div>
              )}

              <div>
                <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Calendar size={12} />Available Days (Mon–Fri)
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {availableDays.map((d, i) => (
                    <button
                      key={i}
                      onClick={() => set("date", d)}
                      className={`px-3 py-2.5 rounded-xl text-sm font-semibold transition-all border ${form.date?.toDateString() === d.toDateString() ? "bg-orange-500 border-orange-500 text-white" : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-600"}`}
                    >
                      {formatDay(d)}
                    </button>
                  ))}
                </div>
              </div>

              {form.date && (
                <div>
                  <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-3">Time (Pacific)</p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {timeSlots.map(t => (
                      <button
                        key={t}
                        onClick={() => set("time", t)}
                        className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all border ${form.time === t ? "bg-orange-500 border-orange-500 text-white" : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-600"}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                disabled={!form.date || !form.time}
                onClick={() => setStep("details")}
                className="w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-full transition-colors text-sm"
              >
                Continue <ArrowRight size={15} className="inline ml-1" />
              </button>
            </div>
          )}

          {/* Step 3: Details */}
          {step === "details" && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 mb-2">
                <button onClick={() => setStep("datetime")} className="text-zinc-400 hover:text-white transition-colors">
                  <ArrowLeft size={18} />
                </button>
                <h2 className="text-white font-bold text-lg">Your details</h2>
              </div>

              {/* Booking summary */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 space-y-1">
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <span className="text-orange-400 font-semibold">{selectedService?.icon} {selectedService?.label}</span>
                  <span>·</span>
                  <span>{form.date ? formatDay(form.date) : ""} at {form.time}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1"><Clock size={10} />{selectedService?.duration}</span>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider block mb-2">Your Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => set("name", e.target.value)}
                    placeholder="Jane Smith"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider block mb-2">Business Name *</label>
                  <input
                    type="text"
                    value={form.business}
                    onChange={e => set("business", e.target.value)}
                    placeholder="Acme Plumbing"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider block mb-2">Email *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => set("email", e.target.value)}
                    placeholder="jane@business.com"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider block mb-2">Phone (optional)</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => set("phone", e.target.value)}
                    placeholder="(707) 555-0100"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider block mb-2">Anything we should know? (optional)</label>
                <textarea
                  value={form.notes}
                  onChange={e => set("notes", e.target.value)}
                  placeholder="Brief description of your situation, current setup, biggest pain points…"
                  rows={3}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors text-sm resize-none"
                />
              </div>

              {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{error}</p>}

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white font-bold py-4 rounded-full transition-colors text-sm"
              >
                {submitting ? "Booking…" : "Confirm Consultation Request"}
              </button>
              <p className="text-zinc-600 text-xs text-center">
                We&apos;ll confirm your time by email within a few hours. A Zoom or phone call link will be included.
              </p>
            </div>
          )}

          {/* Done */}
          {step === "done" && (
            <div className="text-center py-16 space-y-5">
              <div className="w-20 h-20 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto">
                <Check size={36} className="text-green-400" />
              </div>
              <h2 className="text-white text-2xl font-black">You&apos;re booked!</h2>
              <p className="text-zinc-400 max-w-sm mx-auto text-sm leading-relaxed">
                Your request for <span className="text-orange-400 font-semibold">{selectedService?.label}</span> on{" "}
                <span className="text-white font-semibold">{form.date ? formatDay(form.date) : ""} at {form.time}</span> has been received.
                We&apos;ll send a confirmation with a Zoom link to <span className="text-white">{form.email}</span> within a few hours.
              </p>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-left max-w-sm mx-auto space-y-2 mt-6">
                <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-3">Booking Summary</p>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Service</span>
                  <span className="text-white font-semibold">{selectedService?.label}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Date</span>
                  <span className="text-white font-semibold">{form.date ? formatDay(form.date) : ""}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Time</span>
                  <span className="text-white font-semibold">{form.time} Pacific</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Duration</span>
                  <span className="text-white font-semibold">{selectedService?.duration}</span>
                </div>
              </div>
              <Link href="/" className="inline-block mt-4 text-orange-400 text-sm hover:text-orange-300 transition-colors font-semibold">
                ← Back to home
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
