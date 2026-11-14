import fs from "fs";
import os from "os";
import path from "path";
import { balanceOf, dewiesToString, newClaimId, unspentOutputs } from "../../../electron/wallet/balance";
import { WalletService } from "../../../electron/wallet/service";
import { WalletStore } from "../../../electron/wallet/store";
import { Transaction } from "../../../extras/lbc/tx/transaction";
import { MAINNET } from "../../../extras/lbc/networks";
import { addressToScript } from "../../../extras/lbc/address";
import { OP, pushData, supportScript } from "../../../extras/lbc/script/script";
import { concatBytes, fromHex, reverseBytes, utf8Encode } from "../../../extras/lbc/encoding/bytes";

const SEED = "carbon smart garage balance margin twelve chest sword toast envelope bottom stomach absent";
const FAST = { N: 1 << 10, r: 8, p: 1 };
const LBC = 100_000_000n;
const NETWORK = MAINNET;
const OTHER = "bCqJrLHdoiRqEZ1whFZ3WHNb33bP34SuGx"; // any address that is not one of the wallet's own in these tests

let dir: string;
beforeEach(() => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), "lbry-wallet-balance-"));
});
afterEach(() => fs.rmSync(dir, { recursive: true, force: true }));

const pay = (address: string) => addressToScript(address, NETWORK);
const claimScript = (name: string, payee: Uint8Array) =>
  concatBytes(
    Uint8Array.of(OP.OP_CLAIM_NAME),
    pushData(utf8Encode(name)),
    pushData(utf8Encode("value")),
    Uint8Array.of(OP.OP_2DROP, OP.OP_DROP),
    payee
  );

function makeTx(inputs: Array<[string, number]>, outputs: Array<[bigint, Uint8Array]>, nonce = 0) {
  const tx = new Transaction();
  tx.locktime = nonce; // keeps two otherwise identical transactions apart
  tx.inputs = inputs.map(([txid, vout]) => ({ txid, vout, scriptSig: Uint8Array.of(1), sequence: 0, witness: [] }));
  tx.outputs = outputs.map(([value, script]) => ({ value, script }));
  return tx;
}
const fundingInput: Array<[string, number]> = [["11".repeat(32), 0]];

describe("dewiesToString", () => {
  it("writes amounts the way lbry-sdk does", () => {
    expect(dewiesToString(0n)).toBe("0.0");
    expect(dewiesToString(LBC)).toBe("1.0");
    expect(dewiesToString(150_000_000n)).toBe("1.5");
    expect(dewiesToString(1_234_567_801n)).toBe("12.34567801");
    expect(dewiesToString(1n)).toBe("0.00000001");
  });
});

describe("newClaimId", () => {
  it("is 20 bytes of hex and depends on the output index", () => {
    const id = newClaimId("22".repeat(32), 0);
    expect(id).toMatch(/^[0-9a-f]{40}$/);
    expect(newClaimId("22".repeat(32), 1)).not.toBe(id);
  });
});

