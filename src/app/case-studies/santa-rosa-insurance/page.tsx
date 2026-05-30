import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Check } from "lucide-react";

export const metadata = {
  title: "Case Study: Santa Rosa Insurance Group | Copper Bay Tech",
  description: "How a security audit found two critical vulnerabilities at a Santa Rosa insurance firm — and got them fixed the same day.",
};

export default function SantaRosaInsurance() {
  return (
    <div className="min-h-screen bg-[#18181B] text-white">
      <Nav />

      <article className="pt-32 pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          <Link href="/case-studies" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm mb-8">
            <ArrowLeft size={14} /> All Case Studies
          </Link>

          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                <ShieldCheck size={18} className="text-red-400" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-red-400 bg-red-500/10">Cybersecurity</span>
                <p className="text-zinc-500 text-xs mt-0.5">Santa Rosa, CA · 2025</p>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black leading-tight mb-4">
              Security audit finds two critical vulnerabilities at Santa Rosa Insurance Group — fixed same day
            </h1>
            <p className="text-zinc-400 text-lg leading-relaxed">
              James had no real sense of his firm&apos;s security posture. The router was years old, nobody knew the firmware version, and staff were reusing passwords. We found the problems and closed them before anything went wrong.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-10">
            {[
              { label: "Vulnerabilities found", value: "2 critical" },
              { label: "Time to fix", value: "Same day" },
              { label: "Firmware out of date", value: "4 years" },
            ].map((m, i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                <p className="text-zinc-500 text-[10px] uppercase tracking-wider mb-2">{m.label}</p>
                <p className="text-orange-400 text-xl font-black">{m.value}</p>
              </div>
            ))}
          </div>

          <div className="space-y-10 text-zinc-300 leading-relaxed">
            <section>
              <h2 className="text-white text-2xl font-bold mb-4">The Situation</h2>
              <p className="mb-4">
                James ran a five-person insurance practice in Santa Rosa. They handled sensitive client financial data daily — policy information, income records, personal identifiers. They had been in business for eleven years and, like most small firms, had never had a security review.
              </p>
              <p className="mb-4">
                He reached out after reading about a ransomware attack on a similar-sized firm in the Bay Area. His main concern: &ldquo;I have no idea what shape we&apos;re actually in.&rdquo;
              </p>
              <p>
                That&apos;s the right thing to be concerned about. Not knowing is the most dangerous position to be in.
              </p>
            </section>

            <section>
              <h2 className="text-white text-2xl font-bold mb-4">What We Found</h2>
              <div className="space-y-3 mb-6">
                {[
                  {
                    severity: "Critical",
                    color: "text-red-400 bg-red-500/10 border-red-500/20",
                    title: "Two open inbound ports on the router",
                    desc: "Ports 23 (Telnet) and 8080 (HTTP admin) were open to the public internet — both enabled by an old ISP technician and never closed. Either could allow an attacker to attempt to access the router admin panel.",
                  },
                  {
                    severity: "Critical",
                    color: "text-red-400 bg-red-500/10 border-red-500/20",
                    title: "Router firmware 4 years out of date",
                    desc: "The router model had 14 known CVEs (Common Vulnerabilities and Exposures) filed against it in that 4-year window. Three of them were rated 9.8/10 severity.",
                  },
                  {
                    severity: "High",
                    color: "text-orange-400 bg-orange-500/10 border-orange-500/20",
                    title: "Shared passwords on business-critical tools",
                    desc: "Three staff members shared a single login for the agency management system. No individual accountability, and a single compromised credential meant full access for an attacker.",
                  },
                  {
                    severity: "Medium",
                    color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
                    title: "No MFA on email or cloud storage",
                    desc: "Business email and Google Drive had no multi-factor authentication. A phishing attack on any staff member would give full access to five years of client data.",
                  },
                ].map((finding, i) => (
                  <div key={i} className={`rounded-xl border p-5 ${finding.color.split(" ").slice(1).join(" ")}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${finding.color}`}>{finding.severity}</span>
                      <p className="text-white font-semibold text-sm">{finding.title}</p>
                    </div>
                    <p className="text-zinc-400 text-sm">{finding.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-white text-2xl font-bold mb-4">What We Did</h2>
              <div className="space-y-4">
                {[
                  {
                    title: "Closed both open ports immediately",
                    desc: "Accessed the router admin panel, closed ports 23 and 8080, confirmed with a port scan from an external IP.",
                  },
                  {
                    title: "Updated router firmware",
                    desc: "Upgraded from 2021 firmware to the current release. All 14 known CVEs patched. Took 12 minutes.",
                  },
                  {
                    title: "Migrated agency system to individual logins",
                    desc: "Worked with the software vendor to provision individual accounts for each staff member. Shared login deactivated.",
                  },
                  {
                    title: "Deployed 1Password for the team",
                    desc: "Set up a team password manager, migrated existing credentials, and trained staff in a 45-minute lunch session.",
                  },
                  {
                    title: "Enabled MFA on all critical accounts",
                    desc: "Google Workspace, agency management system, and cloud storage all got MFA enforced at the admin level — not optional for anyone.",
                  },
                  {
                    title: "Delivered a written security summary and quarterly checklist",
                    desc: "James has a documented baseline for what was done, what was found, and a simple checklist to maintain security going forward.",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                    <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check size={12} className="text-orange-400" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm mb-1">{item.title}</p>
                      <p className="text-zinc-400 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-white text-2xl font-bold mb-4">The Outcome</h2>
              <p className="mb-4">
                The critical vulnerabilities were resolved within three hours of the initial audit — same afternoon we arrived. The firmware update and port closures took less than 20 minutes; the rest of the day was spent on MFA rollout and password manager setup.
              </p>
              <p className="mb-4">
                James now has a documented security baseline. He knows exactly what his firm&apos;s exposure was, what was done to address it, and what the maintenance routine looks like going forward. We check in quarterly.
              </p>
              <p>
                More importantly: nothing bad happened. That&apos;s the point. The best IT security story is one with no incident.
              </p>
            </section>

            <blockquote className="border-l-2 border-orange-500 pl-6 my-8">
              <p className="text-zinc-300 text-lg italic leading-relaxed mb-4">
                &ldquo;I had no idea how exposed we were until they ran a security audit. They found two open ports and outdated firmware on our router that we&apos;d had for years. Fixed it same day, no drama.&rdquo;
              </p>
              <footer>
                <p className="text-white font-semibold">James R.</p>
                <p className="text-zinc-500 text-sm">Principal, Santa Rosa Insurance Group</p>
              </footer>
            </blockquote>

            <section>
              <h2 className="text-white text-2xl font-bold mb-4">What a Security Audit Includes</h2>
              <p className="mb-4 text-zinc-400">Every audit we run covers:</p>
              <ul className="space-y-2 text-zinc-400">
                {[
                  "External port scan — what's exposed to the public internet",
                  "Router and switch firmware version check",
                  "WiFi security configuration (WPA3, network segmentation)",
                  "Access control review — who has access to what, and why",
                  "Password hygiene and password manager assessment",
                  "MFA status across all critical accounts",
                  "Email authentication (SPF, DKIM, DMARC) configuration",
                  "Endpoint protection — antivirus, disk encryption status",
                  "Backup verification — does it actually work?",
                  "Written remediation report with severity ratings",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-orange-400 flex-shrink-0 mt-1">·</span>{item}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div className="mt-16 rounded-2xl p-8 text-center border border-orange-500/30" style={{ background: "linear-gradient(135deg, #1C1917 0%, #18181B 100%)" }}>
            <p className="text-orange-400 text-xs font-semibold uppercase tracking-wider mb-3">Do you know your exposure?</p>
            <h2 className="text-white text-2xl font-black mb-3">Book a security audit</h2>
            <p className="text-zinc-400 text-sm mb-6 max-w-md mx-auto">
              Half-day on-site audit for small businesses in Sonoma County. Written report included.
            </p>
            <a href="/schedule" className="inline-block bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-3 rounded-full transition-colors text-sm">
              Book a Free Consultation
            </a>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}
