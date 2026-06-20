import { describe, expect, it } from "vitest";
import { parseCSVLine } from "./route";

// parseCSVLine is the parser behind the hourly lead feed AND the CSV import/export
// features — a regression here silently corrupts lead data (shifted columns,
// dropped names), so the awkward edge cases are pinned down here. The parser is
// pure (no Redis/network), so importing the route module is side-effect-free.
describe("parseCSVLine", () => {
  it("splits a plain comma-separated row", () => {
    expect(parseCSVLine("a,b,c")).toEqual(["a", "b", "c"]);
  });

  it("keeps commas that live inside a quoted field", () => {
    // e.g. an address column: 123 Main St, Suite 4
    expect(parseCSVLine('Acme,"123 Main St, Suite 4",Sonoma')).toEqual([
      "Acme",
      "123 Main St, Suite 4",
      "Sonoma",
    ]);
  });

  it("unescapes a doubled double-quote inside a quoted field", () => {
    // CSV escapes a literal " as "" — must collapse to a single "
    expect(parseCSVLine('a,"say ""hi""",b')).toEqual(["a", 'say "hi"', "b"]);
  });

  it("preserves empty fields, including leading, middle, and trailing", () => {
    expect(parseCSVLine("a,,c")).toEqual(["a", "", "c"]);
    expect(parseCSVLine(",a,b")).toEqual(["", "a", "b"]);
    expect(parseCSVLine("a,b,")).toEqual(["a", "b", ""]);
  });

  it("treats a quoted empty string as an empty field", () => {
    expect(parseCSVLine('"",x')).toEqual(["", "x"]);
  });

  it("returns a single empty field for an empty line", () => {
    expect(parseCSVLine("")).toEqual([""]);
  });

  it("does not split on a single unquoted field", () => {
    expect(parseCSVLine("solo")).toEqual(["solo"]);
  });

  it("handles every field being quoted", () => {
    expect(parseCSVLine('"a","b","c"')).toEqual(["a", "b", "c"]);
  });
});
