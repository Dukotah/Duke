"use client";

import { useState } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

interface Hop {
  from: string;
  by: string;
  delay: string;
}

interface AuthResult {
  spf: "pass" | "fail" | "softfail" | "neutral" | "none" | "unknown";
  dkim: "pass" | "fail" | "none" | "unknown";
  dmarc: "pass" | "fail" | "none" | "unknown";
  spfDetail: string;
  dkimDetail: string;
  dmarcDetail: string;
}

interface ParsedHeaders {
  from: string;
  to: string;
  subject: string;
  date: string;
  messageId: string;
  returnPath: string;
  xMailer: string;
  auth: AuthResult;
  hops: Hop[];
  totalDelay: string;
  spamScore: string;
  warnings: string[];
  raw: Record<string, string>;
}

function getHeader(lines: string[], name: string): string {
  const lower = name.toLowerCase();
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].toLowerCase().startsWith(lower + ":")) {
      let val = lines[i].slice(lower.length + 1).trim();
      while (i + 1 < lines.length && (lines[i + 1].startsWith("\t") || lines[i + 1].startsWith(" "))) {
        val += " " + lines[i + 1].trim();
        i++;
      }
      return val;
    }
  }
  return "";
}

function getAllHeaders(lines: string[], name: string): string[] {
  const lower = name.toLowerCase();
  const results: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].toLowerCase().startsWith(lower + ":")) {
      let val = lines[i].slice(lower.length + 1).trim();
      while (i + 1 < lines.length && (lines[i + 1].startsWith("\t") || lines[i + 1].startsWith(" "))) {
        val += " " + lines[i + 1].trim();
        i++;
      }
      results.push(val);
    }
  }
  return results;
}

function parseAuthResults(authHeader: string): AuthResult {
  const result: AuthResult = {
    spf: "unknown", dkim: "unknown", dmarc: "unknown",
    spfDetail: "", dkimDetail: "", dmarcDetail: "",
  };
  if (!authHeader) {
    result.spf = "none"; result.dkim = "none"; result.dmarc = "none";
    return result;
  }

  const lower = authHeader.toLowerCase();

  const spfMatch = lower.match(/spf=(pass|fail|softfail|neutral|none)/);
  result.spf = (spfMatch?.[1] as AuthResult["spf"]) ?? "unknown";
  result.spfDetail = authHeader.match(/spf=[^\s;]+([^;]*)/i)?.[0] ?? "";

  const dkimMatch = lower.match(/dkim=(pass|fail|none)/);
  result.dkim = (dkimMatch?.[1] as AuthResult["dkim"]) ?? "none";
  result.dkimDetail = authHeader.match(/dkim=[^\s;]+([^;]*)/i)?.[0] ?? "";

  const dmarcMatch = lower.match(/dmarc=(pass|fail|none)/);
  result.dmarc = (dmarcMatch?.[1] as AuthResult["dmarc"]) ?? "none";
  result.dmarcDetail = authHeader.match(/dmarc=[^\s;]+([^;]*)/i)?.[0] ?? "";

  return result;
}

function parseHops(lines: string[]): Hop[] {
  const hops: Hop[] = [];
  const received = getAllHeaders(lines, "received");
  let prevTime: Date | null = null;

  for (const r of received.reverse()) {
    const fromMatch = r.match(/from\s+([^\s]+)/i);
    const byMatch = r.match(/by\s+([^\s]+)/i);
    const dateMatch = r.match(/;\s*(.+)$/i);

    const from = fromMatch?.[1] ?? "unknown";
    const by = byMatch?.[1] ?? "unknown";
    let delay = "—";

    if (dateMatch) {
      try {
        const d = new Date(dateMatch[1].trim());
        if (!isNaN(d.getTime())) {
          if (prevTime) {
            const diff = Math.abs(d.getTime() - prevTime.getTime());
            const secs = Math.round(diff / 1000);
            delay = secs < 60 ? `${secs}s` : `${Math.round(secs / 60)}m ${secs % 60}s`;
          }
          prevTime = d;
        }
      } catch { /* ignore */ }
    }
    hops.push({ from, by, delay });
  }
  return hops;
}

