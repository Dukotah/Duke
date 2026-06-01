import { createHmac, timingSafeEqual } from "crypto";

// Resend signs webhooks with Svix. The signature scheme is an HMAC-SHA256 over
// `${svix-id}.${svix-timestamp}.${payload}`, keyed by the base64 portion of the
// `whsec_...` signing secret, compared against the base64 digests listed in the
// `svix-signature` header (space-separated, each like `v1,<base64>`).
//
// Implemented here directly so we don't need the `svix` dependency.
export function verifyResendSignature(
  payload: string,
  headers: {
    id: string | null;
    timestamp: string | null;
    signature: string | null;
  },
  secret: string,
): boolean {
  const { id, timestamp, signature } = headers;
  if (!id || !timestamp || !signature) return false;

  // Reject timestamps outside a 5-minute window to limit replay.
  const ts = Number(timestamp);
  if (!Number.isFinite(ts)) return false;
  const skew = Math.abs(Date.now() / 1000 - ts);
  if (skew > 5 * 60) return false;

  const key = secret.startsWith("whsec_") ? secret.slice(6) : secret;
  let keyBytes: Buffer;
  try {
    keyBytes = Buffer.from(key, "base64");
  } catch {
    return false;
  }

  const signedContent = `${id}.${timestamp}.${payload}`;
  const expected = createHmac("sha256", keyBytes)
    .update(signedContent)
    .digest("base64");
  const expectedBuf = Buffer.from(expected);

  // The header may carry multiple space-separated signatures.
  for (const part of signature.split(" ")) {
    const sig = part.includes(",") ? part.split(",")[1] : part;
    const sigBuf = Buffer.from(sig);
    if (
      sigBuf.length === expectedBuf.length &&
      timingSafeEqual(sigBuf, expectedBuf)
    ) {
      return true;
    }
  }
  return false;
}
