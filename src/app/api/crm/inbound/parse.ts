// Pure parsers for the inbound-email webhook. Kept out of route.ts so the route
// file only exports HTTP handlers, and so these are unit-testable without Redis.

// Flexible inbound shapes we accept. Resend Inbound nests `from` as
// { email, name }; generic forwarders send `from` as a plain string. We also
// tolerate top-level fallbacks so a hand-rolled test payload works.
export interface InboundPayload {
  // Resend Inbound shape
  from?: string | { email?: string; name?: string };
  to?: string | string[] | { email?: string; name?: string } | Array<{ email?: string; name?: string }>;
  subject?: string;
  text?: string;
  html?: string;
  // Some providers nest the parsed message under `data` / `email`.
  data?: InboundPayload;
  email?: InboundPayload;
  // Generic fallbacks
  from_email?: string;
  fromEmail?: string;
  sender?: string;
}

// Pull a clean { email, name } out of any of the supported `from` shapes.
export function extractSender(payload: InboundPayload): { email: string; name?: string } {
  const p = payload.data ?? payload.email ?? payload;
  const raw = p.from ?? p.from_email ?? p.fromEmail ?? p.sender;

  if (raw && typeof raw === "object") {
    return { email: (raw.email ?? "").toLowerCase().trim(), name: raw.name };
  }
  if (typeof raw === "string") {
    // Handle "Name <email@x.com>" as well as a bare address.
    const m = raw.match(/<([^>]+)>/);
    const email = (m ? m[1] : raw).toLowerCase().trim();
    const name = m ? raw.replace(/<[^>]+>/, "").replace(/"/g, "").trim() || undefined : undefined;
    return { email, name };
  }
  return { email: "" };
}

// Normalize the parsed message fields, looking through a `data`/`email` wrapper.
export function extractMessage(payload: InboundPayload): { subject?: string; text?: string; html?: string } {
  const p = payload.data ?? payload.email ?? payload;
  return {
    subject: typeof p.subject === "string" ? p.subject : undefined,
    text: typeof p.text === "string" ? p.text : undefined,
    html: typeof p.html === "string" ? p.html : undefined,
  };
}
