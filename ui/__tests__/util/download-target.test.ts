import path from "path";
import { ANONYMOUS_FOLDER, DOWNLOAD_NAMING, getDownloadTarget, sanitizePathSegment } from "../../util/download-target";

// Dates in file names use the local calendar day; jest.config.js pins TZ=UTC.
const BASE = path.join(path.sep, "home", "me", "Downloads", "lbry");

// 2026-11-03T22:15:00Z
const RELEASE = Date.UTC(2026, 10, 3, 22, 15) / 1000;

function makeClaim(overrides: Record<string, any> = {}, value: Record<string, any> = {}): any {
  return {
    name: "fedora-45-plasma",
    timestamp: Date.UTC(2026, 10, 5) / 1000,
    signing_channel: { name: "@switchedtolinux" },
    ...overrides,
    value: {
      title: "Fedora 45 Plasma",
      release_time: RELEASE,
      source: { sd_hash: "abc", name: "fedora45.mp4", media_type: "video/mp4" },
      ...value,
    },
  };
}

const options = (overrides: Record<string, any> = {}): any => ({
  baseDir: BASE,
  byChannel: false,
  naming: DOWNLOAD_NAMING.ORIGINAL,
  ...overrides,
});

describe("getDownloadTarget", () => {
  it("changes nothing with the default settings", () => {
    expect(getDownloadTarget(makeClaim(), options())).toEqual({});
  });

  it("returns nothing for a missing claim", () => {
    expect(getDownloadTarget(null, options({ byChannel: true, naming: DOWNLOAD_NAMING.TITLE }))).toEqual({});
    expect(getDownloadTarget(undefined, options({ byChannel: true }))).toEqual({});
  });

  describe("channel folders", () => {
    it("saves into a folder named after the channel", () => {
      expect(getDownloadTarget(makeClaim(), options({ byChannel: true }))).toEqual({
        download_directory: path.join(BASE, "@switchedtolinux"),
      });
    });

    it("uses the Anonymous folder for claims without a channel", () => {
      const claim = makeClaim({ signing_channel: undefined });
      expect(getDownloadTarget(claim, options({ byChannel: true })).download_directory).toBe(
        path.join(BASE, ANONYMOUS_FOLDER)
      );
    });

    it("skips the folder when the download directory isn't known", () => {
      expect(getDownloadTarget(makeClaim(), options({ byChannel: true, baseDir: "" }))).toEqual({});
      expect(getDownloadTarget(makeClaim(), options({ byChannel: true, baseDir: null }))).toEqual({});
    });
  });

  describe("file naming", () => {
    it("names the file after the title, keeping the uploaded extension", () => {
      expect(getDownloadTarget(makeClaim(), options({ naming: DOWNLOAD_NAMING.TITLE }))).toEqual({
        file_name: "Fedora 45 Plasma.mp4",
      });
    });

    it("prefixes the release date", () => {
      expect(getDownloadTarget(makeClaim(), options({ naming: DOWNLOAD_NAMING.DATE_TITLE })).file_name).toBe(
        "2026-11-03 - Fedora 45 Plasma.mp4"
      );
    });

    it("falls back to the claim timestamp when there's no release time", () => {
      const claim = makeClaim({}, { release_time: undefined });
      expect(getDownloadTarget(claim, options({ naming: DOWNLOAD_NAMING.DATE_TITLE })).file_name).toBe(
        "2026-11-05 - Fedora 45 Plasma.mp4"
      );
    });

    it("drops the date when there's no time at all", () => {
      const claim = makeClaim({ timestamp: undefined }, { release_time: undefined });
      expect(getDownloadTarget(claim, options({ naming: DOWNLOAD_NAMING.DATE_TITLE })).file_name).toBe(
        "Fedora 45 Plasma.mp4"
      );
    });

    it("falls back to the claim name when there's no title", () => {
      const claim = makeClaim({}, { title: "   " });
      expect(getDownloadTarget(claim, options({ naming: DOWNLOAD_NAMING.TITLE })).file_name).toBe(
        "fedora-45-plasma.mp4"
      );
    });

    it("leaves the name to the daemon when nothing usable is left", () => {
      const claim = makeClaim({ name: "" }, { title: "???" });
      expect(getDownloadTarget(claim, options({ naming: DOWNLOAD_NAMING.TITLE }))).toEqual({});
    });

    it("takes the extension from the media type when the upload had none", () => {
      const claim = makeClaim({}, { source: { sd_hash: "abc", media_type: "audio/mpeg" } });
      expect(getDownloadTarget(claim, options({ naming: DOWNLOAD_NAMING.TITLE })).file_name).toBe(
        "Fedora 45 Plasma.mp3"
      );
    });

    it("ignores implausible extensions and unknown media types", () => {
      const weird = makeClaim({}, { source: { sd_hash: "abc", name: "notes.final draft", media_type: "x/unknown" } });
      expect(getDownloadTarget(weird, options({ naming: DOWNLOAD_NAMING.TITLE })).file_name).toBe("Fedora 45 Plasma");
    });

    it("lowercases the extension", () => {
      const claim = makeClaim({}, { source: { sd_hash: "abc", name: "CLIP.MP4" } });
      expect(getDownloadTarget(claim, options({ naming: DOWNLOAD_NAMING.TITLE })).file_name).toBe(
        "Fedora 45 Plasma.mp4"
      );
    });

    it("combines with channel folders", () => {
      expect(getDownloadTarget(makeClaim(), options({ byChannel: true, naming: DOWNLOAD_NAMING.DATE_TITLE }))).toEqual({
        download_directory: path.join(BASE, "@switchedtolinux"),
        file_name: "2026-11-03 - Fedora 45 Plasma.mp4",
      });
    });
  });
});

