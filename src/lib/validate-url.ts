/**
 * SSRF-safe URL validator for all audit API routes.
 *
 * Blocks private/loopback/link-local addresses, non-http(s) schemes,
 * credential-embedded URLs, and excessively long inputs.
 */

export const BLOCKED_REASONS = {
  MISSING: "URL is required",
  INVALID_TYPE: "URL must be a string",
  TOO_LONG: "URL exceeds maximum length",
  INVALID_FORMAT: "Invalid URL format",
  INVALID_SCHEME: "Only http and https URLs are allowed",
  CREDENTIALS: "URLs with embedded credentials are not allowed",
  PRIVATE_NETWORK: "Requests to private/internal network addresses are not allowed",
} as const;

type ValidateOk = { ok: true; url: string };
type ValidateFail = { ok: false; reason: string };
type ValidateResult = ValidateOk | ValidateFail;

const MAX_URL_LENGTH = 2048;

// RFC 1918 + special-purpose ranges
const PRIVATE_RANGES: Array<(parts: number[]) => boolean> = [
  // 127.0.0.0/8 — loopback
  (p) => p[0] === 127,
  // 10.0.0.0/8
  (p) => p[0] === 10,
  // 172.16.0.0/12
  (p) => p[0] === 172 && p[1] >= 16 && p[1] <= 31,
  // 192.168.0.0/16
  (p) => p[0] === 192 && p[1] === 168,
  // 169.254.0.0/16 — link-local / AWS metadata
  (p) => p[0] === 169 && p[1] === 254,
  // 0.0.0.0/8
  (p) => p[0] === 0,
  // 100.64.0.0/10 — carrier-grade NAT
  (p) => p[0] === 100 && p[1] >= 64 && p[1] <= 127,
];

function isPrivateIPv4(hostname: string): boolean {
  const parts = hostname.split(".").map(Number);
  if (parts.length !== 4) return false;
  if (parts.some(n => isNaN(n) || n < 0 || n > 255)) return false;
  return PRIVATE_RANGES.some(check => check(parts));
}

function isBlockedHostname(hostname: string): boolean {
  const lower = hostname.toLowerCase();

  // Explicit loopback / special names
  if (lower === "localhost" || lower === "localhost.localdomain") return true;
  if (lower.endsWith(".localhost")) return true;
  if (lower === "ip6-localhost" || lower === "ip6-loopback") return true;

  // IPv6 loopback and link-local
  if (lower === "::1" || lower === "[::1]") return true;
  if (lower.startsWith("fe80") || lower.startsWith("[fe80")) return true;
  if (lower.startsWith("fc") || lower.startsWith("fd")) return true; // ULA

  // Strip brackets from IPv6 for bare-address check
  const bare = lower.replace(/^\[/, "").replace(/\]$/, "");
  if (bare === "::1") return true;

  // Private IPv4
  if (isPrivateIPv4(hostname)) return true;

  return false;
}

export function validateAuditUrl(input: unknown): ValidateResult {
  if (!input) return { ok: false, reason: BLOCKED_REASONS.MISSING };
  if (typeof input !== "string") return { ok: false, reason: BLOCKED_REASONS.INVALID_TYPE };
  if (input.length > MAX_URL_LENGTH) return { ok: false, reason: BLOCKED_REASONS.TOO_LONG };

  let normalized = input.trim();
  if (!normalized) return { ok: false, reason: BLOCKED_REASONS.MISSING };

  // Prepend https if no scheme given
  if (!normalized.startsWith("http://") && !normalized.startsWith("https://")) {
    // Reject anything that already has a different scheme
    if (/^[a-zA-Z][a-zA-Z0-9+\-.]*:/.test(normalized)) {
      return { ok: false, reason: BLOCKED_REASONS.INVALID_SCHEME };
    }
    normalized = "https://" + normalized;
  }

  let parsed: URL;
  try {
    parsed = new URL(normalized);
  } catch {
    return { ok: false, reason: BLOCKED_REASONS.INVALID_FORMAT };
  }

  // Scheme whitelist
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { ok: false, reason: BLOCKED_REASONS.INVALID_SCHEME };
  }

  // Block credential-embedded URLs (SSRF evasion / social engineering)
  if (parsed.username || parsed.password) {
    return { ok: false, reason: BLOCKED_REASONS.CREDENTIALS };
  }

  const hostname = parsed.hostname;

  if (isBlockedHostname(hostname)) {
    return { ok: false, reason: BLOCKED_REASONS.PRIVATE_NETWORK };
  }

  // Rebuild clean URL without trailing junk
  return { ok: true, url: normalized };
}
