/**
 * @jest-environment jsdom
 */
// End to end through the document.cookie shim: document.cookie -> tough-cookie 4
// CookieJar -> LocalStorageCookieStore -> localStorage (#667).
import ElectronCookies from "../../util/electron-cookies";
import { STORE_KEY } from "../../util/local-storage-cookie-store";

beforeAll(() => {
  window.localStorage.clear();
  ElectronCookies.enable({ origin: "https://lbry.tv" });
});

it("stores cookies set through document.cookie in localStorage", () => {
  document.cookie = "auth_token=abc; path=/";
  expect(document.cookie).toBe("auth_token=abc");
  expect(JSON.parse(window.localStorage.getItem(STORE_KEY) as string)).toMatchObject({
    localhost: { "/": { auth_token: { value: "abc" } } },
  });
});

it("deletes cookies the way util/saved-passwords does", () => {
  document.cookie = "other=1; path=/";
  document.cookie = "auth_token=; Max-Age=-99999999; path=/;";
  expect(document.cookie).toBe("other=1");
});
