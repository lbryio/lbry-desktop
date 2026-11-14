import validateSendTx from "../../util/form-validation";

// A syntactically valid LBRY address: 'b' prefix + 33 base58 characters.
const VALID_ADDRESS = "bZk71abCp6d1yzEAiXkQpHQX8rF69eLNT1";

describe("validateSendTx", () => {
  it("accepts a valid b-prefixed address", () => {
    expect(validateSendTx(VALID_ADDRESS).address).toBe("");
  });

  it("rejects an address with the wrong prefix", () => {
    expect(validateSendTx("x" + VALID_ADDRESS.slice(1)).address).not.toBe("");
  });

  it("rejects an address that is too short", () => {
    expect(validateSendTx("bTooShort").address).not.toBe("");
  });

  it("rejects ambiguous base58 characters (0, O, I, l)", () => {
    expect(validateSendTx("b0k71abCp6d1yzEAiXkQpHQX8rF69eLNT1").address).not.toBe("");
  });

  it("rejects the empty string", () => {
    expect(validateSendTx("").address).not.toBe("");
  });
});
