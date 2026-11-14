// makeSelectIsBlacklisted (#486): same answers as the old linear scan of the
// legacy blacklist, but the list (~24k outpoints) is read once to build a
// lookup map instead of being scanned for every tile on every store update.
// claims.ts only needs lbryinc's blacklist selectors; loading the whole lbryinc
// index under Jest runs into an import cycle that webpack's order avoids.
jest.mock("lbryinc", () => jest.requireActual("../../../extras/lbryinc/redux/selectors/blacklist"));

import { makeSelectIsBlacklisted } from "redux/selectors/claims";

const CHANNEL = { claim_id: "c0ffee", txid: "chan-tx", nout: 0, value_type: "channel" };
const SIGNED = { claim_id: "abc1", txid: "signed-tx", nout: 1, signing_channel: CHANNEL };
const UNSIGNED = { claim_id: "def2", txid: "unsigned-tx", nout: 2 };

const URI = {
  signed: "lbry://signed#abc1",
  unsigned: "lbry://unsigned#def2",
};

function state({ outpoints, censored = {} as Record<string, any> }: { outpoints?: any[] | null; censored?: any }) {
  return {
    claims: {
      byId: { abc1: SIGNED, def2: UNSIGNED, c0ffee: CHANNEL },
      claimsByUri: { [URI.signed]: "abc1", [URI.unsigned]: "def2" },
      blacklistedByUri: censored,
    },
    blacklist: { blackListedOutpoints: outpoints === null ? undefined : outpoints },
  };
}

const isBlacklisted = (s: any, uri: string) => makeSelectIsBlacklisted(uri)(s);

describe("makeSelectIsBlacklisted", () => {
  it("is true when the claim was censored on resolve", () => {
    expect(
      isBlacklisted(state({ outpoints: [], censored: { [URI.signed]: { name: "@LBRY-DMCA" } } }), URI.signed)
    ).toBe(true);
  });

  it("is true when the signing channel's outpoint is listed", () => {
    expect(isBlacklisted(state({ outpoints: [{ txid: "chan-tx", nout: 0 }] }), URI.signed)).toBe(true);
  });

  it("is true when a signed claim's own outpoint is listed", () => {
    expect(isBlacklisted(state({ outpoints: [{ txid: "signed-tx", nout: 1 }] }), URI.signed)).toBe(true);
  });

  it("is false when neither outpoint is listed (txid and nout must both match)", () => {
    const s = state({
      outpoints: [
        { txid: "chan-tx", nout: 9 },
        { txid: "other", nout: 1 },
      ],
    });
    expect(isBlacklisted(s, URI.signed)).toBe(false);
  });

  it("is false for an unsigned claim even if listed (as before; the ban map covers it)", () => {
    expect(isBlacklisted(state({ outpoints: [{ txid: "unsigned-tx", nout: 2 }] }), URI.unsigned)).toBe(false);
  });

  it("is false when the blacklist hasn't loaded", () => {
    expect(isBlacklisted(state({ outpoints: null }), URI.signed)).toBe(false);
  });

  it("reads the blacklist once, not once per tile per store update", () => {
    const list: any[] = [];
    for (let i = 0; i < 24000; i++) list.push({ txid: `tx${i}`, nout: 0 });
    list.push({ txid: "chan-tx", nout: 0 });

    let elementReads = 0;
    const counted = new Proxy(list, {
      get(target, prop, receiver) {
        if (typeof prop === "string" && /^\d+$/.test(prop)) elementReads++;
        return Reflect.get(target, prop, receiver);
      },
    });

    const base = state({ outpoints: counted });
    // 18 tiles, each re-running its selector on 10 store updates (new root
    // state, same blacklist), the way connect() does.
    for (let update = 0; update < 10; update++) {
      const s = { ...base, wallet: { tick: update } };
      for (let tile = 0; tile < 18; tile++) {
        expect(isBlacklisted(s, URI.signed)).toBe(true);
      }
    }
    expect(elementReads).toBeLessThanOrEqual(list.length);
  });
});
