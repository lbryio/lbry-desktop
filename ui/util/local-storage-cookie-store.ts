/*
  A synchronous tough-cookie Store backed by Web Storage (localStorage), used by
  the document.cookie shim in util/electron-cookies.

  Replaces tough-cookie-web-storage-store 1.0.0, which only works with
  tough-cookie 2.x: 4.x calls findCookies(domain, path, allowSpecialUseDomain,
  callback) with four arguments, so the old store would call a boolean as its
  callback (#667).

  The storage format is unchanged, so cookies saved by v1.0.x (including the
  auth token from util/saved-passwords) keep working:

    localStorage["__cookieStore__"] = JSON { [domain]: { [path]: { [key]: Cookie.toJSON() } } }

  It implements tough-cookie's Store interface without extending its Store
  class: that's a native ES2015 class, and our Babel config compiles classes to
  ES5, which can't call super() on it. CookieJar never checks instanceof Store.
*/
import { Cookie, pathMatch, permuteDomain } from "tough-cookie";

export const STORE_KEY = "__cookieStore__";

type CookieStorage = Pick<Storage, "getItem" | "setItem">;
type StoredCookies = Record<string, Record<string, Record<string, Record<string, unknown>>>>;
type Callback<T> = (error: Error | null, result?: T) => void;

function fromJSON(json: string | object | null | undefined): Cookie | null {
  return json ? Cookie.fromJSON(json) || null : null;
}

export default class LocalStorageCookieStore {
  // Lets CookieJar's *Sync methods (getCookiesSync, setCookieSync, ...) use this store.
  synchronous = true;

  private storage: CookieStorage;

  constructor(storage: CookieStorage) {
    this.storage = storage;
  }

  findCookie(domain: string, path: string, key: string, callback: Callback<Cookie | null>) {
    const paths = this.read()[domain];
    const cookies = paths && paths[path];
    callback(null, fromJSON(cookies && cookies[key]));
  }

  findCookies(
    domain: string,
    path: string | null,
    allowSpecialUseDomain: boolean | Callback<Cookie[]>,
    callback?: Callback<Cookie[]>
  ) {
    // Older callers pass (domain, path, callback).
    if (typeof allowSpecialUseDomain === "function") {
      callback = allowSpecialUseDomain;
      allowSpecialUseDomain = true;
    }
    const done = callback as Callback<Cookie[]>;

    if (!domain) {
      done(null, []);
      return;
    }

    const store = this.read();
    const found: Cookie[] = [];
    const domains = permuteDomain(domain, allowSpecialUseDomain) || [domain];

    for (const cookieDomain of domains) {
      const paths = store[cookieDomain];
      if (!paths) continue;

      for (const cookiePath of Object.keys(paths)) {
        if (path != null && !pathMatch(path, cookiePath)) continue;

        for (const json of Object.values(paths[cookiePath])) {
          const cookie = fromJSON(json);
          if (cookie) found.push(cookie);
        }
      }
    }

    done(null, found);
  }

  putCookie(cookie: Cookie, callback: Callback<void>) {
    const store = this.read();
    const domain = cookie.domain as string;
    const path = cookie.path as string;

    store[domain] = store[domain] || {};
    store[domain][path] = store[domain][path] || {};
    store[domain][path][cookie.key] = cookie.toJSON() as unknown as Record<string, unknown>;

    this.write(store);
    callback(null);
  }

  updateCookie(oldCookie: Cookie, newCookie: Cookie, callback: Callback<void>) {
    this.putCookie(newCookie, callback);
  }

  removeCookie(domain: string, path: string, key: string, callback: Callback<void>) {
    const store = this.read();
    const paths = store[domain];

    if (paths && paths[path]) {
      delete paths[path][key];
      if (!Object.keys(paths[path]).length) delete paths[path];
      if (!Object.keys(paths).length) delete store[domain];
      this.write(store);
    }

    callback(null);
  }

  removeCookies(domain: string, path: string | null, callback: Callback<void>) {
    const store = this.read();

    if (store[domain]) {
      if (path == null) {
        delete store[domain];
      } else {
        delete store[domain][path];
        if (!Object.keys(store[domain]).length) delete store[domain];
      }
      this.write(store);
    }

    callback(null);
  }

  removeAllCookies(callback: Callback<void>) {
    this.write({});
    callback(null);
  }

  getAllCookies(callback: Callback<Cookie[]>) {
    const store = this.read();
    const cookies: Cookie[] = [];

    for (const paths of Object.values(store)) {
      for (const keys of Object.values(paths)) {
        for (const json of Object.values(keys)) {
          const cookie = fromJSON(json);
          if (cookie) cookies.push(cookie);
        }
      }
    }

    // Oldest first, as tough-cookie's MemoryCookieStore does.
    cookies.sort((a, b) => (a.creationIndex || 0) - (b.creationIndex || 0));
    callback(null, cookies);
  }

  private read(): StoredCookies {
    const json = this.storage.getItem(STORE_KEY);
    if (json == null) return {};

    try {
      const parsed = JSON.parse(json);
      return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
    } catch (e) {
      return {};
    }
  }

  private write(store: StoredCookies) {
    this.storage.setItem(STORE_KEY, JSON.stringify(store));
  }
}
