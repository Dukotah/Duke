# CRM + Email Automation — Setup

This system captures leads, sends tracked outreach through Resend, and
auto-updates each contact's status when an email is **opened, clicked,
bounced, or replied to**.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `RESEND_API_KEY` | yes (to send) | Resend API key. Without it, sends are skipped and logged. |
| `RESEND_FROM` | no | From header. Default `Copper Bay Tech <noreply@copperbaytech.com>`. Domain must be verified in Resend. |
| `RESEND_WEBHOOK_SECRET` | recommended | Svix signing secret (`whsec_...`) from the Resend webhook. Enables signature verification on `/api/crm/webhook` and `/api/crm/inbound`. |
| `CRM_ADMIN_TOKEN` | yes | Shared token gating the dashboard, `/api/crm/contacts`, and `/api/crm/outreach`. If unset, admin endpoints are **disabled** (fail closed). |
| `CRM_BUSINESS_ADDRESS` | recommended | Physical mailing address in the outreach footer (CAN-SPAM). |
| `APP_URL` / `NEXT_PUBLIC_SITE_URL` | recommended | Public base URL used for tracking pixel + unsubscribe links. Default `https://copperbaytech.com`. |
| `CRM_DATA_DIR` | no | Directory for the JSON store. Default `.data/`. |

## One-time Resend setup

1. **Verify your sending domain** (SPF/DKIM/DMARC) in the Resend dashboard.
   Required for inbox placement before any real outreach.
2. **Add an event webhook** pointing to `https://<your-domain>/api/crm/webhook`.
   Subscribe to: `email.delivered`, `email.opened`, `email.clicked`,
   `email.bounced`, `email.complained`. Copy its signing secret into
   `RESEND_WEBHOOK_SECRET`.
3. **(Replies) Add an inbound route** that POSTs to
   `https://<your-domain>/api/crm/inbound`, or forward replies there. The
   handler matches the sender to a contact and marks them `replied`.

## Sending outreach (safe by default)

`POST /api/crm/outreach` is **dry-run unless you pass `live: true`**.

```bash
# Dry run — see exactly who WOULD be contacted, send nothing:
curl -X POST https://<domain>/api/crm/outreach \
  -H "x-crm-token: $CRM_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "template": {
      "subject": "Quick idea for {{business}}",
      "body": "Hi {{first}},\n\nI build fast, secure websites for Sonoma County businesses...\n\n— Duke"
    },
    "filter": { "status": "new" }
  }'

# Real send — add "live": true and target explicit ids:
#   "contactIds": ["<id>"], "live": true
```

Template variables: `{{first}}`, `{{name}}`, `{{business}}`.

Recipients who are `unsubscribed`, `bounced`, or `complained` are always
skipped automatically.

## Dashboard

Visit `/admin/crm`, paste your `CRM_ADMIN_TOKEN`. You'll see every lead, their
status, email engagement, and a per-contact activity log.

## How status changes happen automatically

| Event | Source | New status |
| --- | --- | --- |
| Form submitted | `/api/contact` | `new` |
| Outreach sent | `/api/crm/outreach` | `contacted` |
| Email opened | Resend webhook **or** tracking pixel | `opened` |
| Link clicked | Resend webhook | `clicked` |
| Reply received | inbound webhook | `replied` |
| Bounced / spam complaint | Resend webhook | `bounced` / `complained` |
| Unsubscribe link clicked | `/api/crm/unsubscribe` | `unsubscribed` |

Status never moves backwards automatically — a later open won't overwrite a
reply.

## Production note

The default store is a JSON file and is **ephemeral on serverless** (Vercel).
Before relying on it in production, implement the `CrmStore` interface in
`src/lib/crm/store.ts` against Vercel KV / Upstash / Postgres. See ROADMAP
Phase 1.