describe("unspentOutputs and balanceOf", () => {
  const mine = "bM8Pi76reHy8eogAgCTUFNLfmAADZuL5LS";
  const own = new Set([mine]);

  it("counts only outputs to the wallet's addresses, and not ones already spent", () => {
    const received = makeTx(fundingInput, [
      [10n * LBC, pay(mine)],
      [5n * LBC, pay(OTHER)],
    ]);
    const spendsIt = makeTx(
      [[received.txid, 0]],
      [
        [9n * LBC, pay(OTHER)],
        [LBC - 1000n, pay(mine)],
      ],
      1
    );

    const before = unspentOutputs([{ hex: received.toHex(), height: 5 }], own, NETWORK);
    expect(before.map((o) => o.value)).toEqual([10n * LBC]);
    expect(balanceOf(before).total).toBe("10.0");

    const after = unspentOutputs(
      [
        { hex: received.toHex(), height: 5 },
        { hex: spendsIt.toHex(), height: 0 },
      ],
      own,
      NETWORK
    );
    expect(after.map((o) => o.value)).toEqual([LBC - 1000n]);
    expect(balanceOf(after).total).toBe("0.99999");
    expect(balanceOf(after).available).toBe("0.99999");
  });

  it("reserves claims, supports on own claims, and tips on other claims", () => {
    const claimTx = makeTx(fundingInput, [[2n * LBC, claimScript("mine", pay(mine))]], 1);
    const claimId = newClaimId(claimTx.txid, 0);
    const supportOwn = makeTx(
      fundingInput,
      [[3n * LBC, supportScript("mine", reverseBytes(fromHex(claimId)), pay(mine))]],
      2
    );
    const tip = makeTx(fundingInput, [[LBC / 2n, supportScript("theirs", fromHex("ab".repeat(20)), pay(mine))]], 3);
    const plain = makeTx(fundingInput, [[10n * LBC, pay(mine)]], 4);

    const outputs = unspentOutputs(
      [claimTx, supportOwn, tip, plain].map((t) => ({ hex: t.toHex(), height: 1 })),
      own,
      NETWORK
    );
    expect(balanceOf(outputs)).toEqual({
      total: "15.5",
      available: "10.0",
      reserved: "5.5",
      reserved_subtotals: { claims: "2.0", supports: "3.0", tips: "0.5" },
    });
  });

  it("is zero for no outputs", () => {
    expect(balanceOf([])).toEqual({
      total: "0.0",
      available: "0.0",
      reserved: "0.0",
      reserved_subtotals: { claims: "0.0", supports: "0.0", tips: "0.0" },
    });
  });
});

describe("WalletService.balance", () => {
  // The hub's answers are filled in by each test, after it knows the wallet's first address.
  let history: Record<string, string[]> = {};
  let txs: Record<string, string> = {};
  const historyFor = (address: string) => history[address] || [];

  async function setup() {
    history = {};
    txs = {};
    const store = new WalletStore(dir, { kdfCost: FAST });
    await store.import({ password: "correct horse", mnemonic: SEED });
    const first = store.addresses(0, 0, 1)[0].address;
    const hub = {
      subscribeAddresses: async (addresses: string[]) => addresses.map((a) => (historyFor(a).length ? "ab" : null)),
      getHistory: async (a: string) => historyFor(a).map((txid) => ({ txid, height: 1 })),
      getTransactions: async (ids: string[]) => {
        const out = new Map<string, { hex: string; height: number }>();
        ids.forEach((id) => txs[id] && out.set(id, { hex: txs[id], height: 1 }));
        return out;
      },
    };
    return { service: new WalletService(store, async () => hub), first, store };
  }

  it("adds up what the wallet's used addresses hold", async () => {
    const { service, first } = await setup();
    const received = makeTx(fundingInput, [[7n * LBC, pay(first)]]);
    history[first] = [received.txid];
    txs[received.txid] = received.toHex();
    expect(await service.balance()).toEqual({
      total: "7.0",
      available: "7.0",
      reserved: "0.0",
      reserved_subtotals: { claims: "0.0", supports: "0.0", tips: "0.0" },
    });
  });

  it("shares one answer between calls made close together", async () => {
    const { service } = await setup();
    const spy = jest.spyOn(service as any, "computeBalance");
    await Promise.all([service.balance(), service.balance()]);
    await service.balance();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("does not keep a failure", async () => {
    const { service, first } = await setup();
    history[first] = ["44".repeat(32)];
    await expect(service.balance()).rejects.toThrow();
    history = {};
    expect((await service.balance()).total).toBe("0.0");
  });

  it("is zero for a wallet with no history", async () => {
    const { service } = await setup();
    expect((await service.balance()).total).toBe("0.0");
  });

  it("refuses to guess when the hub leaves out a transaction", async () => {
    const { service, first } = await setup();
    history[first] = ["33".repeat(32)];
    await expect(service.balance()).rejects.toThrow(/did not return 1 of the transactions/);
  });

  it("says so when the hub cannot list transactions", async () => {
    const store = new WalletStore(dir, { kdfCost: FAST });
    await store.import({ password: "correct horse", mnemonic: SEED });
    const service = new WalletService(store, async () => ({ subscribeAddresses: async (a) => a.map(() => null) }));
    await expect(service.balance()).rejects.toThrow(/cannot list transactions/);
  });
});
