"use client";

import { useState, useCallback } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Eye, EyeOff, ShieldCheck, ShieldAlert, Shield } from "lucide-react";

interface StrengthResult {
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
  color: string;
  feedback: string[];
}

interface BreachResult {
  checked: boolean;
  breached: boolean;
  count: number;
  error?: string;
}

async function sha1(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("").toUpperCase();
}

async function checkBreach(password: string): Promise<BreachResult> {
  try {
    const hash = await sha1(password);
    const prefix = hash.slice(0, 5);
    const suffix = hash.slice(5);

    const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      headers: { "Add-Padding": "true" },
    });

    if (!res.ok) return { checked: false, breached: false, count: 0, error: "API unavailable" };

    const text = await res.text();
    const lines = text.split("\n");

    for (const line of lines) {
      const [lineSuffix, countStr] = line.split(":");
      if (lineSuffix.trim().toUpperCase() === suffix) {
        const count = parseInt(countStr, 10);
        return { checked: true, breached: true, count };
      }
    }
    return { checked: true, breached: false, count: 0 };
  } catch {
    return { checked: false, breached: false, count: 0, error: "Network error — please try again" };
  }
}

function analyzeStrength(password: string): StrengthResult {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) score++;
  else feedback.push("Use at least 8 characters");

  if (password.length >= 14) score++;
  else if (password.length >= 8) feedback.push("Longer passwords (14+) are much harder to crack");

  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  else feedback.push("Mix uppercase and lowercase letters");

  if (/[0-9]/.test(password)) score++;
  else feedback.push("Add at least one number");

  if (/[^A-Za-z0-9]/.test(password)) score++;
  else feedback.push("Add a special character (!, @, #, $, etc.)");

  const patterns = [/^[0-9]+$/, /^[a-z]+$/, /^[A-Z]+$/, /password/i, /qwerty/i, /123/];
  for (const p of patterns) {
    if (p.test(password)) { feedback.push("Avoid predictable patterns"); break; }
  }

  const capped = Math.min(score, 4) as 0 | 1 | 2 | 3 | 4;
  const labels = ["Very Weak", "Weak", "Fair", "Strong", "Very Strong"];
  const colors = ["#EF4444", "#F97316", "#EAB308", "#22C55E", "#16A34A"];

  return { score: capped, label: labels[capped], color: colors[capped], feedback };
}