function parseHeaders(raw: string): ParsedHeaders {
  const lines = raw.split("\n");
  const warnings: string[] = [];

  const from = getHeader(lines, "from");
  const returnPath = getHeader(lines, "return-path");
  const auth = parseAuthResults(getHeader(lines, "authentication-results") || getHeader(lines, "arc-authentication-results"));

  if (from && returnPath) {
    const fromDomain = from.match(/@([^>]+)/)?.[1]?.toLowerCase();
    const rpDomain = returnPath.match(/@([^>]+)/)?.[1]?.toLowerCase();
    if (fromDomain && rpDomain && fromDomain !== rpDomain) {
      warnings.push(`From domain (${fromDomain}) does not match Return-Path domain (${rpDomain}) — potential spoofing indicator.`);
    }
  }
  if (auth.spf === "fail" || auth.spf === "softfail") warnings.push("SPF check failed — the sending server may not be authorized to send for this domain.");
  if (auth.dkim === "fail") warnings.push("DKIM signature verification failed — email may have been tampered with in transit.");
  if (auth.dmarc === "fail") warnings.push("DMARC policy check failed — domain owner has set a policy that this message violates.");
  if (auth.dkim === "none") warnings.push("No DKIM signature found — sender domain has not signed this email.");
  if (auth.dmarc === "none") warnings.push("No DMARC policy applied — domain has not published a DMARC record.");

  const spamScoreRaw = getHeader(lines, "x-spam-score") || getHeader(lines, "x-spam-status");

  const hops = parseHops(lines);

  const rawHeaders: Record<string, string> = {};
  for (let i = 0; i < lines.length; i++) {
    const colonIdx = lines[i].indexOf(":");
    if (colonIdx > 0) {
      const key = lines[i].slice(0, colonIdx).trim().toLowerCase();
      let val = lines[i].slice(colonIdx + 1).trim();
      while (i + 1 < lines.length && (lines[i + 1].startsWith("\t") || lines[i + 1].startsWith(" "))) {
        val += " " + lines[i + 1].trim();
        i++;
      }
      rawHeaders[key] = val;
    }
  }

  return {
    from,
    to: getHeader(lines, "to"),
    subject: getHeader(lines, "subject"),
    date: getHeader(lines, "date"),
    messageId: getHeader(lines, "message-id"),
    returnPath,
    xMailer: getHeader(lines, "x-mailer") || getHeader(lines, "x-originating-ip"),
    auth,
    hops,
    totalDelay: hops.length > 1 ? `${hops.length} hops` : "Direct",
    spamScore: spamScoreRaw,
    warnings,
    raw: rawHeaders,
  };
}

type AuthStatus = "pass" | "fail" | "softfail" | "neutral" | "none" | "unknown";

function authColor(status: AuthStatus) {
  if (status === "pass") return "text-green-400 bg-green-500/10 border-green-500/20";
  if (status === "fail" || status === "softfail") return "text-red-400 bg-red-500/10 border-red-500/20";
  if (status === "none") return "text-orange-400 bg-orange-500/10 border-orange-500/20";
  return "text-zinc-400 bg-zinc-800 border-zinc-700";
}

