// Maximum HTML response body we will buffer — protects against size-bomb attacks.
const MAX_HTML_BYTES = 512 * 1024; // 512 KB

/**
 * Fetch a URL and return the first MAX_HTML_BYTES of the response body as a
 * string. Throws if the fetch fails or times out.
 */
export async function fetchHtml(url: string, timeoutMs = 10_000): Promise<string> {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; CopperBayAudit/1.0)",
      Accept: "text/html,application/xhtml+xml",
    },
    signal: AbortSignal.timeout(timeoutMs),
  });

  const reader = res.body?.getReader();
  if (!reader) return "";

  const chunks: Uint8Array[] = [];
  let total = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      total += value.byteLength;
      if (total > MAX_HTML_BYTES) {
        // Stop reading — we have enough for analysis
        reader.cancel().catch(() => undefined);
        chunks.push(value.slice(0, value.byteLength - (total - MAX_HTML_BYTES)));
        break;
      }
      chunks.push(value);
    }
  }

  const combined = new Uint8Array(chunks.reduce((sum, c) => sum + c.byteLength, 0));
  let offset = 0;
  for (const chunk of chunks) {
    combined.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return new TextDecoder().decode(combined);
}
