// ── Update CALENDLY_URL with your actual Calendly link ───────────────────────
// Create a free account at calendly.com and paste the 30-min meeting link here.
export const CALENDLY_URL = "https://calendly.com/copperbaytech/free-consultation";

export const SITE_URL = "https://copperbaytech.com";
export const PHONE = "(707) 239-6725";
export const PHONE_E164 = "+17072396725";
export const PHONE_HREF = `tel:${PHONE_E164}`;
export const EMAIL = "contact@copperbaytech.com";
export const EMAIL_HREF = `mailto:${EMAIL}`;

// Location labels reused in marketing copy and transactional email sign-offs.
export const LOCATION = "Petaluma, CA";
export const SERVICE_AREA = "Sonoma County";

// Cold outreach is sent from a DEDICATED SUBDOMAIN, kept separate from the main
// copperbaytech.com domain. This isolates sender reputation: if a cold-emailing
// run gets flagged, it damages only the subdomain — your transactional mail
// (contact form, receipts, internal CRM alerts) on the main domain stays safe.
//
// Set OUTREACH_FROM in your host env to an address on the subdomain you verified
// in Resend (SPF/DKIM/DMARC). The default below is a placeholder — change the
// subdomain to whatever you actually verify.
export const OUTREACH_FROM =
  process.env.OUTREACH_FROM?.trim() || "outreach@mail.copperbaytech.com";

// Where replies go. Cold outreach is sent FROM the send-only subdomain, but
// replies should land in your real, monitored inbox on the MAIN domain.
export const OUTREACH_REPLY_TO =
  process.env.OUTREACH_REPLY_TO?.trim() || "contact@copperbaytech.com";

// Automated notifications and auto-replies are sent from this address.
export const NOREPLY_EMAIL = "noreply@copperbaytech.com";

// CAN-SPAM requires a real physical postal address in every *marketing* email.
// A digital agency doesn't need a street office — just a deliverable postal
// address (a P.O. Box or virtual mailbox). Set it via the MAILING_ADDRESS env
// var in your host so it can change without a code deploy. Until it's set, live
// cold outreach stays gated (see the guard in src/app/api/crm/outreach/route.ts)
// so no non-compliant mail can go out.
export const MAILING_ADDRESS = (process.env.MAILING_ADDRESS ?? "").trim();
export const hasMailingAddress = MAILING_ADDRESS.length > 0;
