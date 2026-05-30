"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldAlert, AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";

const risks = [
  { icon: AlertTriangle, color: "#DC2626", bg: "bg-red-500/10", label: "High Risk", desc: "Multiple critical vulnerabilities — act now" },
  { icon: ShieldAlert, color: "#F97316", bg: "bg-orange-500/10", label: "Moderate Risk", desc: "Real gaps that need targeted fixes" },
  { icon: CheckCircle, color: "#16A34A", bg: "bg-green-500/10", label: "Low Risk", desc: "Good posture with room to improve" },
];

export default function AssessmentTeaser() {
  return (
    <section id="assessment" className="py-24 bg-[#18181B]">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: copy */}
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
              Free Self-Assessment
            </p>
            <h2
              className="text-4xl font-bold text-white mb-4 leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              How exposed is your business?
            </h2>
            <p
              className="text-white/60 text-lg mb-6 leading-relaxed"
              style={{ fontFamily: "var(--font-body)" }}
            >
              6 questions. 2 minutes. Get a scored risk assessment of your current
              IT setup — plus a personalized action plan sent to your inbox.
            </p>
            <ul className="space-y-2 mb-8">
              {["Passwords & access management", "Network & firewall status", "Backup & recovery readiness", "Website & online presence", "Software update hygiene", "Employee offboarding"].map(item => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-white/60" style={{ fontFamily: "var(--font-body)" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/assessment"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-semibold text-[#18181B] bg-[#F97316] hover:bg-[#ea6c0a] transition-colors"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Take the Free Assessment <ArrowRight size={15} />
            </Link>
          </motion.div>

          {/* Right: risk level preview cards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-3"
          >
            {risks.map((r, i) => (
              <motion.div
                key={r.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl px-5 py-4"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${r.bg}`}>
                  <r.icon size={18} color={r.color} />
                </div>
                <div>
                  <p className="text-white font-bold text-sm" style={{ fontFamily: "var(--font-heading)" }}>{r.label}</p>
                  <p className="text-white/50 text-xs" style={{ fontFamily: "var(--font-body)" }}>{r.desc}</p>
                </div>
              </motion.div>
            ))}
            <p className="text-white/30 text-xs text-center pt-2" style={{ fontFamily: "var(--font-body)" }}>
              Your result is calculated from 6 real-world questions about your current setup
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
