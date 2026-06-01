"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const H = { fontFamily: "var(--font-heading)" };

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<"admin" | "rep" | null>(null);

  async function enter(role: "admin" | "rep") {
    setLoading(role);
    const res = await fetch("/api/crm/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    if (res.ok) {
      router.push(role === "admin" ? "/crm/admin" : "/crm");
    } else {
      setLoading(null);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111113] p-6">
      <div className="w-full max-w-xs">

        {/* Logo */}
        <div className="text-center mb-10">
          <p className="text-2xl font-bold tracking-tight text-white" style={H}>
            Copper Bay<span style={{ color: "#F97316" }}>Tech</span>
          </p>
          <p className="text-sm text-white/30 mt-1" style={H}>Sales CRM</p>
        </div>

        <div className="space-y-3">
          {/* Admin */}
          <button
            onClick={() => enter("admin")}
            disabled={!!loading}
            className="w-full flex items-center justify-between px-6 py-5 rounded-2xl border border-[#F97316]/30 bg-[#F97316]/10 hover:bg-[#F97316]/20 active:scale-[0.98] transition-all disabled:opacity-50"
            style={H}
          >
            <div className="text-left">
              <p className="text-base font-bold text-white">Admin</p>
              <p className="text-xs text-white/40 mt-0.5">Full access · Duke</p>
            </div>
            <span className="text-2xl">{loading === "admin" ? "⏳" : "👑"}</span>
          </button>

          {/* Rep */}
          <button
            onClick={() => enter("rep")}
            disabled={!!loading}
            className="w-full flex items-center justify-between px-6 py-5 rounded-2xl border border-white/10 bg-[#1C1C1F] hover:bg-white/5 active:scale-[0.98] transition-all disabled:opacity-50"
            style={H}
          >
            <div className="text-left">
              <p className="text-base font-bold text-white">Sales Rep</p>
              <p className="text-xs text-white/40 mt-0.5">Call queue · pipeline · earnings</p>
            </div>
            <span className="text-2xl">{loading === "rep" ? "⏳" : "📞"}</span>
          </button>
        </div>

        <p className="text-center text-xs text-white/15 mt-8" style={H}>
          Login will be added before launch
        </p>
      </div>
    </div>
  );
}
