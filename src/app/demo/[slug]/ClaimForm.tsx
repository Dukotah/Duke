"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function ClaimForm({ slug, businessName }: { slug: string; businessName: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/demo/${slug}/claim`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), phone: phone.trim() }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error((d as { error?: string }).error ?? "Something went wrong");
      }
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong — please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "rgba(249,115,22,0.15)" }}
        >
          <CheckCircle2 size={32} color="#F97316" />
        </div>
        <h3
          className="text-2xl font-bold text-white"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          You&apos;re on the list.
        </h3>
        <p className="text-white/60 max-w-sm" style={{ fontFamily: "var(--font-body)" }}>
          We&apos;ll reach out within one business day to go over the site and next steps.
          No pressure, no commitment.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Your Name *
          </label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Smith"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-[#F97316]/50 transition-colors"
            style={{ fontFamily: "var(--font-body)" }}
          />
        </div>
        <div>
          <label
            className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Email Address *
          </label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@yourbusiness.com"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-[#F97316]/50 transition-colors"
            style={{ fontFamily: "var(--font-body)" }}
          />
        </div>
      </div>
      <div>
        <label
          className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Phone <span className="text-white/30 font-normal normal-case">(optional)</span>
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="(707) 555-0100"
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-[#F97316]/50 transition-colors"
          style={{ fontFamily: "var(--font-body)" }}
        />
      </div>

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading || !name.trim() || !email.trim()}
        className="w-full py-4 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-opacity disabled:opacity-40"
        style={{ backgroundColor: "#F97316", fontFamily: "var(--font-heading)" }}
      >
        {loading ? "Sending…" : <>Claim the {businessName} site <ArrowRight size={16} /></>}
      </button>

      <p
        className="text-xs text-center text-white/30"
        style={{ fontFamily: "var(--font-body)" }}
      >
        No spam. No commitment. One quick call and we&apos;ll show you the full build.
      </p>
    </form>
  );
}
