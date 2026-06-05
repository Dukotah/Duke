import { describe, expect, it } from "vitest";
import { DEFAULT_TEMPLATES, personalize } from "./emailTemplates";
import { buildCadence, type PlaybookLead } from "@/lib/crm/playbook";

describe("emailTemplates — personalize", () => {
  it("replaces every variable case-insensitively", () => {
    const out = personalize("Hi {name} at {Business} in {CITY} — {fromName}", {
      name: "Joe", business: "Joe's Diner", city: "Sonoma", fromName: "Duke",
    });
    expect(out).toBe("Hi Joe at Joe's Diner in Sonoma — Duke");
  });

  it("falls back to 'there' for an empty/whitespace/missing name greeting", () => {
    expect(personalize("Hi {name},", {})).toBe("Hi there,");
    expect(personalize("Hi {name},", { name: "   " })).toBe("Hi there,");
    expect(personalize("Hi {name},", { name: "Sam" })).toBe("Hi Sam,");
  });

  it("renders missing business/city/fromName as empty strings", () => {
    expect(personalize("{business}|{city}|{fromName}", {})).toBe("||");
  });

  it("replaces every occurrence of a repeated token", () => {
    expect(personalize("{business} & {business}", { business: "Acme" })).toBe("Acme & Acme");
  });

  it("leaves text without tokens untouched", () => {
    expect(personalize("No tokens here", { name: "X" })).toBe("No tokens here");
  });
});

describe("emailTemplates — cadence integrity", () => {
  it("every follow-up cadence template key resolves to a real default template", () => {
    const keys = new Set(DEFAULT_TEMPLATES.map((t) => t.key));
    const leads: PlaybookLead[] = [
      { name: "No Site Co", tier: "A", website: "" },
      { name: "DIY Co", tier: "B", website: "diy.com", builder: "Wix" },
      { name: "Has Site Co", tier: "C", website: "hassite.com" },
    ];
    for (const lead of leads) {
      for (const touch of buildCadence(lead)) {
        expect(keys.has(touch.templateKey)).toBe(true);
      }
    }
  });
});
