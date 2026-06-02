import tls from "node:tls";
import { NextRequest, NextResponse } from "next/server";

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
  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    let normalizedUrl = url.trim();
    if (
      !normalizedUrl.startsWith("http://") &&
      !normalizedUrl.startsWith("https://")
    ) {
      normalizedUrl = "https://" + normalizedUrl;
    }

    let parsed: URL;
    try {
      parsed = new URL(normalizedUrl);
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    const hostname = parsed.hostname;

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
