import tls from "node:tls";
import { NextRequest, NextResponse } from "next/server";
import { validateAuditUrl } from "@/lib/validate-url";
import { rateLimit } from "@/lib/rate-limit";

interface SSLResult {
  valid: boolean;
  daysUntilExpiry: number;
  expiresAt: string;
  issuer: string;
  hostname: string;
  error?: string;
}

function checkSSL(hostname: string): Promise<SSLResult> {
  return new Promise((resolve, reject) => {
    const socket = tls.connect(
      443,
      hostname,
      { servername: hostname, rejectUnauthorized: false },
      () => {
        const cert = socket.getPeerCertificate();
        // socket.authorized is false for self-signed / expired / wrong-hostname certs
        const authorized = socket.authorized;
        socket.destroy();

        if (!cert || !cert.valid_to) {
          reject(new Error("No certificate returned"));
          return;
        }

        const expiresAt = new Date(cert.valid_to);
        const daysUntilExpiry = Math.floor(
          (expiresAt.getTime() - Date.now()) / 86400000
        );

        resolve({
          // Use the actual socket.authorized value — do NOT OR with true
          valid: authorized,
          daysUntilExpiry,
          expiresAt: expiresAt.toISOString(),
          issuer: (Array.isArray(cert.issuer?.O) ? cert.issuer.O[0] : cert.issuer?.O) ?? "Unknown",
          hostname,
        });
      }
    );

    socket.setTimeout(8000, () => {
      socket.destroy();
      reject(new Error("Connection timed out"));
    });
    socket.on("error", reject);
  });
}

export async function POST(req: NextRequest) {
  const rl = rateLimit(req, { limit: 10, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json({ error: rl.message }, { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } });
  }

  try {
    const { url } = await req.json();

    const validated = validateAuditUrl(url);
    if (!validated.ok) {
      return NextResponse.json({ error: validated.reason }, { status: 400 });
    }

    const hostname = new URL(validated.url).hostname;

    try {
      const result = await checkSSL(hostname);
      return NextResponse.json(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : "SSL check failed";
      return NextResponse.json(
        {
          valid: false,
          daysUntilExpiry: 0,
          expiresAt: "",
          issuer: "",
          hostname,
          error: message,
        },
        { status: 200 }
      );
    }
  } catch {
    return NextResponse.json({ error: "Failed to check SSL" }, { status: 500 });
  }
}
