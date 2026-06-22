#!/usr/bin/env bash
# One-shot Resend backend wiring for CRM click tracking.
#
# Idempotent: safe to re-run. It will
#   1. find your sending domain,
#   2. enable Click tracking + disable Open tracking on it,
#   3. register the event webhook at /api/crm/email-events (clicked/bounced/
#      complained) — unless one already points there — and print the signing
#      secret you must store as RESEND_WEBHOOK_SECRET.
#
# Requires a LIVE Resend API key in the environment:
#   RESEND_API_KEY=re_xxx ./scripts/wire-resend-tracking.sh
#
# Optional overrides:
#   OUTREACH_DOMAIN     (default copperbaytech.com)
#   WEBHOOK_ENDPOINT    (default https://copperbaytech.com/api/crm/email-events)
set -euo pipefail

: "${RESEND_API_KEY:?Set RESEND_API_KEY to your live Resend key}"
DOMAIN="${OUTREACH_DOMAIN:-copperbaytech.com}"
ENDPOINT="${WEBHOOK_ENDPOINT:-https://copperbaytech.com/api/crm/email-events}"
API="https://api.resend.com"
AUTH=(-H "Authorization: Bearer ${RESEND_API_KEY}")

# Tiny JSON picker so we don't depend on jq (node is always present here).
pick() { node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{let j;try{j=JSON.parse(d)}catch{process.exit(0)};process.stdout.write(String(($1)??''))})"; }

echo "→ Looking up domain '${DOMAIN}' ..."
DOMAIN_ID="$(curl -fsS "${AUTH[@]}" "${API}/domains" | pick "((j.data||j)||[]).find(x=>x.name==='${DOMAIN}')?.id")"
if [ -z "${DOMAIN_ID}" ]; then
  echo "  ✗ Domain '${DOMAIN}' not found on this Resend account. Aborting." >&2
  exit 1
fi
echo "  domain_id=${DOMAIN_ID}"

echo "→ Enabling Click tracking, disabling Open tracking ..."
curl -fsS -X PATCH "${AUTH[@]}" -H "Content-Type: application/json" \
  -d '{"click_tracking":true,"open_tracking":false}' \
  "${API}/domains/${DOMAIN_ID}" >/dev/null
echo "  ✓ tracking updated"

echo "→ Checking for an existing webhook to ${ENDPOINT} ..."
EXISTING="$(curl -fsS "${AUTH[@]}" "${API}/webhooks" | pick "((j.data||j)||[]).find(x=>(x.endpoint||x.endpoint_url||'').includes('/api/crm/email-events'))?.id")"
if [ -n "${EXISTING}" ]; then
  echo "  ✓ Webhook already present (id=${EXISTING}). Leaving it as-is."
  echo "    (If RESEND_WEBHOOK_SECRET isn't set yet, delete that webhook in the"
  echo "     dashboard and re-run this to get a fresh signing secret.)"
  exit 0
fi

echo "→ Creating webhook → ${ENDPOINT} (email.clicked, email.bounced, email.complained) ..."
RESP="$(curl -fsS -X POST "${AUTH[@]}" -H "Content-Type: application/json" \
  -d "{\"endpoint\":\"${ENDPOINT}\",\"events\":[\"email.clicked\",\"email.bounced\",\"email.complained\"]}" \
  "${API}/webhooks")"
SECRET="$(printf '%s' "${RESP}" | pick "j.signing_secret||j.data?.signing_secret")"
if [ -z "${SECRET}" ]; then
  echo "  ✗ Webhook call returned no signing_secret. Raw response:" >&2
  printf '%s\n' "${RESP}" >&2
  exit 1
fi
echo ""
echo "  ✅ Webhook created."
echo "  ────────────────────────────────────────────────────────────"
echo "  Set this in Vercel (Production) as RESEND_WEBHOOK_SECRET, then redeploy:"
echo ""
echo "      ${SECRET}"
echo "  ────────────────────────────────────────────────────────────"
