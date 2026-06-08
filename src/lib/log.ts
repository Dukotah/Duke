// Tiny error-reporting shim. One place that every server catch-block and the
// client error surfaces funnel through, so wiring up a real provider later is a
// single-file change. Always logs to the console (visible in Vercel logs); when
// SENTRY_DSN is set it also makes a best-effort, fire-and-forget POST to Sentry's
// store endpoint. It never throws — error reporting must not break the request.

function parseDsn(dsn: string): { url: string; key: string } | null {
  // Sentry DSN: https://<publicKey>@<host>/<projectId>
  try {
    const u = new URL(dsn);
    const projectId = u.pathname.replace(/^\//, "");
    if (!projectId || !u.username) return null;
    const url = `${u.protocol}//${u.host}/api/${projectId}/store/`;
    return { url, key: u.username };
  } catch {
    return null;
  }
}

export function reportError(context: string, err: unknown, extra?: Record<string, unknown>): void {
  // Always log — structured so it's greppable in Vercel's log drains.
  const message = err instanceof Error ? err.message : String(err);
  const stack = err instanceof Error ? err.stack : undefined;
  console.error(`[error] ${context}: ${message}`, extra ?? "");

  const dsn = process.env.SENTRY_DSN;
  if (!dsn) return;
  const parsed = parseDsn(dsn);
  if (!parsed) return;

  // Fire-and-forget; swallow everything. We deliberately don't await this.
  try {
    void fetch(parsed.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Sentry-Auth": `Sentry sentry_version=7, sentry_key=${parsed.key}, sentry_client=copperbay/1.0`,
      },
      body: JSON.stringify({
        platform: "node",
        level: "error",
        logger: context,
        message,
        ...(stack ? { exception: { values: [{ type: context, value: message, stacktrace: { frames: [] } }] } } : {}),
        extra,
        timestamp: new Date().toISOString(),
      }),
    }).catch(() => {});
  } catch {
    // never throw from the error reporter
  }
}
