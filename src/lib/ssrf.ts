import dns from "node:dns/promises";

/**
 * SSRF protection for user-supplied URLs.
 *
 * `assertSafeUrl` normalizes the input, rejects non-http(s) schemes, parses it,
 * then DNS-resolves the hostname and rejects if ANY resolved address lands in a
 * private / loopback / link-local / reserved range. `safeFetch` wraps it and
 * performs a fetch with a 10s timeout and a descriptive User-Agent.
 *
 * Resolving DNS up front (rather than trusting the literal hostname) defeats
 * rebinding-style tricks and hostnames that point at internal IPs.
 */

const MAX_URL_LENGTH = 2048;

const DEFAULT_USER_AGENT =
  "Mozilla/5.0 (compatible; CopperBayAudit/1.0; +https://copperbaytech.com)";

const BLOCKED_HOSTNAMES = new Set([
  "localhost",
  "localhost.localdomain",
  "ip6-localhost",
  "ip6-loopback",
  "metadata.google.internal",
]);

/** Parse a dotted-quad IPv4 string into 4 octets, or null if not valid IPv4. */
function parseIPv4(host: string): number[] | null {
  const parts = host.split(".");
  if (parts.length !== 4) return null;
  const octets: number[] = [];
  for (const p of parts) {
    if (!/^\d{1,3}$/.test(p)) return null;
    const n = Number(p);
    if (n < 0 || n > 255) return null;
    octets.push(n);
  }
  return octets;
}

/** True if the given IPv4 octets fall in a private / reserved / loopback range. */
function isPrivateIPv4Octets(p: number[]): boolean {
  // 10.0.0.0/8
  if (p[0] === 10) return true;
  // 172.16.0.0/12
  if (p[0] === 172 && p[1] >= 16 && p[1] <= 31) return true;
  // 192.168.0.0/16
  if (p[0] === 192 && p[1] === 168) return true;
  // 127.0.0.0/8 — loopback
  if (p[0] === 127) return true;
  // 169.254.0.0/16 — link-local / cloud metadata
  if (p[0] === 169 && p[1] === 254) return true;
  // 0.0.0.0/8
  if (p[0] === 0) return true;
  // 100.64.0.0/10 — carrier-grade NAT
  if (p[0] === 100 && p[1] >= 64 && p[1] <= 127) return true;
  return false;
}

/**
 * True if the address (IPv4 or IPv6 string, as returned by dns.lookup) is in a
 * disallowed range. Handles IPv4-mapped IPv6 (::ffff:a.b.c.d) by unwrapping.
 */
