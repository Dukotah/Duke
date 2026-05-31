import dns from "node:dns/promises";
import type { MxRecord } from "node:dns";
import { NextRequest, NextResponse } from "next/server";

interface DNSRecord {
  type: string;
  value: string;
}

interface DNSCheck {
  label: string;
  severity: "pass" | "warning" | "error";
  detail: string;
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith("http://") && !normalizedUrl.startsWith("https://")) {
      normalizedUrl = "https://" + normalizedUrl;
    }
    let hostname: string;
    try {
      hostname = new URL(normalizedUrl).hostname;
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    const records: DNSRecord[] = [];
    const checks: DNSCheck[] = [];

    // A records
    let aRecords: string[] = [];
    try {
      aRecords = await dns.resolve4(hostname);
      aRecords.forEach(ip => records.push({ type: "A", value: ip }));
      checks.push({ label: "A record", severity: "pass", detail: `${aRecords.length} IP${aRecords.length > 1 ? "s" : ""}: ${aRecords.slice(0, 3).join(", ")}` });
    } catch {
      checks.push({ label: "A record", severity: "error", detail: "No A record — domain may not resolve" });
    }

    // AAAA records (IPv6)
    try {
      const aaaaRecords = await dns.resolve6(hostname);
      aaaaRecords.forEach(ip => records.push({ type: "AAAA", value: ip }));
      checks.push({ label: "IPv6 (AAAA)", severity: "pass", detail: `${aaaaRecords.length} IPv6 address${aaaaRecords.length > 1 ? "es" : ""} configured` });
    } catch {
      checks.push({ label: "IPv6 (AAAA)", severity: "warning", detail: "No IPv6 — not required but future-proof" });
    }

    // MX records
    let mxRecords: MxRecord[] = [];
    try {
      mxRecords = await dns.resolveMx(hostname);
      mxRecords.sort((a, b) => a.priority - b.priority);
      mxRecords.forEach(mx => records.push({ type: "MX", value: `${mx.exchange} (priority ${mx.priority})` }));
      checks.push({ label: "MX records", severity: "pass", detail: `${mxRecords.length} mail server${mxRecords.length > 1 ? "s" : ""}: ${mxRecords[0].exchange}` });
    } catch {
      checks.push({ label: "MX records", severity: "warning", detail: "No MX records — domain may not receive email" });
    }

    // TXT / SPF
    let spfFound = false;
    let dmarcFound = false;
    try {
      const txtRecords = await dns.resolveTxt(hostname);
      for (const parts of txtRecords) {
        const txt = parts.join("");
        records.push({ type: "TXT", value: txt.length > 80 ? txt.slice(0, 80) + "…" : txt });
        if (txt.startsWith("v=spf1")) spfFound = true;
      }
      if (spfFound) {
        const spf = txtRecords.find(r => r.join("").startsWith("v=spf1"))?.join("") ?? "";
        checks.push({ label: "SPF record", severity: "pass", detail: spf.slice(0, 70) });
      } else {
        checks.push({ label: "SPF record", severity: "error", detail: "Missing — anyone can spoof email from this domain" });
      }
    } catch {
      checks.push({ label: "SPF record", severity: "error", detail: "No TXT records found" });
    }

    // DMARC
    try {
      const dmarcRecords = await dns.resolveTxt(`_dmarc.${hostname}`);
      for (const parts of dmarcRecords) {
        const txt = parts.join("");
        if (txt.startsWith("v=DMARC1")) {
          dmarcFound = true;
          records.push({ type: "DMARC", value: txt.length > 80 ? txt.slice(0, 80) + "…" : txt });
          const policy = txt.match(/p=(\w+)/)?.[1] ?? "none";
          if (policy === "none") {
            checks.push({ label: "DMARC policy", severity: "warning", detail: `p=none — monitoring only, not enforced` });
          } else {
            checks.push({ label: "DMARC policy", severity: "pass", detail: `p=${policy} — email spoofing blocked` });
          }
        }
      }
      if (!dmarcFound) {
        checks.push({ label: "DMARC policy", severity: "error", detail: "Missing — phishing using your domain is undetected" });
      }
    } catch {
      checks.push({ label: "DMARC policy", severity: "error", detail: "No DMARC record — phishing risk" });
    }

    // NS records
    try {
      const nsRecords = await dns.resolveNs(hostname);
      nsRecords.forEach(ns => records.push({ type: "NS", value: ns }));
      const hasMultipleNS = nsRecords.length >= 2;
      checks.push({
        label: "Nameservers",
        severity: hasMultipleNS ? "pass" : "warning",
        detail: hasMultipleNS
          ? `${nsRecords.length} nameservers — redundancy good`
          : `Only 1 nameserver — single point of failure`,
      });
    } catch {
      checks.push({ label: "Nameservers", severity: "warning", detail: "Could not resolve nameservers" });
    }

    const passed = checks.filter(c => c.severity === "pass").length;
    const score = Math.round((passed / checks.length) * 100);

    return NextResponse.json({ hostname, score, records, checks });
  } catch {
    return NextResponse.json({ error: "Failed to check DNS" }, { status: 500 });
  }
}
