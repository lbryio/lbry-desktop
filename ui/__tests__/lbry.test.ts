import Lbry, { apiCall } from "../lbry";

const DEFAULT_CONNECTION = "http://localhost:5279";

function mockFetchResult(body: any, status: number = 200) {
  return jest.fn().mockResolvedValue({
    status,
    json: () => Promise.resolve(body),
  });
}

afterEach(() => {
  jest.restoreAllMocks();
  Lbry.setDaemonConnectionString(DEFAULT_CONNECTION);
  Lbry.unsetApiHeader("X-Test");
});

describe("getMediaType", () => {
  it("detects media types from file extensions", () => {
    expect(Lbry.getMediaType(null, "movie.mp4")).toBe("video");
    expect(Lbry.getMediaType(null, "song.FLAC")).toBe("audio");
    expect(Lbry.getMediaType(null, "picture.webp")).toBe("image");
    expect(Lbry.getMediaType(null, "main.cpp")).toBe("script");
    expect(Lbry.getMediaType(null, "notes.md")).toBe("document");
    expect(Lbry.getMediaType(null, "book.epub")).toBe("e-book");
    expect(Lbry.getMediaType(null, "model.stl")).toBe("3D-file");
    expect(Lbry.getMediaType(null, "issue1.cbz")).toBe("comic-book");
    expect(Lbry.getMediaType(null, "thing.lbry")).toBe("application");
  });

  it("classifies pdf as document (the document pattern wins over e-book)", () => {
    expect(Lbry.getMediaType(null, "paper.pdf")).toBe("document");
  });

  it("falls back to the content type prefix when the file name has no extension", () => {
    expect(Lbry.getMediaType("video/mp4", "no-extension")).toBe("video");
    expect(Lbry.getMediaType("audio/ogg", null)).toBe("audio");
  });

  it("returns unknown for an unrecognized extension even when a content type is present", () => {
    // Quirk preserved from the original JS: an extension that matches no
    // pattern does NOT fall back to the content type.
    expect(Lbry.getMediaType("video/mp4", "file.xyz")).toBe("unknown");
  });

  it("returns unknown when neither input helps", () => {
    expect(Lbry.getMediaType(null, null)).toBe("unknown");
    expect(Lbry.getMediaType(undefined, undefined)).toBe("unknown");
  });
});

describe("api request headers", () => {
  it("sets and unsets custom headers", () => {
    Lbry.setApiHeader("X-Test", "yes");
    expect(Lbry.getApiRequestHeaders()).toMatchObject({
      "Content-Type": "application/json-rpc",
      "X-Test": "yes",
    });

    Lbry.unsetApiHeader("X-Test");
    expect(Lbry.getApiRequestHeaders()).not.toHaveProperty("X-Test");
  });
});

describe("apiCall", () => {
  it("POSTs a JSON-RPC 2.0 request to the daemon and resolves the result", async () => {
    const fetchMock = mockFetchResult({ jsonrpc: "2.0", result: { ok: true }, id: 1 });
    (globalThis as any).fetch = fetchMock;

    const result = await new Promise((resolve, reject) => {
      apiCall("resolve", { urls: ["lbry://one"] }, resolve, reject);
    });

    expect(result).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe(`${DEFAULT_CONNECTION}?m=resolve`);
    expect(options.method).toBe("POST");
    const body = JSON.parse(options.body);
    expect(body).toMatchObject({
      jsonrpc: "2.0",
      method: "resolve",
      params: { urls: ["lbry://one"] },
    });
    expect(typeof body.id).toBe("number");
  });

  it("rejects when the daemon responds with an error payload", async () => {
    (globalThis as any).fetch = mockFetchResult({
      jsonrpc: "2.0",
      error: { message: "boom" },
      id: 1,
    });

    await expect(
      new Promise((resolve, reject) => {
        apiCall("resolve", {}, resolve, reject);
      })
    ).rejects.toMatchObject({ message: "boom" });
  });

  it("rejects on a non-2xx HTTP response", async () => {
    (globalThis as any).fetch = mockFetchResult({ error: "server exploded" }, 500);

    await expect(
      new Promise((resolve, reject) => {
        apiCall("resolve", {}, resolve, reject);
      })
    ).rejects.toBeInstanceOf(Error);
  });

  it("uses the configured daemon connection string", async () => {
    const fetchMock = mockFetchResult({ jsonrpc: "2.0", result: 1, id: 1 });
    (globalThis as any).fetch = fetchMock;
    Lbry.setDaemonConnectionString("http://example.com:5279");

    await new Promise((resolve, reject) => {
      apiCall("status", {}, resolve, reject);
    });

    expect(fetchMock.mock.calls[0][0]).toBe("http://example.com:5279?m=status");
  });
});

describe("the Lbry proxy", () => {
  it("forwards unknown method names to the daemon as JSON-RPC calls", async () => {
    const fetchMock = mockFetchResult({ jsonrpc: "2.0", result: "pong", id: 1 });
    (globalThis as any).fetch = fetchMock;

    const result = await (Lbry as any).some_future_method({ a: 1 });

    expect(result).toBe("pong");
    expect(fetchMock.mock.calls[0][0]).toBe(`${DEFAULT_CONNECTION}?m=some_future_method`);
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).params).toEqual({ a: 1 });
  });

  it("exposes known SDK methods that call through to the daemon", async () => {
    const fetchMock = mockFetchResult({ jsonrpc: "2.0", result: { version: "x" }, id: 1 });
    (globalThis as any).fetch = fetchMock;

    const result = await Lbry.version();

    expect(result).toEqual({ version: "x" });
    expect(fetchMock.mock.calls[0][0]).toBe(`${DEFAULT_CONNECTION}?m=version`);
  });
});

describe("method overrides", () => {
  afterEach(() => {
    delete Lbry.overrides.address_unused;
    delete Lbry.overrides.fake_failure;
  });

  it("answers a method from its override without calling the daemon", async () => {
    const fetchMock = mockFetchResult({ result: "from the daemon" });
    (global as any).fetch = fetchMock;
    Lbry.setOverride("address_unused", async () => "from the wallet");

    await expect(Lbry.address_unused()).resolves.toBe("from the wallet");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("passes the params to the override and rejects with its error", async () => {
    const override = jest.fn().mockRejectedValue(new Error("There is no wallet yet."));
    Lbry.setOverride("fake_failure", override);

    await expect(new Promise((resolve, reject) => apiCall("fake_failure", { a: 1 }, resolve, reject))).rejects.toThrow(
      "There is no wallet yet."
    );
    expect(override).toHaveBeenCalledWith({ a: 1 });
  });

  it("still sends methods without an override to the daemon", async () => {
    const fetchMock = mockFetchResult({ result: "from the daemon" });
    (global as any).fetch = fetchMock;
    await expect(Lbry.address_unused()).resolves.toBe("from the daemon");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
