import dns from "node:dns/promises";
import { NextRequest, NextResponse } from "next/server";
import { validateAuditUrl } from "@/lib/validate-url";

interface DNSCheck {
  label: string;
  status: "pass" | "warn" | "fail";
  detail: string;
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    const validated = validateAuditUrl(url);
    if (!validated.ok) {
      return NextResponse.json({ error: validated.reason }, { status: 400 });
    }
    const hostname = new URL(validated.url).hostname;

    // Strip www for root domain checks
    const rootDomain = hostname.replace(/^www\./, "");
    const checks: DNSCheck[] = [];

    // 1. MX records — can this domain receive email?
    try {
      const mx = await dns.resolveMx(rootDomain);
      if (mx.length > 0) {
        const primary = mx.sort((a, b) => a.priority - b.priority)[0];
        checks.push({
          label: "MX Records (email routing)",
          status: "pass",
          detail: `${mx.length} record${mx.length > 1 ? "s" : ""} found. Primary: ${primary.exchange} (priority ${primary.priority})`,
        });
      } else {
        checks.push({ label: "MX Records (email routing)", status: "fail", detail: "No MX records — this domain cannot receive email" });
      }
    } catch {
      checks.push({ label: "MX Records (email routing)", status: "fail", detail: "No MX records found — domain may not receive email" });
    }

    // 2. SPF — anti-spoofing
    try {
      const txt = await dns.resolveTxt(rootDomain);
      const spf = txt.flat().find(r => r.startsWith("v=spf1"));
      if (spf) {
        const hasFail = spf.includes("-all");
        const hasSoftFail = spf.includes("~all");
        checks.push({
          label: "SPF Record (anti-spoofing)",
          status: hasFail ? "pass" : "warn",
          detail: hasFail
            ? `SPF configured with strict enforcement (-all): ${spf.slice(0, 80)}${spf.length > 80 ? "…" : ""}`
            : hasSoftFail
            ? `SPF set to soft-fail (~all) — consider upgrading to -all: ${spf.slice(0, 60)}…`
            : `SPF exists but enforcement is weak: ${spf.slice(0, 60)}…`,
        });
      } else {
        checks.push({
          label: "SPF Record (anti-spoofing)",
          status: "fail",
          detail: "No SPF record — anyone can send email claiming to be from your domain",
        });
      }
    } catch {
      checks.push({ label: "SPF Record (anti-spoofing)", status: "fail", detail: "Could not check SPF — DNS lookup failed" });
    }

    // 3. DMARC
    try {
      const dmarc = await dns.resolveTxt(`_dmarc.${rootDomain}`);
      const dmarcRecord = dmarc.flat().find(r => r.startsWith("v=DMARC1"));
      if (dmarcRecord) {
        const policy = dmarcRecord.match(/p=(none|quarantine|reject)/)?.[1] || "unknown";
        const strong = policy === "reject" || policy === "quarantine";
        checks.push({
          label: "DMARC Policy (email authentication)",
          status: strong ? "pass" : "warn",
          detail: strong
            ? `DMARC set to p=${policy} — good email authentication posture`
            : `DMARC present but policy is p=${policy} — recommend p=quarantine or p=reject`,
        });
      } else {
        checks.push({ label: "DMARC Policy (email authentication)", status: "fail", detail: "No DMARC record — emails may fail authentication and land in spam" });
      }
    } catch {
      checks.push({ label: "DMARC Policy (email authentication)", status: "fail", detail: "No DMARC record found — spoofing risk" });
    }

    // 4. WWW resolves
    try {
      await dns.resolve4(`www.${rootDomain}`);
      checks.push({ label: "www subdomain resolves", status: "pass", detail: `www.${rootDomain} resolves correctly` });
    } catch {
      try {
        await dns.resolve6(`www.${rootDomain}`);
        checks.push({ label: "www subdomain resolves", status: "pass", detail: `www.${rootDomain} resolves (IPv6)` });
      } catch {
        checks.push({ label: "www subdomain resolves", status: "warn", detail: `www.${rootDomain} does not resolve — visitors typing 'www.' may get an error` });
      }
    }

    // 5. Check for DKIM (common selectors)
    let dkimFound = false;
    const selectors = ["google", "mail", "default", "selector1", "selector2", "k1", "s1", "s2"];
    for (const sel of selectors) {
      try {
        const dkim = await dns.resolveTxt(`${sel}._domainkey.${rootDomain}`);
        if (dkim.flat().some(r => r.includes("v=DKIM1"))) {
          dkimFound = true;
          checks.push({ label: "DKIM (email signing)", status: "pass", detail: `DKIM record found (selector: ${sel}) — emails are cryptographically signed` });
          break;
        }
      } catch (_) {}
    }
    if (!dkimFound) {
      checks.push({ label: "DKIM (email signing)", status: "warn", detail: "No DKIM record detected with common selectors — emails may be marked as suspicious" });
    }

    const passed = checks.filter(c => c.status === "pass").length;
    const failed = checks.filter(c => c.status === "fail").length;
    const score = Math.round((passed / checks.length) * 100);

    return NextResponse.json({ score, passed, failed, total: checks.length, checks, hostname: rootDomain });
  } catch (err) {
    console.error("DNS check error:", err);
    return NextResponse.json({ error: "Failed to run DNS checks" }, { status: 500 });
  }
}
