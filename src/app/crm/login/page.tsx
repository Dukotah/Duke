"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get("from") ?? "/crm";
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/crm/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push(from);
    } else {
      const data = await res.json();
      setError(data.error ?? "Invalid password");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#18181B]">
      <div className="w-full max-w-sm mx-4">
        <div className="mb-8 text-center">
          <span className="text-2xl font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)", color: "#FAFAF9" }}>
            Copper Bay<span style={{ color: "#F97316" }}>Tech</span>
          </span>
          <p className="mt-2 text-sm text-white/40" style={{ fontFamily: "var(--font-heading)" }}>
            CRM — Private Access
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#27272A] rounded-xl border border-white/10 p-8 flex flex-col gap-4"
        >
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              required
              className="w-full px-4 py-3 rounded-lg bg-[#18181B] border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#F97316] transition-colors"
              style={{ fontFamily: "var(--font-heading)" }}
              placeholder="Enter your CRM password"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 text-center" style={{ fontFamily: "var(--font-heading)" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-3 rounded-lg text-sm font-semibold text-white transition-all disabled:opacity-40"
            style={{ backgroundColor: "#F97316", fontFamily: "var(--font-heading)" }}
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
