// ── Update CALENDLY_URL with your actual Calendly link ───────────────────────
// Create a free account at calendly.com and paste the 30-min meeting link here.
export const CALENDLY_URL = "https://calendly.com/copperbaytech/free-consultation";

export const SITE_URL = "https://copperbaytech.com";
export const PHONE = "(707) 239-6725";
export const PHONE_HREF = "tel:+17072396725";
export const EMAIL = "contact@copperbaytech.com";

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

// CAN-SPAM requires a real physical postal address in every marketing email.
// ⚠️ Update this with your actual street address or registered P.O. Box.
export const MAILING_ADDRESS = "Copper Bay Tech, Petaluma, CA 94952";
