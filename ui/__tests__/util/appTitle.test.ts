import { titleWithVersion } from "util/appTitle";

describe("titleWithVersion", () => {
  it("shows just the app and version on the default page", () => {
    expect(titleWithVersion("LBRY", "1.0.3")).toBe("LBRY 1.0.3");
    expect(titleWithVersion("", "1.0.3")).toBe("LBRY 1.0.3");
    expect(titleWithVersion("  ", "1.0.3")).toBe("LBRY 1.0.3");
  });

  it("puts the page title first", () => {
    expect(titleWithVersion("Settings", "1.0.3")).toBe("Settings - LBRY 1.0.3");
    expect(titleWithVersion("some-stream-name", "1.0.4")).toBe("some-stream-name - LBRY 1.0.4");
  });

  it("copes with a missing version", () => {
    expect(titleWithVersion("Settings", "")).toBe("Settings - LBRY");
    expect(titleWithVersion("LBRY", undefined as unknown as string)).toBe("LBRY");
  });

  it("does not repeat the app name for a title that is already LBRY", () => {
    expect(titleWithVersion(" LBRY ", "1.0.3")).toBe("LBRY 1.0.3");
  });
});
