import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Is My Small Business Website HIPAA Compliant? | Copper Bay Tech",
  description: "If your business collects patient info online, HIPAA applies. Here is a plain-English checklist.",
};

const checks = [
  { item: "Contact forms use HTTPS (encrypted)", what: "Check your site URL starts with https://. Any form collecting health info must be encrypted in transit." },
  { item: "Form submissions are not stored in plain text", what: "Some form plugins log submissions unencrypted. Any field that could contain health info needs encrypted storage." },
  { item: "Third-party tools (analytics, chat) have BAAs", what: "Tools like Google Analytics may store data on their servers. You may need Business Associate Agreements with these vendors." },
  { item: "Your hosting provider signs a BAA", what: "Your web host stores your site data. Under HIPAA they need to sign a Business Associate Agreement. Ask yours if they offer this." },
  { item: "Website logins use strong, unique credentials + 2FA", what: "Shared CMS logins are a HIPAA problem. Use unique passwords and enable two-factor authentication." },
  { item: "Privacy policy covers health data handling", what: "Your privacy policy should specifically address when health info is collected, how it is stored, and who can access it." },
];

export default function Article() {
  return (
    <>
      <Nav />
      <main>
        <section className="pt-32 pb-8 bg-[#18181B]">
          <div className="max-w-2xl mx-auto px-6">
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 mb-8 transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
              <ArrowLeft size={14} /> All Resources
            </Link>
            <span className="inline-block mb-4 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-widest" style={{ backgroundColor: "rgba(249,115,22,0.15)", color: "#F97316", fontFamily: "var(--font-heading)" }}>
              Cybersecurity
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
              Is My Small Business Website HIPAA Compliant? A Plain-English Checklist
            </h1>
            <p className="text-white/50 text-sm" style={{ fontFamily: "var(--font-body)" }}>6 min read &middot; April 2026</p>
          </div>
        </section>
        <section className="py-12 bg-white">
          <div className="max-w-2xl mx-auto px-6">
            <p className="text-lg text-[#3F3F46]/70 mb-8 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
              HIPAA applies to dentists, therapists, chiropractors, optometrists, and any practice whose website collects appointment requests or health-related info. This checklist helps you identify the gaps.
            </p>
            <h2 className="text-2xl font-bold text-[#18181B] mt-8 mb-6" style={{ fontFamily: "var(--font-heading)" }}>The checklist</h2>
            <div className="space-y-4 mb-10">
              {checks.map((c, i) => (
                <div key={i} className="rounded-xl border border-[#18181B]/10 p-5 bg-[#FAFAF9]">
                  <div className="flex items-start gap-3 mb-2">
                    <CheckCircle size={16} className="flex-shrink-0 mt-0.5" color="#16A34A" />
                    <p className="text-sm font-semibold text-[#18181B]" style={{ fontFamily: "var(--font-heading)" }}>{c.item}</p>
                  </div>
                  <p className="text-sm text-[#3F3F46]/60 pl-7 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{c.what}</p>
                </div>
              ))}
            </div>
            <div className="p-5 rounded-xl bg-[#FFF7ED] border border-[#F97316]/20 text-sm text-[#3F3F46]/60" style={{ fontFamily: "var(--font-body)" }}>
              <strong className="text-[#18181B]">Note:</strong> This is not legal advice. HIPAA compliance is complex and fact-specific. Work with a qualified attorney alongside your technical team.
            </div>
            <div className="mt-10 pt-8 border-t border-[#18181B]/10 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-[#3F3F46]/50 hover:text-[#18181B] transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
                <ArrowLeft size={14} /> Back to Resources
              </Link>
              <Link href="/#contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-semibold text-white bg-[#F97316] hover:bg-[#ea6c0a] transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
                Get a Security Review <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
