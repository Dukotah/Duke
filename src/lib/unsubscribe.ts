// Signed, stateless unsubscribe tokens. A recipient's email is HMAC-signed so
// the public /api/unsubscribe endpoint can verify the link without a lookup,
// and nobody can forge an unsubscribe for an address they don't hold a link to.
import { SITE_URL } from "@/config/site";

const enc = new TextEncoder();

async function getKey(secret: string) {
  return crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

function b64url(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function unb64url(s: string): Uint8Array<ArrayBuffer> {
  return Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));
}

export async function makeUnsubToken(email: string, secret: string): Promise<string> {
  const normalized = email.toLowerCase().trim();
  const key = await getKey(secret);
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(normalized)));
  return `${b64url(enc.encode(normalized))}.${b64url(sig)}`;
}

// Returns the verified email if the token is valid, otherwise null.
export async function verifyUnsubToken(token: string, secret: string): Promise<string | null> {
  try {
    const [ePart, sPart] = token.split(".");
    if (!ePart || !sPart) return null;
    const email = new TextDecoder().decode(unb64url(ePart));
    const key = await getKey(secret);
    const ok = await crypto.subtle.verify("HMAC", key, unb64url(sPart), enc.encode(email.toLowerCase().trim()));
    return ok ? email : null;
  } catch {
    return null;
  }
}

export async function unsubscribeUrl(email: string, secret: string): Promise<string> {
  const token = await makeUnsubToken(email, secret);
  return `${SITE_URL}/api/unsubscribe?t=${encodeURIComponent(token)}`;
}
