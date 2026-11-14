/**
 * @jest-environment jsdom
 */
import { setSavedPassword, getSavedPassword } from "util/saved-passwords";

const clearCookies = () => {
  document.cookie.split(";").forEach((c) => {
    const name = c.split("=")[0].trim();
    if (name) document.cookie = `${name}=; Max-Age=-99999999; path=/;`;
  });
};

beforeEach(clearCookies);

describe("setSavedPassword", () => {
  // #713: the Promise was created and never resolved, so awaiting it hung forever.
  it("settles, so callers can await it", async () => {
    await expect(setSavedPassword("pw", false)).resolves.toBeUndefined();
    await expect(setSavedPassword("pw", true)).resolves.toBeUndefined();
    await expect(setSavedPassword(null, true)).resolves.toBeUndefined();
  });

  it("keeps the password for the session without writing a cookie when saveToDisk is false", async () => {
    await setSavedPassword("session-only", false);
    expect(document.cookie).not.toContain("saved_password");
    await expect(getSavedPassword()).resolves.toBe("session-only");
  });

  it("writes a cookie when saveToDisk is true", async () => {
    await setSavedPassword("remember-me", true);
    expect(document.cookie).toContain("saved_password=remember-me");
  });

  it("an empty password with saveToDisk removes the saved cookie", async () => {
    await setSavedPassword("remember-me", true);
    expect(document.cookie).toContain("saved_password=remember-me");
    await setSavedPassword(null, true);
    expect(document.cookie).not.toContain("saved_password");
  });
});