function AuthBadge({ label, status, detail }: { label: string; status: AuthStatus; detail: string }) {
  const cls = authColor(status);
  return (
    <div className={`rounded-xl border px-4 py-3 ${cls.split(" ").slice(1).join(" ")}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">{label}</span>
        <span className={`text-xs font-bold uppercase ${cls.split(" ")[0]}`}>{status}</span>
      </div>
      {detail && <p className="text-zinc-500 text-[11px] font-mono break-all">{detail}</p>}
    </div>
  );
}

const EXAMPLE = `Received: from mail-lf1-f54.google.com (mail-lf1-f54.google.com [209.85.167.54])
        by mx.example.com with ESMTPS id abc123
        ; Mon, 26 May 2026 10:00:05 +0000
Received: by mail-lf1-f54.google.com with SMTP id abc
        for <user@example.com>; Mon, 26 May 2026 03:00:01 -0700
Authentication-Results: mx.example.com;
       spf=pass (google.com: domain of sender@gmail.com designates 209.85.167.54 as permitted sender) smtp.mailfrom=sender@gmail.com;
       dkim=pass header.i=@gmail.com header.s=20210112;
       dmarc=pass (p=NONE sp=QUARANTINE dis=NONE) header.from=gmail.com
From: "John Sender" <sender@gmail.com>
To: user@example.com
Subject: Test email for header analysis
Date: Mon, 26 May 2026 10:00:00 +0000
Message-ID: <abc123@mail.gmail.com>
Return-Path: <sender@gmail.com>
X-Mailer: Apple Mail`;

export default function EmailHeadersPage() {
  const [input, setInput] = useState("");
  const [parsed, setParsed] = useState<ParsedHeaders | null>(null);

  function analyze() {
    if (!input.trim()) return;
    setParsed(parseHeaders(input));
  }

  return (
    <div className="min-h-screen bg-[#18181B] text-white">
      <Nav />

      <section className="pt-32 pb-12 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <span className="inline-block bg-orange-500/10 text-orange-400 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 border border-orange-500/20">
            Free Tool
          </span>
          <h1 className="text-4xl sm:text-5xl font-black mb-4 leading-tight">
            Email Header{" "}
            <span className="text-orange-400">Analyzer</span>
          </h1>
          <p className="text-zinc-400 text-lg mb-4 max-w-xl mx-auto">
            Paste raw email headers to check SPF, DKIM, DMARC authentication, trace the delivery path, and spot spoofing indicators.
          </p>
          <p className="text-zinc-600 text-xs">All analysis happens in your browser. Headers are never sent to our servers.</p>
        </div>
      </section>

      <section className="px-6 pb-16">
        <div className="max-w-3xl mx-auto space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Paste Raw Email Headers</label>
              <button
                onClick={() => setInput(EXAMPLE)}
                className="text-orange-400 hover:text-orange-300 text-xs font-semibold transition-colors"
              >
                Load Example
              </button>
            </div>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={`Received: from mail.example.com...\nAuthentication-Results: ...\nFrom: ...\nTo: ...`}
              rows={10}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-5 py-4 text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 transition-colors text-xs font-mono resize-none"
            />
            <p className="text-zinc-600 text-[11px] mt-2">
              In Gmail: open email → three-dot menu → &ldquo;Show original&rdquo;. In Outlook: File → Properties → Internet headers.
            </p>
          </div>

          <button
            onClick={analyze}
            disabled={!input.trim()}
            className="w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-full transition-colors text-sm"
          >
            Analyze Headers
          </button>

          {parsed && (
            <div className="space-y-4 pt-4">
              {/* Warnings */}
              {parsed.warnings.length > 0 && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-5">
                  <p className="text-red-400 text-xs font-bold uppercase tracking-wider mb-3">⚠ Issues Detected</p>
                  <ul className="space-y-2">
                    {parsed.warnings.map((w, i) => (
                      <li key={i} className="text-red-300 text-sm flex items-start gap-2">
                        <span className="flex-shrink-0 mt-0.5">•</span>{w}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Auth */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-zinc-800">
                  <h3 className="text-white font-bold">Email Authentication</h3>
                  <p className="text-zinc-500 text-xs mt-0.5">SPF · DKIM · DMARC</p>
                </div>
                <div className="p-5 grid sm:grid-cols-3 gap-3">
                  <AuthBadge label="SPF" status={parsed.auth.spf} detail={parsed.auth.spfDetail} />
                  <AuthBadge label="DKIM" status={parsed.auth.dkim} detail={parsed.auth.dkimDetail} />
                  <AuthBadge label="DMARC" status={parsed.auth.dmarc} detail={parsed.auth.dmarcDetail} />
                </div>
              </div>

              {/* Overview */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-zinc-800">
                  <h3 className="text-white font-bold">Message Overview</h3>
                </div>
                <div className="divide-y divide-zinc-800">
                  {[
                    { label: "From", value: parsed.from },
                    { label: "To", value: parsed.to },
                    { label: "Subject", value: parsed.subject },
                    { label: "Date", value: parsed.date },
                    { label: "Message-ID", value: parsed.messageId },
                    { label: "Return-Path", value: parsed.returnPath },
                    { label: "Mailer / Origin", value: parsed.xMailer },
                    { label: "Spam Score", value: parsed.spamScore },
                  ].filter(r => r.value).map((row, i) => (
                    <div key={i} className="flex gap-4 px-5 py-3">
                      <span className="text-zinc-500 text-xs w-28 flex-shrink-0 pt-0.5">{row.label}</span>
                      <span className="text-zinc-200 text-xs font-mono break-all">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hops */}
              {parsed.hops.length > 0 && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
                    <h3 className="text-white font-bold">Delivery Path</h3>
                    <span className="text-zinc-500 text-xs">{parsed.hops.length} hop{parsed.hops.length !== 1 ? "s" : ""}</span>
                  </div>
                  <div className="p-5 space-y-2">
                    {parsed.hops.map((hop, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="flex flex-col items-center flex-shrink-0">
                          <div className="w-6 h-6 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-[10px] font-bold text-orange-400">{i + 1}</div>
                          {i < parsed.hops.length - 1 && <div className="w-px h-4 bg-zinc-700 my-1" />}
                        </div>
                        <div className="flex-1 bg-[#18181B] rounded-xl px-4 py-3 mb-2">
                          <p className="text-zinc-300 text-xs font-mono">{hop.from} → {hop.by}</p>
                          {hop.delay !== "—" && i > 0 && (
                            <p className="text-orange-400 text-[11px] mt-1">Delay: {hop.delay}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="rounded-2xl p-6 text-center border border-zinc-800 bg-zinc-900">
                <p className="text-white font-bold mb-2">Concerned about email security?</p>
                <p className="text-zinc-400 text-sm mb-4">Copper Bay Tech can audit your email authentication setup and implement SPF, DKIM, and DMARC properly for your domain.</p>
                <Link href="/#contact" className="inline-block bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-3 rounded-full transition-colors text-sm">
                  Talk to Us
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