export default function PasswordPage() {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [strength, setStrength] = useState<StrengthResult | null>(null);
  const [breach, setBreach] = useState<BreachResult | null>(null);
  const [checking, setChecking] = useState(false);

  const handleChange = useCallback((val: string) => {
    setPassword(val);
    setBreach(null);
    if (val) setStrength(analyzeStrength(val));
    else setStrength(null);
  }, []);

  async function handleCheck() {
    if (!password || checking) return;
    setChecking(true);
    const result = await checkBreach(password);
    setBreach(result);
    setChecking(false);
  }

  const bars = [0, 1, 2, 3];

  return (
    <div className="min-h-screen bg-[#18181B] text-white">
      <Nav />

      <section className="pt-32 pb-12 px-6 text-center">
        <div className="max-w-xl mx-auto">
          <span className="inline-block bg-orange-500/10 text-orange-400 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 border border-orange-500/20">
            Free Tool
          </span>
          <h1 className="text-4xl sm:text-5xl font-black mb-4 leading-tight">
            Password{" "}
            <span className="text-orange-400">Strength & Breach Checker</span>
          </h1>
          <p className="text-zinc-400 text-lg mb-3 max-w-xl mx-auto">
            Check if your password has appeared in known data breaches — without sending it anywhere. Strength analysis is instant and local.
          </p>
          <p className="text-zinc-500 text-xs">
            Breach check uses <a href="https://haveibeenpwned.com/Passwords" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300">Have I Been Pwned</a>'s k-anonymity API — your actual password never leaves your browser.
          </p>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="max-w-lg mx-auto space-y-6">
          {/* Input */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <div>
              <label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider block mb-2">Enter a Password</label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={e => handleChange(e.target.value)}
                  placeholder="Type a password to analyze…"
                  autoComplete="off"
                  className="w-full bg-[#18181B] border border-zinc-700 rounded-xl px-4 py-3.5 pr-12 text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 transition-colors text-base font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Strength meter */}
            {strength && (
              <div className="space-y-2">
                <div className="flex gap-1.5">
                  {bars.map(i => (
                    <div
                      key={i}
                      className="flex-1 h-1.5 rounded-full transition-all duration-300"
                      style={{ backgroundColor: i < strength.score ? strength.color : "#27272A" }}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold" style={{ color: strength.color }}>{strength.label}</span>
                  <span className="text-zinc-500 text-xs">{password.length} characters</span>
                </div>
                {strength.feedback.length > 0 && (
                  <ul className="space-y-1">
                    {strength.feedback.map((tip, i) => (
                      <li key={i} className="text-zinc-400 text-xs flex items-start gap-2">
                        <span className="text-orange-400 flex-shrink-0 mt-0.5">→</span>{tip}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <button
              onClick={handleCheck}
              disabled={!password || checking}
              className="w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-full transition-colors text-sm"
            >
              {checking ? "Checking breach database…" : "Check for Breaches"}
            </button>
          </div>

          {/* Breach result */}
          {breach && (
            <div className={`rounded-2xl p-6 border ${breach.breached ? "bg-red-500/10 border-red-500/30" : breach.error ? "bg-zinc-900 border-zinc-800" : "bg-green-500/10 border-green-500/30"}`}>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {breach.breached ? (
                    <ShieldAlert size={32} className="text-red-400" />
                  ) : breach.error ? (
                    <Shield size={32} className="text-zinc-400" />
                  ) : (
                    <ShieldCheck size={32} className="text-green-400" />
                  )}
                </div>
                <div>
                  {breach.breached ? (
                    <>
                      <p className="text-red-400 font-bold text-lg">Found in {breach.count.toLocaleString()} breaches</p>
                      <p className="text-red-300/80 text-sm mt-1 leading-relaxed">
                        This password has appeared in known data breach databases. Anyone using it is at risk.
                        You should change it immediately on any account where it&apos;s used.
                      </p>
                    </>
                  ) : breach.error ? (
                    <>
                      <p className="text-zinc-400 font-bold text-lg">Could not check</p>
                      <p className="text-zinc-500 text-sm mt-1">{breach.error}</p>
                    </>
                  ) : (
                    <>
                      <p className="text-green-400 font-bold text-lg">Not found in any known breach</p>
                      <p className="text-green-300/80 text-sm mt-1 leading-relaxed">
                        Good news — this password hasn&apos;t been seen in any breach database we know of.
                        That said, weak passwords are still guessable even if not breached.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* How it works */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-3">
            <h3 className="text-white font-bold">How the breach check works</h3>
            <ol className="space-y-2">
              {[
                "Your password is hashed with SHA-1 entirely in your browser",
                "Only the first 5 characters of the hash are sent to Have I Been Pwned",
                "The API returns all hashes starting with those 5 characters",
                "Your browser checks the list locally — your password never travels the network",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-zinc-400">
                  <span className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          {/* Password tips */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-3">
            <h3 className="text-white font-bold">Password Best Practices</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { tip: "Use a passphrase", desc: "4+ random words are easier to remember and hard to crack" },
                { tip: "Never reuse passwords", desc: "One breach = all accounts exposed if you reuse" },
                { tip: "Use a password manager", desc: "1Password, Bitwarden, or similar — generate unique passwords per site" },
                { tip: "Enable MFA everywhere", desc: "Even a weak password is much safer with two-factor authentication" },
              ].map((item, i) => (
                <div key={i} className="bg-[#18181B] rounded-xl p-4">
                  <p className="text-white text-xs font-bold mb-1">{item.tip}</p>
                  <p className="text-zinc-500 text-xs">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="rounded-2xl p-6 text-center border border-zinc-800 bg-zinc-900">
            <p className="text-white font-bold mb-2">Need help securing your business accounts?</p>
            <p className="text-zinc-400 text-sm mb-4">We set up password managers, MFA, and SSO for Sonoma County businesses. One afternoon — done.</p>
            <a href="/#contact" className="inline-block bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-3 rounded-full transition-colors text-sm">
              Talk to Us
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
