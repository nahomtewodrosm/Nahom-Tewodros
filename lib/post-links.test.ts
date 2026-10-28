import {
  formatPostLinks,
  parsePostLinks,
  serializePostLinks,
} from "./post-links";

describe("post social links", () => {
  it("serializes and formats labeled links", () => {
    const stored = serializePostLinks(
      "X | https://x.com/nahom\nLinkedIn | https://linkedin.com/in/nahom",
    );

    expect(parsePostLinks(stored)).toEqual([
      { label: "X", url: "https://x.com/nahom" },
      { label: "LinkedIn", url: "https://linkedin.com/in/nahom" },
    ]);
    expect(formatPostLinks(stored)).toBe(
      "X | https://x.com/nahom\nLinkedIn | https://linkedin.com/in/nahom",
    );
  });

  it("accepts bare social URLs and adds HTTPS", () => {
    expect(serializePostLinks("https://x.com/nahom\nlinkedin.com/in/nahom")).toBe(
      JSON.stringify([
        { label: "x.com", url: "https://x.com/nahom" },
        { label: "linkedin.com", url: "https://linkedin.com/in/nahom" },
      ]),
    );
  });

  it("rejects malformed or non-HTTP links", () => {
    expect(() => serializePostLinks("X | javascript:alert(1)")).toThrow(
      "Invalid social link on line 1",
    );
    expect(parsePostLinks("not-json")).toEqual([]);
  });
});
