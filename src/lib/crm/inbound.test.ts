import { afterAll, beforeAll, describe, expect, it } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

// The CRM store (`./store`) opens a SQLite file at `$CRM_DB_PATH`, computed when
// that module first loads, and caches the connection on globalThis. To test
// against a throwaway database we set CRM_DB_PATH to a unique temp file BEFORE
// importing anything that pulls in the store, then `await import()` inside the
// tests. The seed ships empty (zero leads), so each run starts clean.

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "crm-inbound-"));
const dbPath = path.join(tmpDir, "crm.db");
process.env.CRM_DB_PATH = dbPath;

type Inbound = typeof import("./inbound");
type Store = typeof import("./store");

let createInboundLead: Inbound["createInboundLead"];
let getLeads: Store["getLeads"];
let getLead: Store["getLead"];

beforeAll(async () => {
  ({ createInboundLead } = await import("./inbound"));
  ({ getLeads, getLead } = await import("./store"));
});

afterAll(() => {
  try {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  } catch {
    // best effort cleanup
  }
});

describe("createInboundLead", () => {
  it("creates a new lead when nothing matches", async () => {
    const before = (await getLeads()).length;

    const res = await createInboundLead({
      email: "owner@acmeplumbing.com",
      businessName: "Acme Plumbing",
      phone: "(707) 555-0101",
      website: "https://acmeplumbing.com",
      scores: { overall: 62, website: 50, local: 70, social: 40, branding: 80 },
      grade: "B",
      recommendedService: "Website Redesign",
      source: "Business Analysis",
    });

    expect(res.created).toBe(true);
    expect(res.id).toBeTruthy();
    expect((await getLeads()).length).toBe(before + 1);

    const lead = await getLead(res.id);
    expect(lead?.business).toBe("Acme Plumbing");
    expect(lead?.email).toBe("owner@acmeplumbing.com");
    expect(lead?.website).toBe("https://acmeplumbing.com");
    expect(lead?.source).toBe("Business Analysis");
    expect(lead?.heatScore).toBe(62);
    // The grade / scores / recommended service land on the timeline.
    const note = lead?.activities.find((a) => a.type === "note");
    expect(note?.body).toContain("Grade: B");
    expect(note?.body).toContain("Biggest opportunity: Website Redesign");
  });

  it("dedups by email and enriches instead of creating a duplicate", async () => {
    const created = await createInboundLead({
      email: "dedupe@example.com",
      businessName: "Dedupe Co",
      phone: "707-555-0202",
      source: "Free Tool",
    });
    expect(created.created).toBe(true);

    const before = (await getLeads()).length;
    const again = await createInboundLead({
      // Same email, different casing/whitespace — must still match.
      email: "  Dedupe@Example.com ",
      businessName: "Dedupe Company LLC",
      scores: { overall: 88, website: 90, local: 85, social: 80, branding: 95 },
      grade: "A",
      recommendedService: "SEO",
      source: "Business Analysis",
    });

    expect(again.created).toBe(false);
    expect(again.id).toBe(created.id);
    expect((await getLeads()).length).toBe(before); // no new row

    const lead = await getLead(again.id);
    // First-touch source is preserved.
    expect(lead?.source).toBe("Free Tool");
    // Heat score reflects the fresh analysis.
    expect(lead?.heatScore).toBe(88);
    // The new report is appended to the timeline.
    expect(
      lead?.activities.some((a) => a.type === "note" && a.body?.includes("Grade: A")),
    ).toBe(true);
  });

  it("dedups by phone when the email differs", async () => {
    const created = await createInboundLead({
      email: "first@phonematch.com",
      businessName: "Phone Match Co",
      phone: "(530) 677-4365",
      source: "Free Tool",
    });

    const before = (await getLeads()).length;
    const again = await createInboundLead({
      email: "different@phonematch.com",
      businessName: "Totally Different Name",
      // Same number, different formatting + country code.
      phone: "+1 530 677 4365",
      source: "Business Analysis",
    });

    expect(again.created).toBe(false);
    expect(again.id).toBe(created.id);
    expect((await getLeads()).length).toBe(before);
  });

  it("dedups by normalized business name as a last resort", async () => {
    const created = await createInboundLead({
      email: "a@nameonly.com",
      businessName: "Joe's Plumbing, LLC",
      source: "Free Tool",
    });

    const before = (await getLeads()).length;
    const again = await createInboundLead({
      // No email/phone overlap — only the normalized name matches.
      email: "",
      businessName: "Joes Plumbing LLC",
      source: "Business Analysis",
    });

    expect(again.created).toBe(false);
    expect(again.id).toBe(created.id);
    expect((await getLeads()).length).toBe(before);
  });
});
