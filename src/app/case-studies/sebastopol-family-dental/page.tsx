import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowLeft, Cloud, Check } from "lucide-react";
import JsonLd, { breadcrumbSchema } from "@/components/JsonLd";

export const metadata = {
  title: "Case Study: Sebastopol Family Dental | Copper Bay Tech",
  description: "How we migrated a 12-person dental office from a local server to Google Workspace over a single weekend — zero downtime, staff up and running Monday morning.",
  alternates: { canonical: "https://copperbaytech.com/case-studies/sebastopol-family-dental" },
  openGraph: {
    title: "Case Study: Sebastopol Family Dental | Copper Bay Tech",
    description: "How we migrated a 12-person dental office from a local server to Google Workspace over a single weekend — zero downtime, staff up and running Monday morning.",
    url: "https://copperbaytech.com/case-studies/sebastopol-family-dental",
    siteName: "Copper Bay Tech",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function SebastopolFamilyDental() {
  return (
    <div className="min-h-screen bg-[#18181B] text-white">
      <JsonLd schema={breadcrumbSchema([{ name: "Home", url: "https://copperbaytech.com" }, { name: "Case Studies", url: "https://copperbaytech.com/case-studies" }, { name: "Sebastopol Family Dental" }])} />
      <Nav />

      <article className="pt-32 pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          <Link href="/case-studies" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm mb-8">
            <ArrowLeft size={14} /> All Case Studies
          </Link>

          <p className="mb-8 rounded-lg border border-zinc-700 bg-zinc-900/60 px-4 py-2.5 text-xs text-zinc-400">
            Representative example — illustrates a typical engagement and the kind of results we aim for, not a documented result for a specific named client.
          </p>

          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Cloud size={18} className="text-purple-400" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-purple-400 bg-purple-500/10">IT Support & Cloud</span>
                <p className="text-zinc-500 text-xs mt-0.5">Sebastopol, CA · 2025</p>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black leading-tight mb-4">
              Full office cloud migration for Sebastopol Family Dental — zero downtime, 12 staff up and running in a day
            </h1>
            <p className="text-zinc-400 text-lg leading-relaxed">
              Sandra&apos;s dental office had outgrown their aging local server. The fear was disruption to patients and staff who had used the same system for years. We moved everything over a weekend — nobody noticed on Monday.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-10">
            {[
              { label: "Staff trained", value: "12 people" },
              { label: "Patient care disruption", value: "Zero" },
              { label: "Migration window", value: "1 weekend" },
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
                Sebastopol Family Dental had been running their office on a local Windows Server since 2018. It handled file storage, shared calendaring, and internal communication for 12 staff — front desk, hygienists, the dentist, and billing.
              </p>
              <p className="mb-4">
                The server had started acting up. Slow boot times, occasional file-access errors, one incident where the server went offline mid-morning and the entire front desk was frozen for two hours. They had a backup drive plugged into it, but nobody had verified a restore in over a year.
              </p>
              <p>
                Sandra knew they needed to move to the cloud. The concerns: what happens to the data, how long will it take, and will the staff actually be able to use the new system.
              </p>
            </section>

            <section>
              <h2 className="text-white text-2xl font-bold mb-4">Why Google Workspace</h2>
              <p className="mb-4">
                For a 12-person dental office, Google Workspace (formerly G Suite) is the right call. It handles email, calendar, video calls, and file storage in one place, has excellent mobile apps for staff who need to check schedules from their phones, and doesn&apos;t require a server sitting in the back office.
              </p>
              <p>
                The admin controls are also strong enough for a healthcare-adjacent environment — granular sharing permissions, audit logs, and the ability to remotely wipe a device if a phone is lost.
              </p>
            </section>

            <section>
              <h2 className="text-white text-2xl font-bold mb-4">How We Did It</h2>
              <div className="space-y-4">
                {[
                  {
                    title: "Audited everything before touching anything",
                    desc: "Catalogued every file share, every shared calendar, every piece of software tied to the server. Mapped out who needed access to what, and what the migration sequence needed to be.",
                  },
                  {
                    title: "Verified the existing backup first",
                    desc: "We ran a full restore test on the backup drive before starting the migration. It worked, but there were files from 2024 missing. We caught that before the migration, not after.",
                  },
                  {
                    title: "Migrated file storage to Google Drive",
                    desc: "Used Google Workspace Migrate to move the file server contents to Google Drive, preserving folder structure and permissions. 47GB of data. Done overnight Friday.",
                  },
                  {
                    title: "Migrated calendaring and email to Google Workspace",
                    desc: "Moved all existing calendar events and email history. Staff could see their own history from day one — no clean-slate feeling.",
                  },
                  {
                    title: "Ran a hands-on staff training session Saturday afternoon",
                    desc: "Not a manual. Not a video. An hour-long in-person session with all 12 staff, covering exactly what they'd do every day — opening files, scheduling appointments, sharing documents. Questions answered in real time.",
                  },
                  {
                    title: "Kept the old server live as a fallback for two weeks",
                    desc: "We left the server on but disconnected from the network. If anyone needed a file that didn't make it, we could retrieve it. Nobody needed to.",
                  },
                  {
                    title: "Set up automated cloud backups with monthly restore tests",
                    desc: "Google Workspace backs up automatically, but we also set up a separate backup via Backupify. Restore test is built into their quarterly checklist.",
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
                Migration completed Saturday night. Monday morning, 12 staff logged in to Google Workspace. Front desk ran appointments without a hitch. Two staff members had questions — both resolved in under five minutes with a quick phone call.
              </p>
              <p className="mb-4">
                The old server was decommissioned two weeks later, once everyone was comfortable. The physical space it occupied in the back office became a storage closet.
              </p>
              <p>
                Sandra now has predictable monthly IT costs (Google Workspace Business Starter at $7/user/month), automatic backups, and a direct line to us when anything comes up. No more worrying about a server dying on a Tuesday morning.
              </p>
            </section>

            <blockquote className="border-l-2 border-orange-500 pl-6 my-8">
              <p className="text-zinc-300 text-lg italic leading-relaxed mb-4">
                &ldquo;We moved our whole office to the cloud and it was seamless. Duke handled everything — setup, staff training, the works. Our team was up and running in a day.&rdquo;
              </p>
              <footer>
                <p className="text-white font-semibold">Sandra K.</p>
                <p className="text-zinc-500 text-sm">Office Manager, Sebastopol Family Dental</p>
              </footer>
            </blockquote>

            <section>
              <h2 className="text-white text-2xl font-bold mb-4">Is Your Server Aging Out?</h2>
              <p className="mb-4 text-zinc-400">Signs you might be ready for a cloud migration:</p>
              <ul className="space-y-2 text-zinc-400">
                {[
                  "Server is more than 4–5 years old",
                  "You've had unexplained slowdowns or crashes",
                  "Your backup hasn't been tested in the last 6 months",
                  "Staff regularly work from devices that aren't on the office network",
                  "You don't know who has admin access to the server",
                  "A server failure would take your business down for hours",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-orange-400 flex-shrink-0 mt-1">·</span>{item}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div className="mt-16 rounded-2xl p-8 text-center border border-orange-500/30" style={{ background: "linear-gradient(135deg, #1C1917 0%, #18181B 100%)" }}>
            <p className="text-orange-400 text-xs font-semibold uppercase tracking-wider mb-3">Ready to ditch the server?</p>
            <h2 className="text-white text-2xl font-black mb-3">Let&apos;s plan your migration</h2>
            <p className="text-zinc-400 text-sm mb-6 max-w-md mx-auto">
              Free 30-minute consultation. We&apos;ll assess your current setup and give you a realistic migration plan.
            </p>
            <a href="/schedule" className="inline-block bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-3 rounded-full transition-colors text-sm">
              Book a Free Call
            </a>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}
