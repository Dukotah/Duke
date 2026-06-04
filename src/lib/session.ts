// Signed session token — works at the Edge (no DB lookup on every request)

export interface SessionPayload {
  userId: string;
  role: "admin" | "rep";
  name: string;
  exp: number;
}

/**
 * HMAC secret for signing/verifying session + unsubscribe tokens.
 * Falls back to a well-known dev string ONLY outside production. In production a
 * missing SESSION_SECRET is a hard error — signing tokens with a public default
 * (this repo is open source) would make every session trivially forgeable.
 */
export function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "SESSION_SECRET is not set. Refusing to fall back to an insecure default in production."
    );
  }
  return "dev-secret-change-in-production";
}

async function getKey(secret: string) {
  const enc = new TextEncoder();
  return crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

function b64(buf: ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function unb64(str: string) {
  return atob(str.replace(/-/g, "+").replace(/_/g, "/"));
}

export async function signToken(payload: Omit<SessionPayload, "exp">, secret: string): Promise<string> {
  const p: SessionPayload = { ...payload, exp: Date.now() + 30 * 24 * 60 * 60 * 1000 };
  const data = btoa(JSON.stringify(p));
  const key = await getKey(secret);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return `${data}.${b64(sig)}`;
}

export async function verifyToken(token: string, secret: string): Promise<SessionPayload | null> {
  try {
    const [data, sig] = token.split(".");
    if (!data || !sig) return null;
    const key = await getKey(secret);
    const sigBytes = Uint8Array.from(unb64(sig), (c) => c.charCodeAt(0));
    const ok = await crypto.subtle.verify("HMAC", key, sigBytes, new TextEncoder().encode(data));
    if (!ok) return null;
    const payload: SessionPayload = JSON.parse(atob(data));
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}