function isPrivateAddress(address: string): boolean {
  const addr = address.trim().toLowerCase();

  // Plain IPv4
  const v4 = parseIPv4(addr);
  if (v4) return isPrivateIPv4Octets(v4);

  // IPv6 — normalize away any zone id (e.g. fe80::1%eth0)
  const v6 = addr.split("%")[0];

  // IPv4-mapped / IPv4-compatible IPv6 (::ffff:127.0.0.1 or ::127.0.0.1)
  const mapped = v6.match(/^::(?:ffff:)?(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/);
  if (mapped) {
    const inner = parseIPv4(mapped[1]);
    if (inner) return isPrivateIPv4Octets(inner);
  }
  // ::ffff: with a hex form is also possible but rare; fall through to checks.

  // Loopback ::1 (and the unspecified :: address)
  if (v6 === "::1" || v6 === "::") return true;

  // fc00::/7 — unique local addresses (fc.. and fd..)
  if (/^f[cd][0-9a-f]{0,2}:/.test(v6) || v6.startsWith("fc") || v6.startsWith("fd")) {
    // Confirm it is actually an IPv6 (contains ":")
    if (v6.includes(":")) return true;
  }

  // fe80::/10 — link-local
  if (/^fe[89ab][0-9a-f]?:/.test(v6) && v6.includes(":")) return true;

  return false;
}

/** True for a hostname that is a bare IP literal already in a blocked range. */
function isBlockedLiteral(hostname: string): boolean {
  const lower = hostname.toLowerCase();
  // Strip IPv6 brackets
  const bare = lower.replace(/^\[/, "").replace(/\]$/, "");
  if (isPrivateAddress(bare)) return true;
  return false;
}

/**
 * Normalize and validate a user-supplied URL against SSRF. Resolves DNS and
 * rejects if any resolved address is private/internal. Returns the parsed URL.
 * Throws a clear Error on any rejection.
 */
export async function assertSafeUrl(raw: string): Promise<URL> {
  if (typeof raw !== "string") {
    throw new Error("URL must be a string");
  }

  let normalized = raw.trim();
  if (!normalized) {
    throw new Error("URL is required");
  }
  if (normalized.length > MAX_URL_LENGTH) {
    throw new Error("URL exceeds maximum length");
  }

  // Prepend https:// when no scheme is given; reject any other explicit scheme.
  if (!normalized.startsWith("http://") && !normalized.startsWith("https://")) {
    if (/^[a-zA-Z][a-zA-Z0-9+\-.]*:/.test(normalized)) {
      throw new Error("Only http and https URLs are allowed");
    }
    normalized = "https://" + normalized;
  }

  let parsed: URL;
  try {
    parsed = new URL(normalized);
  } catch {
    throw new Error("Invalid URL format");
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("Only http and https URLs are allowed");
  }

  if (parsed.username || parsed.password) {
    throw new Error("URLs with embedded credentials are not allowed");
  }

  const hostname = parsed.hostname.toLowerCase();
  const bareHost = hostname.replace(/^\[/, "").replace(/\]$/, "");

  if (BLOCKED_HOSTNAMES.has(hostname) || BLOCKED_HOSTNAMES.has(bareHost)) {
    throw new Error("Requests to private/internal network addresses are not allowed");
  }
  if (hostname.endsWith(".localhost") || bareHost.endsWith(".localhost")) {
    throw new Error("Requests to private/internal network addresses are not allowed");
  }

  // Bare IP literal already in a blocked range — reject before any DNS work.
  if (isBlockedLiteral(hostname)) {
    throw new Error("Requests to private/internal network addresses are not allowed");
  }

  // Resolve the hostname and reject if ANY address is private/internal.
  // dns.lookup returns all A/AAAA records the resolver would actually use.
  let addresses: { address: string }[];
  try {
    addresses = await dns.lookup(bareHost, { all: true });
  } catch {
    throw new Error("Could not resolve URL hostname");
  }

  if (addresses.length === 0) {
    throw new Error("Could not resolve URL hostname");
  }

  for (const { address } of addresses) {
    if (isPrivateAddress(address)) {
      throw new Error("Requests to private/internal network addresses are not allowed");
    }
  }

  return parsed;
}

export interface SafeFetchOptions extends RequestInit {
  /** Override the request timeout (ms). Defaults to 10s. */
  timeoutMs?: number;
}

/**
 * Validate a user-supplied URL via {@link assertSafeUrl}, then fetch it with a
 * 10s timeout and a descriptive User-Agent. Throws if the URL is disallowed.
 */
export async function safeFetch(raw: string, opts: SafeFetchOptions = {}): Promise<Response> {
  const safeUrl = await assertSafeUrl(raw);
  const { timeoutMs = 10_000, headers, signal, ...rest } = opts;

  const mergedHeaders = new Headers(headers);
  if (!mergedHeaders.has("User-Agent") && !mergedHeaders.has("user-agent")) {
    mergedHeaders.set("User-Agent", DEFAULT_USER_AGENT);
  }

  return fetch(safeUrl.toString(), {
    ...rest,
    headers: mergedHeaders,
    signal: signal ?? AbortSignal.timeout(timeoutMs),
  });
}
