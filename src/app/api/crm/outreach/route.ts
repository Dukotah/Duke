import { NextRequest, NextResponse } from "next/server";
import { getStore } from "@/lib/crm/store";
import { isAuthorized } from "@/lib/crm/auth";
import { sendOutreach, OutreachTemplate } from "@/lib/crm/email";
import { Contact } from "@/lib/crm/types";

export const runtime = "nodejs";
export const maxDuration = 60;

// POST /api/crm/outreach — send a templated outreach email to CRM contacts.
//
// Body: {
//   template: { subject, body },          // {{first}}/{{name}}/{{business}} supported
//   contactIds?: string[],                // explicit recipients, OR…
//   filter?: { status?, tags?, source? }, // …select by criteria
//   campaign?: string,
//   live?: boolean                        // MUST be true to actually send; default dry-run
// }
//
// Safety: real sends require both a valid admin token AND `live: true`.
// Anything else is a dry-run that reports who *would* be contacted.
export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    template?: OutreachTemplate;
    contactIds?: string[];
    filter?: { status?: string; tags?: string[]; source?: string };
    campaign?: string;
    live?: boolean;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { template, contactIds, filter, campaign } = body;
  if (!template?.subject || !template?.body) {
    return NextResponse.json(
      { error: "template.subject and template.body are required" },
      { status: 400 },
    );
  }

  const store = getStore();
  const all = await store.listContacts();

  let recipients: Contact[];
  if (contactIds?.length) {
    const set = new Set(contactIds);
    recipients = all.filter((c) => set.has(c.id));
  } else if (filter) {
    recipients = all.filter((c) => {
      if (filter.status && c.status !== filter.status) return false;
      if (filter.source && c.source !== filter.source) return false;
      if (filter.tags?.length && !filter.tags.every((t) => c.tags.includes(t)))
        return false;
      return true;
    });
  } else {
    return NextResponse.json(
      { error: "Provide contactIds or a filter" },
      { status: 400 },
    );
  }

  // Don't email people who opted out or already hard-bounced/complained.
  recipients = recipients.filter(
    (c) =>
      !c.unsubscribed &&
      !["unsubscribed", "bounced", "complained"].includes(c.status),
  );

  const dryRun = body.live !== true;
  const results = [];
  for (const contact of recipients) {
    results.push(await sendOutreach(contact, template, { campaign, dryRun }));
  }

  const sent = results.filter((r) => r.status === "sent").length;
  return NextResponse.json({
    dryRun,
    requested: recipients.length,
    sent,
    results,
  });
}
