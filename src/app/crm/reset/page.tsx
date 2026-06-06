"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const H = { fontFamily: "var(--font-heading)" };

function ResetContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // If a token is present in the URL, we're in the confirm flow.
  const isConfirm = Boolean(token);

  async function requestReset(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      await fetch("/api/crm/reset-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      // Always show success — avoid email enumeration.
      setStatus("sent");
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again.");
    }
  }

  async function confirmReset(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setErrorMsg("Passwords don't match.");
      return;
    }
    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters.");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/crm/reset-confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      if (res.ok) {
        setStatus("done");
        setTimeout(() => router.push("/crm/login"), 2000);
      } else {
        const d = await res.json();
        setStatus("error");
        setErrorMsg(d.error ?? "Link expired. Request a new one.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center crm-backdrop p-6">
      <div className="w-full max-w-xs crm-rise">

        <div className="text-center mb-10">
          <p className="text-[28px] font-bold tracking-tight text-white" style={H}>
            Copper Bay<span className="text-[#F97316]">Tech</span>
          </p>
          <p className="text-sm font-medium text-white/35 mt-1.5 tracking-wide" style={H}>
            {isConfirm ? "Set new password" : "Reset password"}
          </p>
        </div>

        {status === "sent" && (
          <div className="text-center space-y-4">
            <p className="text-4xl">📬</p>
            <p className="text-sm text-white/70" style={H}>
              If that email is in our system, a reset link is on its way. Check your inbox.
            </p>
            <button onClick={() => router.push("/crm/login")}
              className="text-sm text-[#F97316] hover:text-[#F97316]/80 transition-colors" style={H}>
              ← Back to sign in
            </button>
          </div>
        )}

        {status === "done" && (
          <div className="text-center space-y-4">
            <p className="text-4xl">✅</p>
            <p className="text-sm text-white/70" style={H}>Password updated. Redirecting…</p>
          </div>
        )}

        {(status === "idle" || status === "loading" || status === "error") && !isConfirm && (
          <form onSubmit={requestReset} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5" style={H}>
                Your email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@copperbaytech.com"
                required
                className="w-full px-4 py-3 rounded-xl bg-[#1C1C1F] border border-white/10 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#F97316]/50 transition-colors"
                style={H}
              />
            </div>
            {errorMsg && <p className="text-sm text-red-400 px-1" style={H}>{errorMsg}</p>}
            <button
              type="submit"
              disabled={status === "loading" || !email}
              className="crm-glow-brand w-full py-3.5 rounded-xl text-sm font-bold text-white bg-[#F97316] transition-all active:scale-[0.98] hover:brightness-110 disabled:opacity-40"
              style={H}
            >
              {status === "loading" ? "Sending…" : "Send reset link"}
            </button>
            <div className="text-center pt-2">
              <button type="button" onClick={() => router.push("/crm/login")}
                className="text-xs text-white/30 hover:text-white/60 transition-colors" style={H}>
                ← Back to sign in
              </button>
            </div>
          </form>
        )}

        {(status === "idle" || status === "loading" || status === "error") && isConfirm && (
          <form onSubmit={confirmReset} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5" style={H}>
                New password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="8+ characters"
                required
                minLength={8}
                className="w-full px-4 py-3 rounded-xl bg-[#1C1C1F] border border-white/10 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#F97316]/50 transition-colors"
                style={H}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5" style={H}>
                Confirm password
              </label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Same password again"
                required
                className="w-full px-4 py-3 rounded-xl bg-[#1C1C1F] border border-white/10 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#F97316]/50 transition-colors"
                style={H}
              />
            </div>
            {errorMsg && <p className="text-sm text-red-400 px-1" style={H}>{errorMsg}</p>}
            <button
              type="submit"
              disabled={status === "loading" || !password || !confirm}
              className="crm-glow-brand w-full py-3.5 rounded-xl text-sm font-bold text-white bg-[#F97316] transition-all active:scale-[0.98] hover:brightness-110 disabled:opacity-40"
              style={H}
            >
              {status === "loading" ? "Saving…" : "Set new password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center crm-backdrop">
        <div className="w-7 h-7 border-2 border-[#F97316] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ResetContent />
    </Suspense>
  );
}
