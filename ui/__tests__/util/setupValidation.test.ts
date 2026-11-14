import { MIN_PASSWORD_LENGTH, validatePasswords } from "util/wallet/setupValidation";

describe("validatePasswords", () => {
  it("accepts matching passwords of the minimum length", () => {
    expect(validatePasswords("x".repeat(MIN_PASSWORD_LENGTH), "x".repeat(MIN_PASSWORD_LENGTH))).toBeNull();
  });
  it("rejects a short password first", () => {
    expect(validatePasswords("short", "different")).toMatch(/at least 8/);
  });
  it("rejects a mismatch", () => {
    expect(validatePasswords("correct horse", "correct horsE")).toMatch(/do not match/);
  });
});
