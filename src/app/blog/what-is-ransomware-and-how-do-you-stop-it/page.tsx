import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import JsonLd, { blogPostingSchema, breadcrumbSchema } from "@/components/JsonLd";
import ArticleHeader from "@/components/ArticleHeader";

export const metadata: Metadata = {
  title: "What Is Ransomware and How Do Small Businesses Actually Stop It? | Copper Bay Tech",
  description: "Ransomware attacks on small businesses are up 300%. This is what it is, how it gets in, and the specific steps Sonoma County business owners can take to protect themselves.",
  alternates: { canonical: "https://copperbaytech.com/blog/what-is-ransomware-and-how-do-you-stop-it" },
  openGraph: {
    title: "What Is Ransomware and How Do Small Businesses Actually Stop It? | Copper Bay Tech",
    description: "Ransomware attacks on small businesses are up 300%. This is what it is, how it gets in, and the specific steps Sonoma County business owners can take to protect themselves.",
    url: "https://copperbaytech.com/blog/what-is-ransomware-and-how-do-you-stop-it",
    siteName: "Copper Bay Tech",
    type: "article",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function RansomwarePost() {
  return (
    <div className="min-h-screen bg-ink-0">
      <JsonLd schema={blogPostingSchema({ title: "What Is Ransomware and How Do Small Businesses Actually Stop It?", description: "Ransomware attacks on small businesses are up 300%. This is what it is, how it gets in, and the specific steps Sonoma County business owners can take to protect themselves.", url: "https://copperbaytech.com/blog/what-is-ransomware-and-how-do-you-stop-it", datePublished: "2026-02-01" })} />
      <JsonLd schema={breadcrumbSchema([{ name: "Home", url: "https://copperbaytech.com" }, { name: "Blog", url: "https://copperbaytech.com/blog" }, { name: "What Is Ransomware" }])} />
      <Nav light />

      <article className="pt-32 pb-24 px-6">
        <div className="max-w-2xl mx-auto">
          <ArticleHeader tag="Cybersecurity" title="What Is Ransomware and How Do Small Businesses Actually Stop It?" date="February 1, 2026" readTime="7 min read" />

          <div className="prose prose-zinc max-w-none" style={{ fontFamily: "var(--font-body)" }}>
            <p>
              If you run a small business and you think ransomware is something that only happens to hospitals and big corporations, you&apos;re wrong — and that misconception is what attackers count on.
            </p>
            <p>
              Small businesses now make up roughly 43% of ransomware targets. The reasons are straightforward: they have money, they have data worth encrypting, and they typically have far weaker defenses than enterprise organizations. A successful attack on a small business is easier and faster than attacking a company with a dedicated security team.
            </p>

            <h2>What ransomware actually is</h2>
            <p>
              Ransomware is a type of malware that encrypts your files — making them completely unreadable — and then demands payment (usually in cryptocurrency) in exchange for the decryption key.
            </p>
            <p>
              The attack typically goes like this:
            </p>
            <ol>
              <li>An attacker gets a foothold in your network (usually through a phishing email, exposed remote desktop, or an unpatched vulnerability)</li>
              <li>They spend days or weeks moving quietly through your systems, escalating their access</li>
              <li>When they&apos;re ready, they deploy the ransomware — which encrypts everything it can reach: files, databases, backups if they&apos;re accessible</li>
              <li>You arrive at work one morning and see a ransom note where your files used to be</li>
            </ol>
            <p>
              Modern ransomware groups also exfiltrate (steal) your data before encrypting it, so they have a second lever: &ldquo;Pay us, or we publish your client data online.&rdquo;
            </p>

            <h2>How it gets in — the three most common entry points</h2>

            <h3>1. Phishing emails</h3>
            <p>
              The most common entry point by far. An employee receives an email that looks legitimate — a DocuSign notification, a shipping update, an invoice from a familiar vendor — and either clicks a malicious link or opens an attachment that drops malware.
            </p>
            <p>
              Modern phishing is convincing. The emails are well-written, the sender addresses look right, and the landing pages look real. You cannot train your way to zero risk, but you can reduce it significantly.
            </p>

            <h3>2. Remote Desktop Protocol (RDP) exposed to the internet</h3>
            <p>
              A shocking number of small businesses have Windows RDP (port 3389) open directly to the internet, often because an IT person or ISP technician turned it on for remote access and never secured it properly.
            </p>
            <p>
              Attackers scan the entire internet constantly for open RDP ports. When they find one, they try credential-stuffing attacks until something works — especially if the username is &ldquo;Administrator&rdquo; and the password is weak.
            </p>

            <h3>3. Unpatched software vulnerabilities</h3>
            <p>
              Software companies regularly patch security vulnerabilities. When patches come out, attackers immediately start scanning for systems that haven&apos;t applied them yet. Routers with outdated firmware, unpatched Windows systems, old VPN appliances — all are active targets.
            </p>

            <h2>What actually stops ransomware</h2>
            <p>
              There&apos;s no single silver bullet, but the following controls, implemented together, dramatically reduce your risk:
            </p>

            <h3>Backups — the only true recovery option</h3>
            <p>
              A working, tested, offline or cloud backup is the difference between a ransomware attack being a catastrophe and being a bad week. Key requirements:
            </p>
            <ul>
              <li><strong>3-2-1 rule:</strong> 3 copies of your data, on 2 different media, with 1 offsite or cloud</li>
              <li><strong>Tested regularly:</strong> A backup that you&apos;ve never tried to restore from is a guess, not a backup. Test a full restore at least twice a year.</li>
              <li><strong>Isolated:</strong> If your backup drive is always connected to your network, ransomware will encrypt that too. Cloud backups with versioning (Google Workspace, Backblaze) are harder to destroy.</li>
            </ul>

            <h3>Multi-factor authentication on everything</h3>
            <p>
              MFA means that even if an attacker has your password, they can&apos;t log in without the second factor. Enable it on email, cloud storage, your VPN, your admin accounts — everywhere.
            </p>

            <h3>Patch management</h3>
            <p>
              Keep Windows updated. Keep your router firmware updated. Keep your business software updated. Most small businesses don&apos;t have a formal patch process — set a monthly calendar reminder to check and apply updates.
            </p>

            <h3>Close unnecessary network exposure</h3>
            <p>
              If you have RDP open to the internet, close it. Use a VPN for remote access instead. Run a port scan on your network to see what you&apos;re exposing — we can do this as part of a security audit.
            </p>

            <h3>Endpoint protection</h3>
            <p>
              Modern endpoint detection and response (EDR) tools are far more effective than traditional antivirus at catching ransomware behavior. Products like Microsoft Defender for Business (reasonable for small teams), Malwarebytes, or SentinelOne provide meaningful protection.
            </p>

            <h3>Staff training — but realistic training</h3>
            <p>
              Phishing simulations and security awareness training reduce click rates on phishing emails. But don&apos;t rely on it exclusively — assume someone will eventually click something they shouldn&apos;t, and make sure your other controls catch it.
            </p>

            <h2>If you get hit — what to do</h2>
            <ol>
              <li><strong>Disconnect from the network immediately.</strong> Pull the ethernet cable. Disable WiFi. Stop the spread.</li>
              <li><strong>Don&apos;t pay the ransom</strong> — unless your business will literally close without those files and you have no other options. Paying doesn&apos;t guarantee you get your files back, and it funds the next attack.</li>
              <li><strong>Call a professional before clicking anything.</strong> Ransomware recovery requires careful forensics to understand how the attacker got in and what was affected.</li>
              <li><strong>Report to the FBI</strong> via the IC3 (ic3.gov). You may think it won&apos;t help, but the data helps law enforcement track and eventually disrupt these groups.</li>
            </ol>

            <h2>Where to start this week</h2>
            <p>If you&apos;re not sure where your business stands, start here:</p>
            <ol>
              <li>Verify your backups are running and test one restore</li>
              <li>Enable MFA on your email — this alone stops a huge percentage of attacks</li>
              <li>Check your router firmware version and update it if needed</li>
              <li>Run a port scan on your network to see what&apos;s exposed</li>
            </ol>
            <p>
              If that sounds overwhelming, a half-day security audit will identify exactly where your exposure is and prioritize what to fix. It&apos;s a lot cheaper than a ransomware recovery.
            </p>
          </div>

          <div className="mt-12 rounded-2xl p-6 border border-hairline bg-ink-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-copper-bright mb-2" style={{ fontFamily: "var(--font-heading)" }}>Free Consultation</p>
            <h3 className="text-white font-bold text-lg mb-2" style={{ fontFamily: "var(--font-heading)" }}>Not sure how exposed you are?</h3>
            <p className="text-zinc-400 text-sm mb-4" style={{ fontFamily: "var(--font-body)" }}>
              We run security audits for Sonoma County businesses — half-day, written report, prioritized remediation. Free 30-min consultation to discuss your situation.
            </p>
            <a href="/schedule" className="inline-block bg-copper hover:bg-copper-bright text-white font-bold px-6 py-2.5 rounded-full transition-colors text-sm" style={{ fontFamily: "var(--font-heading)" }}>
              Book a Free Consultation
            </a>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}
