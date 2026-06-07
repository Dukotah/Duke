import { EMAIL, SITE_URL } from "@/config/site";

// RFC 9116 security.txt — served at /.well-known/security.txt as text/plain.
// The Expires field is required; we generate it one year ahead of build time.
export const dynamic = "force-static";

export function GET() {
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);

  const body = [
    `Contact: mailto:${EMAIL}`,
    `Expires: ${expires.toISOString()}`,
    "Preferred-Languages: en",
    `Canonical: ${SITE_URL}/.well-known/security.txt`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
