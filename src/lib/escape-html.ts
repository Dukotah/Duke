/**
 * Escape user-supplied strings before inserting them into HTML contexts.
 * Used by /api/contact to prevent XSS payloads in email bodies.
 */

const HTML_ESCAPE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
};

// Slash is intentionally NOT escaped here — we are targeting HTML text node
// and attribute value contexts inside email bodies (not inline <script> blocks).
// Escaping "/" breaks URLs typed in message fields.
const HTML_ESCAPE_RE = /[&<>"']/g;

export function escapeHtml(input: unknown): string {
  if (typeof input !== "string") return "";
  return input.replace(HTML_ESCAPE_RE, ch => HTML_ESCAPE_MAP[ch] ?? ch);
}

/** Truncate a string to maxLen, appending "…" if trimmed. */
export function truncate(input: string, maxLen: number): string {
  if (input.length <= maxLen) return input;
  return input.slice(0, maxLen) + "…";
}
