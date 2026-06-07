import tls from "node:tls";
import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { assertSafeUrl } from "@/lib/ssrf";

interface SSLResult {
  verified: boolean;
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
        socket.destroy();
        if (!cert || !cert.valid_to) {
          reject(new Error("No certificate"));
          return;
        }
        const expiresAt = new Date(cert.valid_to);
        const daysUntilExpiry = Math.floor(
          (expiresAt.getTime() - Date.now()) / 86400000
        );
        resolve({
          verified: true,
          valid: socket.authorized || true,
          daysUntilExpiry,
          expiresAt: expiresAt.toISOString(),
          issuer: (Array.isArray(cert.issuer?.O) ? cert.issuer.O[0] : cert.issuer?.O) ?? "Unknown",
          hostname,
        });
      }
    );
    socket.setTimeout(8000, () => {
      socket.destroy();
      reject(new Error("Timeout"));
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

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    let parsed: URL;
    try {
      parsed = await assertSafeUrl(url);
    } catch {
      return NextResponse.json({ error: "Invalid or disallowed URL" }, { status: 400 });
    }

    const hostname = parsed.hostname;

    try {
      const result = await checkSSL(hostname);
      return NextResponse.json(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : "SSL check failed";
      return NextResponse.json(
        {
          verified: false,
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
