"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get("from") ?? "/crm";
  const [email, setEmail] = useState("");
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
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      const data = await res.json();
      router.push(data.role === "admin" ? "/crm/admin" : from);
    } else {
      const data = await res.json();
      setError(data.error ?? "Invalid credentials");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111113]">
      <div className="w-full max-w-sm mx-4">
        <div className="mb-8 text-center">
          <span className="text-2xl font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)", color: "#FAFAF9" }}>
            Copper Bay<span style={{ color: "#F97316" }}>Tech</span>
          </span>
          <p className="mt-2 text-sm text-white/35" style={{ fontFamily: "var(--font-heading)" }}>
            Sales CRM — Sign In
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#1C1C1F] rounded-2xl border border-white/[0.06] p-8 flex flex-col gap-4">
          {[
            { id: "email", label: "Email", type: "email", value: email, set: setEmail, placeholder: "you@example.com" },
            { id: "password", label: "Password", type: "password", value: password, set: setPassword, placeholder: "••••••••" },
          ].map(({ id, label, type, value, set, placeholder }) => (
            <div key={id}>
              <label htmlFor={id} className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                {label}
              </label>
              <input
                id={id} type={type} value={value} required autoFocus={id === "email"}
                onChange={(e) => set(e.target.value)}
                placeholder={placeholder}
                className="w-full px-4 py-3 rounded-xl bg-[#111113] border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#F97316]/50 transition-colors"
                style={{ fontFamily: "var(--font-heading)" }}
              />
            </div>
          ))}

          {error && <p className="text-sm text-red-400 text-center" style={{ fontFamily: "var(--font-heading)" }}>{error}</p>}

          <button
            type="submit" disabled={loading || !email || !password}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40 mt-1"
            style={{ backgroundColor: "#F97316", fontFamily: "var(--font-heading)" }}
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="text-center text-xs text-white/20 mt-4" style={{ fontFamily: "var(--font-heading)" }}>
          Contact your manager for access
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>;
}
