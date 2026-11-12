import { CookieJar } from "tough-cookie";
import LocalStorageCookieStore, { STORE_KEY } from "../../util/local-storage-cookie-store";

// localStorage["__cookieStore__"] exactly as v1.0.x writes it (tough-cookie 2.5.0 +
// tough-cookie-web-storage-store 1.0.0), from the cookie strings util/saved-passwords
// builds in production. Values are fake. Note 2.5.0 kept SameSite in `extensions`, and
// `expires=2147483647` isn't a date, so those cookies have no expiry.
const V1_STORE = {
  "lbry.tv": {
    "/": {
      auth_token: {
        key: "auth_token",
        value: "FAKE_auth_token_0123456789abcdef",
        domain: "lbry.tv",
        path: "/",
        secure: true,
        extensions: ["SameSite=None"],
        hostOnly: false,
        creation: "2026-11-12T02:25:31.845Z",
        lastAccessed: "2026-11-12T02:25:31.845Z",
      },
      saved_password: {
        key: "saved_password",
        value: "FAKE_saved_password",
        domain: "lbry.tv",
        path: "/",
        secure: true,
        extensions: ["SameSite=None"],
        hostOnly: false,
        creation: "2026-11-12T02:25:31.846Z",
        lastAccessed: "2026-11-12T02:25:31.846Z",
      },
      pref: {
        key: "pref",
        value: "1",
        expires: "2031-01-01T00:00:00.000Z",
        domain: "lbry.tv",
        path: "/",
        hostOnly: true,
        creation: "2026-11-12T02:25:31.847Z",
        lastAccessed: "2026-11-12T02:25:31.847Z",
      },
    },
  },
};

// What the shim maps file://.../index.html to in packaged builds.
const URL = "https://lbry.tv/index.html";

function memoryStorage(initial?: object) {
  const data = new Map<string, string>();
  if (initial) data.set(STORE_KEY, JSON.stringify(initial));
  return {
    data,
    getItem: (key: string) => (data.has(key) ? (data.get(key) as string) : null),
    setItem: (key: string, value: string) => void data.set(key, String(value)),
  };
}

const jarFor = (storage: ReturnType<typeof memoryStorage>) => new CookieJar(new LocalStorageCookieStore(storage));
const cookieHeader = (jar: CookieJar, url = URL) => jar.getCookieStringSync(url);

describe("cookies saved by v1.0.x (tough-cookie 2.5.0)", () => {
  it("are all still readable, so users stay logged in", () => {
    const jar = jarFor(memoryStorage(V1_STORE));
    expect(cookieHeader(jar)).toBe(
      "auth_token=FAKE_auth_token_0123456789abcdef; saved_password=FAKE_saved_password; pref=1"
    );
  });

  it("keep their attributes", () => {
    const [auth] = jarFor(memoryStorage(V1_STORE))
      .getCookiesSync(URL)
      .filter((c) => c.key === "auth_token");
    expect(auth.secure).toBe(true);
    expect(auth.hostOnly).toBe(false);
    expect(auth.domain).toBe("lbry.tv");
    expect(auth.extensions).toEqual(["SameSite=None"]);
  });

  it("can be overwritten and deleted the way saved-passwords does it", () => {
    const storage = memoryStorage(V1_STORE);
    const jar = jarFor(storage);

    jar.setCookieSync("auth_token=NEW_token; expires=2147483647; path=/; SameSite=None; domain=lbry.tv; Secure;", URL);
    expect(cookieHeader(jar)).toContain("auth_token=NEW_token");

    jar.setCookieSync("saved_password=; Max-Age=-99999999; domain=lbry.tv; path=/;", URL);
    expect(cookieHeader(jar)).not.toContain("saved_password");
    expect(Object.keys(JSON.parse(storage.data.get(STORE_KEY) as string)["lbry.tv"]["/"])).toEqual([
      "auth_token",
      "pref",
    ]);
  });
});

describe("LocalStorageCookieStore", () => {
  it("persists across jars in the same storage, like an app restart", () => {
    const storage = memoryStorage();
    jarFor(storage).setCookieSync("auth_token=abc; path=/; domain=lbry.tv; Secure; SameSite=None", URL);
    expect(cookieHeader(jarFor(storage))).toBe("auth_token=abc");
  });

  it("writes the same {domain: {path: {key}}} layout v1.0.x used", () => {
    const storage = memoryStorage();
    jarFor(storage).setCookieSync("auth_token=abc; path=/; domain=lbry.tv", URL);
    const stored = JSON.parse(storage.data.get(STORE_KEY) as string);
    expect(stored["lbry.tv"]["/"].auth_token).toMatchObject({ key: "auth_token", value: "abc", domain: "lbry.tv" });
  });

  it("matches paths per RFC 6265", () => {
    const jar = jarFor(memoryStorage());
    jar.setCookieSync("a=1; path=/docs", "https://lbry.tv/docs/index.html");
    expect(cookieHeader(jar, "https://lbry.tv/docs/page")).toBe("a=1");
    expect(cookieHeader(jar, "https://lbry.tv/docs")).toBe("a=1");
    expect(cookieHeader(jar, "https://lbry.tv/docsx")).toBe("");
    expect(cookieHeader(jar, "https://lbry.tv/other")).toBe("");
  });

  it("shares domain cookies with subdomains but not host-only ones", () => {
    const jar = jarFor(memoryStorage(V1_STORE));
    expect(cookieHeader(jar, "https://sub.lbry.tv/")).toBe(
      "auth_token=FAKE_auth_token_0123456789abcdef; saved_password=FAKE_saved_password"
    );
  });

  it("keeps secure cookies off plain http", () => {
    const jar = jarFor(memoryStorage(V1_STORE));
    expect(cookieHeader(jar, "http://lbry.tv/")).toBe("pref=1");
  });

  it("treats corrupt storage as empty instead of throwing", () => {
    const storage = memoryStorage();
    storage.data.set(STORE_KEY, "{not json");
    const jar = jarFor(storage);
    expect(cookieHeader(jar)).toBe("");
    jar.setCookieSync("a=1; path=/", URL);
    expect(cookieHeader(jar)).toBe("a=1");
  });

  it("drops empty domains and paths when the last cookie goes", () => {
    const storage = memoryStorage();
    const jar = jarFor(storage);
    jar.setCookieSync("a=1; path=/x", "https://lbry.tv/x");
    jar.setCookieSync("a=; Max-Age=-1; path=/x", "https://lbry.tv/x");
    // tough-cookie keeps an expired cookie until the next read, then removes it.
    expect(cookieHeader(jar, "https://lbry.tv/x")).toBe("");
    expect(JSON.parse(storage.data.get(STORE_KEY) as string)).toEqual({});
  });

  it("supports removeAllCookies and getAllCookies", () => {
    const storage = memoryStorage(V1_STORE);
    const jar = jarFor(storage);
    expect(
      jar
        .serializeSync()!
        .cookies.map((c: any) => c.key)
        .sort()
    ).toEqual(["auth_token", "pref", "saved_password"]);
    jar.removeAllCookiesSync();
    expect(cookieHeader(jar)).toBe("");
  });
});
