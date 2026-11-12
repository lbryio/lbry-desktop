/*
  document.cookie for the packaged app.

  Packaged builds load the UI from file://, where Chromium doesn't keep cookies.
  enable() backs document.cookie with a tough-cookie jar persisted in
  localStorage and keyed to a real origin, so code that relies on cookies
  (util/saved-passwords keeps the auth token there) keeps working.

  Adapted from @meetfranz/electron-cookies 3.0.2, which read the app path through
  @electron/remote. That module stopped working when Electron 45 removed the
  main-process side (#647, #665); the app path now comes over IPC instead.

  Original: Copyright (c) 2016 Exponent, MIT License.
*/
import path from "path";
// @ts-expect-error - TS2305 - Module '"electron"' has no exported member 'ipcRenderer'.
import { ipcRenderer } from "electron";
import { CookieJar } from "tough-cookie";
import WebStorageCookieStore from "tough-cookie-web-storage-store";

let appPath: string | null = null;

function getAppPath(): string {
  if (appPath === null) {
    appPath = ipcRenderer.sendSync("app:getAppPath");
  }
  return appPath;
}

// Map a file:// page to `${origin}/<path relative to the app>` so cookies get a
// stable, real URL. Anything not on file:// (e.g. the dev server) is used as-is.
function getLocationString(origin: string | null | undefined): string {
  const location = window.location;
  if (!origin || location.protocol !== "file:") {
    return location.toString();
  }

  const relativePath = path.relative(getAppPath(), decodeURI(location.pathname));
  return `${origin}/${encodeURI(relativePath)}${location.search}${location.hash}`;
}

function enable(options?: { origin?: string }) {
  const origin = options ? options.origin : null;
  const cookieJar = new CookieJar(new WebStorageCookieStore(window.localStorage));

  Object.defineProperty(document, "cookie", {
    enumerable: true,
    configurable: true,
    get() {
      const cookies = cookieJar.getCookiesSync(getLocationString(origin));
      return cookies.map((cookie) => cookie.cookieString()).join("; ");
    },
    set(cookieString: string) {
      cookieJar.setCookieSync(cookieString, getLocationString(origin));
    },
  });
}

export default { enable };
