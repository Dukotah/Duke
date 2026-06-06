import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ArrowLeft, ArrowRight } from "lucide-react";
import JsonLd, { blogPostingSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "How to Back Up Your Small Business Data (The Right Way) | Copper Bay Tech",
  description:
    "Most small business backups fail when they're actually needed. The 3-2-1 rule, cloud vs. local, and how to know your backups will actually work.",
  alternates: { canonical: "https://copperbaytech.com/blog/how-to-back-up-your-small-business-data" },
  openGraph: {
    title: "How to Back Up Your Small Business Data (The Right Way)",
    description:
      "Most small business backups fail when they're actually needed. The 3-2-1 rule, cloud vs. local, and how to know your backups will actually work.",
    url: "https://copperbaytech.com/blog/how-to-back-up-your-small-business-data",
    siteName: "Copper Bay Tech",
    type: "article",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function Article() {
  return (
    <>
      <JsonLd schema={blogPostingSchema({ title: "How to Back Up Your Small Business Data (The Right Way)", description: "Most small business backups fail when they're actually needed. The 3-2-1 rule, cloud vs. local, and how to know your backups will actually work.", url: "https://copperbaytech.com/blog/how-to-back-up-your-small-business-data", datePublished: "2026-05-01" })} />
      <JsonLd schema={breadcrumbSchema([{ name: "Home", url: "https://copperbaytech.com" }, { name: "Blog", url: "https://copperbaytech.com/blog" }, { name: "Back Up Small Business Data" }])} />
      <Nav />
      <main>
        <section className="pt-32 pb-8 bg-[#18181B]">
          <div className="max-w-2xl mx-auto px-6">
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors mb-8" style={{ fontFamily: "var(--font-heading)" }}>
              <ArrowLeft size={14} /> All Resources
            </Link>
            <span className="inline-block mb-4 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-widest" style={{ backgroundColor: "rgba(249,115,22,0.15)", color: "#F97316", fontFamily: "var(--font-heading)" }}>
              IT Support
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
              How to Back Up Your Small Business Data (The Right Way)
            </h1>
            <p className="text-white/50 text-sm" style={{ fontFamily: "var(--font-body)" }}>
              6 min read · May 2026
            </p>
            <p className="text-sm text-[#3F3F46]/55 mt-1" style={{ fontFamily: "var(--font-body)" }}>
              Updated May 1, 2026
            </p>
          </div>
        </section>

        <section className="py-12 bg-white">
          <div className="max-w-2xl mx-auto px-6">
            <div className="prose prose-zinc max-w-none text-[#3F3F46]/80 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>

              <p className="text-lg text-[#3F3F46]/70 mb-8 leading-relaxed">
                Nearly every small business owner thinks they have backups. Many of them are wrong — and they find out at the worst possible time. Here&apos;s how to do it correctly so that if something goes wrong, recovery is measured in hours, not weeks.
              </p>

              <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                Why most small business backups fail
              </h2>
              <p className="mb-6">
                The most common failures we see:
              </p>
              <ul className="mb-6 space-y-2 list-disc pl-5">
                <li><strong>Syncing isn&apos;t the same as backing up.</strong> If your files are in Dropbox or Google Drive and you get ransomware, the encrypted versions sync and overwrite your backups. Cloud sync is not a backup.</li>
                <li><strong>The backup ran once and was never checked again.</strong> Backup jobs fail silently. Hard drives fail. Credentials expire. Without monitoring, you can go months thinking you&apos;re protected when you aren&apos;t.</li>
                <li><strong>Everything is on the same network.</strong> An external drive plugged into your computer that&apos;s always on is vulnerable to the same ransomware that hits your main drive. A backup isn&apos;t useful if it gets encrypted too.</li>
                <li><strong>Nobody has ever tested a restore.</strong> A backup is only as good as your ability to actually restore from it. Many businesses have never tried — until the day they have to.</li>
              </ul>

              <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                The 3-2-1 rule: the standard that works
              </h2>
              <p className="mb-6">
                The 3-2-1 backup rule is the industry standard for a reason. It&apos;s simple and it addresses the most common failure modes:
              </p>
              <ul className="mb-6 space-y-2 list-disc pl-5">
                <li><strong>3 copies of your data.</strong> The original plus two backups.</li>
                <li><strong>2 different storage types.</strong> For example, local external drive plus cloud storage. Relying on one medium (all cloud, all local) is a single point of failure.</li>
                <li><strong>1 copy offsite.</strong> If there&apos;s a fire, flood, or theft at your location, your local backup is gone along with your primary data. A cloud copy or offsite drive survives physical disasters.</li>
              </ul>
              <p className="mb-6">
                For most small businesses, this translates to: automated daily backups to cloud storage (offsite copy) plus a local external drive backup for faster restores. That&apos;s it.
              </p>

              <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                Cloud vs. local backup — you need both
              </h2>
              <p className="mb-6">
                <strong>Cloud backup</strong> (Backblaze, Acronis, Veeam, Wasabi) continuously backs up your files to remote servers. It protects against local disasters and ransomware (assuming versioning is enabled and there&apos;s a delay before encrypted versions overwrite clean ones). Restoration can be slow for large datasets — downloading terabytes takes time — but for most small businesses, the data volume is manageable.
              </p>
              <p className="mb-6">
                <strong>Local backup</strong> to a network-attached storage (NAS) drive or an external drive that&apos;s disconnected after each backup gives you fast restoration for day-to-day failures. A local restore from an external drive is far faster than downloading from the cloud.
              </p>
              <p className="mb-6">
                The combination of both gives you speed (local) and disaster protection (cloud). Choosing one or the other means accepting a gap.
              </p>

              <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                Ransomware-proofing your backups
              </h2>
              <p className="mb-6">
                Ransomware specifically targets backup systems. Modern strains will wait weeks before activating, giving the encrypted files time to propagate to backups. Then it deletes your shadow copies and demands payment.
              </p>
              <p className="mb-6">
                Practical defenses:
              </p>
              <ul className="mb-6 space-y-2 list-disc pl-5">
                <li><strong>Enable versioning.</strong> Your backup solution should keep multiple versions of files (30+ days), not just the most recent copy. This means you can roll back to a clean version before the infection.</li>
                <li><strong>Use immutable backups.</strong> Some cloud backup solutions offer &quot;immutable&quot; storage, where backups cannot be modified or deleted for a set period — even by an admin account. This is specifically designed to defeat ransomware.</li>
                <li><strong>Disconnect local drives.</strong> Drives that are always connected and always on can be reached by ransomware. A drive you connect weekly and then disconnect is much harder to compromise.</li>
                <li><strong>Don&apos;t let backups run under admin credentials.</strong> Use a dedicated, limited backup account so that compromised credentials can&apos;t reach your backup systems.</li>
              </ul>

              <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                Test your restore — at least once a year
              </h2>
              <p className="mb-6">
                Put a calendar reminder on your schedule: once a year, actually restore a file or a system from your backup. Pick something representative — a folder of documents, a database, a configuration file. Verify that the restored version is complete and functional.
              </p>
              <p className="mb-6">
                This exercise regularly reveals problems: backup jobs that stopped running, storage that filled up, credentials that expired, restore procedures that nobody actually knows. Better to find out in a drill than in a crisis.
              </p>
              <p className="mb-6">
                Also document your recovery process. When something goes wrong, stress levels are high and clear steps matter. Know in advance: where are the backups, who has the credentials, how long does a restore take, and who do you call for help?
              </p>

              <div className="mt-12 p-6 rounded-2xl bg-[#FAFAF9] border border-[#18181B]/10">
                <p className="text-sm font-semibold text-[#18181B] mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                  The bottom line
                </p>
                <p className="text-sm text-[#3F3F46]/60">
                  Follow the 3-2-1 rule, enable versioning, keep one copy offsite, and test a restore every year. Set up automated daily backups to cloud storage and you&apos;ve covered the overwhelming majority of failure scenarios.
                </p>
              </div>
            </div>

            <div className="mt-16 rounded-2xl bg-[#18181B] p-8 text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-3" style={{ fontFamily: "var(--font-heading)" }}>Ready to take action?</p>
              <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-heading)" }}>Talk to a local IT expert — free.</h3>
              <Link href="/#contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-semibold text-[#18181B] bg-[#F97316] hover:bg-[#ea6c0a] transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
                Book a Free Consultation <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