describe("sanitizePathSegment", () => {
  const clean = (value: string) => sanitizePathSegment(value, 150, 200);

  it("replaces characters Windows, macOS or Linux reject", () => {
    expect(clean('AC/DC: "Live" <at> Wembley | 1986?*')).toBe("AC DC Live at Wembley 1986");
    expect(clean("back\\slash")).toBe("back slash");
  });

  it("removes control characters and collapses whitespace", () => {
    expect(clean("tab\there\nnew\u0007line   end")).toBe("tab here new line end");
  });

  it("strips leading dots and trailing dots or spaces", () => {
    expect(clean("..hidden")).toBe("hidden");
    expect(clean("ends with dots...")).toBe("ends with dots");
    expect(clean(".")).toBe("");
    expect(clean("..")).toBe("");
  });

  it("escapes reserved Windows device names", () => {
    expect(clean("CON")).toBe("_CON");
    expect(clean("nul")).toBe("_nul");
    expect(clean("com1")).toBe("_com1");
    expect(clean("Console")).toBe("Console");
  });

  it("keeps emoji and other Unicode", () => {
    expect(clean("Café 🎸 日本語")).toBe("Café 🎸 日本語");
  });

  it("caps length by characters without splitting emoji", () => {
    const result = sanitizePathSegment("🎸".repeat(10), 5, 200);
    expect(Array.from(result)).toHaveLength(5);
    expect(result).toBe("🎸".repeat(5));
  });

  it("caps length by UTF-8 bytes", () => {
    // Each of these is 3 bytes in UTF-8.
    const result = sanitizePathSegment("日".repeat(100), 150, 200);
    expect(new TextEncoder().encode(result).length).toBeLessThanOrEqual(200);
    expect(result).toBe("日".repeat(66));
  });

  it("doesn't leave a trailing space or dot after truncating", () => {
    expect(sanitizePathSegment("abcd efgh", 5, 200)).toBe("abcd");
    expect(sanitizePathSegment("abcd.efgh", 5, 200)).toBe("abcd");
  });
});
