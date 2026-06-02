// Escape user-supplied text before interpolating it into an HTML email body.
// Without this, a name/message containing `<`, `>` or quotes could break the
// markup or inject arbitrary HTML into mail we send on the recipient's behalf.
export function escapeHtml(input: unknown): string {
  return String(input ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
