/**
 * Races a promise against a timeout so a hung dependency can never block a
 * request (or a user) indefinitely.
 *
 * Why this exists: our public API routes await Upstash Redis (rate limiting +
 * CRM lead capture) and Resend. If those are misconfigured or unreachable in
 * prod, the underlying fetch can HANG with no error — and a plain try/catch only
 * catches throws, not hangs. That turned the contact/booking forms into an
 * infinite spinner (a complete lead blackout). Wrapping the awaits with a hard
 * timeout converts a hang into a fast, catchable rejection.
 */
export function withTimeout<T>(promise: Promise<T>, ms: number, label = "operation"): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms),
    ),
  ]);
}
