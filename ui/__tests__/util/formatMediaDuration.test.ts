import formatMediaDuration from "../../util/formatMediaDuration";

describe("formatMediaDuration", () => {
  it("formats zero and defaults", () => {
    expect(formatMediaDuration()).toBe("00:00");
    expect(formatMediaDuration(0)).toBe("00:00");
  });

  it("formats minutes and seconds", () => {
    expect(formatMediaDuration(65)).toBe("01:05");
    expect(formatMediaDuration(599)).toBe("09:59");
  });

  it("includes hours only when needed", () => {
    expect(formatMediaDuration(3665)).toBe("01:01:05");
  });

  it("always includes hours for screen readers", () => {
    expect(formatMediaDuration(65, { screenReader: true })).toBe("00:01:05");
    expect(formatMediaDuration(3665, { screenReader: true })).toBe("01:01:05");
  });
});
