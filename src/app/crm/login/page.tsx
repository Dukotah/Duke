"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const H = { fontFamily: "var(--font-heading)" };

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [quickLoading, setQuickLoading] = useState<"admin" | "rep" | null>(null);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/crm/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const d = await res.json();
      if (res.ok) {
        router.push(d.role === "admin" ? "/crm/admin" : "/crm");
      } else {
        setError(d.error ?? "Invalid credentials");
        setSubmitting(false);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  async function quickEnter(role: "admin" | "rep") {
    setQuickLoading(role);
    setError("");
    const res = await fetch("/api/crm/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    if (res.ok) {
      router.push(role === "admin" ? "/crm/admin" : "/crm");
    } else {
      setQuickLoading(null);
      setError("Quick access unavailable");
    }
  }

  const busy = submitting || !!quickLoading;

  return (
    <div className="min-h-screen flex items-center justify-center crm-backdrop p-6">
      <div className="w-full max-w-xs crm-rise">

        {/* Logo */}
        <div className="text-center mb-10">
          <p className="text-[28px] font-bold tracking-tight text-[var(--crm-text)]" style={H}>
            Copper Bay<span className="text-[var(--crm-accent-text)]">Tech</span>
          </p>
          <p className="text-sm font-medium text-[var(--crm-text-3)] mt-1.5 tracking-wide" style={H}>Sales CRM</p>
        </div>

        {/* Sign-in form */}
        <form onSubmit={signIn} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-[var(--crm-text-3)] uppercase tracking-wider mb-1.5" style={H}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              placeholder="you@copperbaytech.com"
              className="w-full px-4 py-3 rounded-xl bg-[var(--crm-surface)] border border-[var(--crm-border)] text-sm text-[var(--crm-text)] placeholder-[var(--crm-text-3)] focus:outline-none focus:border-[var(--crm-accent-border)] transition-colors"
              style={H}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--crm-text-3)] uppercase tracking-wider mb-1.5" style={H}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="Your password"
              className="w-full px-4 py-3 rounded-xl bg-[var(--crm-surface)] border border-[var(--crm-border)] text-sm text-[var(--crm-text)] placeholder-[var(--crm-text-3)] focus:outline-none focus:border-[var(--crm-accent-border)] transition-colors"
              style={H}
            />
          </div>

          {error && <p className="text-sm text-red-400 px-1" style={H}>{error}</p>}

          <button
            type="submit"
            disabled={busy || !email || !password}
            className="crm-glow-brand w-full py-3.5 rounded-xl text-sm font-bold text-white bg-[var(--crm-accent)] transition-all active:scale-[0.98] hover:brightness-110 disabled:opacity-40 disabled:hover:brightness-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--crm-accent-border)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--crm-bg)]"
            style={H}
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-[var(--crm-border)]" />
          <span className="text-xs text-[var(--crm-text-3)]" style={H}>or quick access</span>
          <div className="flex-1 h-px bg-[var(--crm-border)]" />
        </div>

        {/* Quick-access buttons (no password) */}
        <div className="space-y-3">
          <button
            onClick={() => quickEnter("admin")}
            disabled={busy}
            className="w-full flex items-center justify-between px-6 py-4 rounded-2xl border border-[var(--crm-accent-border)] bg-[var(--crm-accent-weak)] hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-50"
            style={H}
          >
            <div className="text-left">
              <p className="text-sm font-bold text-[var(--crm-text)]">Admin</p>
              <p className="text-xs text-[var(--crm-text-3)] mt-0.5">Full access · Duke</p>
            </div>
            <span className="text-xl">{quickLoading === "admin" ? "⏳" : "👑"}</span>
          </button>

          <button
            onClick={() => quickEnter("rep")}
            disabled={busy}
            className="w-full flex items-center justify-between px-6 py-4 rounded-2xl border border-[var(--crm-border)] bg-[var(--crm-surface)] hover:bg-[var(--crm-surface-3)] active:scale-[0.98] transition-all disabled:opacity-50"
            style={H}
          >
            <div className="text-left">
              <p className="text-sm font-bold text-[var(--crm-text)]">Sales Rep</p>
              <p className="text-xs text-[var(--crm-text-3)] mt-0.5">Shared demo workspace</p>
            </div>
            <span className="text-xl">{quickLoading === "rep" ? "⏳" : "📞"}</span>
          </button>
        </div>

        <p className="text-center text-xs text-[var(--crm-text-3)] mt-8" style={H}>
          Agents: sign in with the email & password your admin created for you.
        </p>
      </div>
    </div>
  );
}
