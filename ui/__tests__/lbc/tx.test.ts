// Ported from lBC-wallet-with-mining-ability packages/core/test/tx.test.ts @ 93e19c1 (vitest -> Jest).
import { MAINNET } from "../../../extras/lbc/networks.js";
import { fromHex, toHex } from "../../../extras/lbc/encoding/bytes.js";
import { Transaction } from "../../../extras/lbc/tx/transaction.js";
import {
  classifyOutput,
  decompile,
  p2pkhScript,
  supportScript,
  parseClaimPrefix,
  stripClaimPrefix,
} from "../../../extras/lbc/script/script.js";
import { decodeAddress, scriptToAddress } from "../../../extras/lbc/address.js";
import { deriveAccountKey, derivePrivateKey, AddressDeriver, publicOnly } from "../../../extras/lbc/keys/hd.js";
import { signP2pkhInput, verifyP2pkhInput, legacySighash } from "../../../extras/lbc/tx/sign.js";
import {
  assembleTransaction,
  estimateSize,
  InsufficientFundsError,
  MAX_INPUTS,
  TooManyInputsError,
  selectAll,
  selectCoins,
  signTransaction,
  type Utxo,
} from "../../../extras/lbc/tx/builder.js";

// Raw transactions from lbry-sdk tests/unit/wallet/test_transaction.py
const GENESIS_TX =
  "01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff1f04ffff001d010417696e736572742074696d657374616d7020737472696e67ffffffff01000004bfc91b8e001976a914345991dbf57bfb014b87006acdfafbfc5fe8292f88ac00000000";
const CLAIM_TX =
  "01000000012433e1b327603843b083344dbae5306ff7927f87ebbc5ae9eb50856c5b53fd1d000000006a47304402201a91e1023d11c383a11e26bf8f9034087b15d8ada78fa565e0610455ffc8505e0220038a63a6ecb399723d4f1f78a20ddec0a78bf8fb6c75e63e166ef780f3944fbf0121021810150a2e4b088ec51b20cbe1b335962b634545860733367824d5dc3eda767dffffffff028096980000000000fdff00b504636174734cdc080110011a7808011230080410011a084d616361726f6e6922002a003214416c6c207269676874732072657365727665642e38004a0052005a001a42080110011a30add80aaf02559ba09853636a0658c42b727cb5bb4ba8acedb4b7fe656065a47a31878dbf9912135ddb9e13806cc1479d220a696d6167652f6a7065672a5c080110031a404180cc0fa4d3839ee29cca866baed25fafb43fca1eb3b608ee889d351d3573d042c7b83e2e643db0d8e062a04e6e9ae6b90540a2f95fe28638d0f18af4361a1c2214f73de93f4299fb32c32f949e02198a8e91101abd6d7576a914be16e4b0f9bd8f6d47d02b3a887049c36d3b84cb88ac0cd2520b000000001976a914f521178feb733a719964e1da4a9efb09dcc39cfa88ac00000000";
const P2SH_TX =
  "0200000001409223c2405238fdc516d4f2e8aa57637ce52d3b1ac42b26f1accdcda9697e79010000008a4730440220033d5286f161da717d9d1bc3c2bc28da7636b38fc0c6aefb1e0864212f05282c02205df3ce135e79c76d44489212f77ad4e3a838562e601e6377704fa6206a6ae44f012102261773e7eebe9da80a5653d865cc600362f8e7b2b598661139dd902b5b01ea101f03aaf30ab17576a914a3328f18ac1892a6667f713d7020ff3437d973c888acfeffffff0180ed3e17000000001976a914353352b7ce1e3c9c05ffcd6ae97609de2999744488accdf50a00";

const LBRY_SEED = "carbon smart garage balance margin twelve chest sword toast envelope bottom stomach absent";

describe("transaction parsing", () => {
  it("parses and re-serializes the genesis coinbase", () => {
    const tx = Transaction.fromHex(GENESIS_TX);
    expect(tx.version).toBe(1);
    expect(tx.isCoinbase()).toBe(true);
    expect(tx.outputs[0]!.value).toBe(40000000000000000n);
    expect(classifyOutput(tx.outputs[0]!.script).type).toBe("p2pkh");
    expect(tx.toHex()).toBe(GENESIS_TX);
    expect(tx.txid).toBe("b8211c82c3d15bcd78bba57005b86fed515149a53a425eb592c07af99fe559cc");
  });

  it("parses a claim transaction and classifies the claim output", () => {
    const tx = Transaction.fromHex(CLAIM_TX);
    expect(tx.txid).toBe("666c3d15de1d6949a4fe717126c368e274b36957dce29fd401138c1e87e92a62");
    expect(tx.inputs[0]!.txid).toBe("1dfd535b6c8550ebe95abceb877f92f76f30e5ba4d3483b043386027b3e13324");
    expect(tx.outputs[0]!.value).toBe(10000000n);
    const claim = classifyOutput(tx.outputs[0]!.script);
    expect(claim.type).toBe("p2pkh");
    expect(claim.claim?.kind).toBe("claim");
    expect(claim.claim?.name).toBe("cats");
    expect(toHex(claim.hash!)).toBe("be16e4b0f9bd8f6d47d02b3a887049c36d3b84cb");
    const change = classifyOutput(tx.outputs[1]!.script);
    expect(change.claim).toBeUndefined();
    expect(tx.outputs[1]!.value).toBe(189977100n);
    expect(tx.toHex()).toBe(CLAIM_TX);
    // Hubs index the claim under the owner's address
    expect(scriptToAddress(tx.outputs[0]!.script, MAINNET)).toBe(scriptToAddress(p2pkhScript(claim.hash!), MAINNET));
  });

  it("parses a version 2 transaction with locktime", () => {
    const tx = Transaction.fromHex(P2SH_TX);
    expect(tx.txid).toBe("e466881128889d1cc4110627753051c22e72a81d11229a1a1337da06940bebcf");
    expect(tx.version).toBe(2);
    expect(tx.locktime).toBe(718285);
    expect(tx.inputs[0]!.sequence).toBe(4294967294);
    expect(tx.toHex()).toBe(P2SH_TX);
  });

  it("round-trips segwit serialization and keeps txid witness-free", () => {
    const tx = Transaction.fromHex(CLAIM_TX);
    tx.inputs[0]!.witness = [fromHex("aa"), fromHex("bbcc")];
    const again = Transaction.fromBytes(tx.toBytes());
    expect(again.inputs[0]!.witness.map(toHex)).toEqual(["aa", "bbcc"]);
    expect(again.txid).toBe("666c3d15de1d6949a4fe717126c368e274b36957dce29fd401138c1e87e92a62");
    expect(again.wtxid).not.toBe(again.txid);
  });
});

describe("claim scripts", () => {
  const owner = fromHex("be16e4b0f9bd8f6d47d02b3a887049c36d3b84cb");
  const claimId = fromHex("00112233445566778899aabbccddeeff00112233");

  it("builds and parses support scripts (the format used for tips)", () => {
    const script = supportScript("@channel", claimId, p2pkhScript(owner));
    const prefix = parseClaimPrefix(script)!;
    expect(prefix.kind).toBe("support");
    expect(new TextDecoder().decode(prefix.name)).toBe("@channel");
    expect(toHex(stripClaimPrefix(script))).toBe(toHex(p2pkhScript(owner)));
    const c = classifyOutput(script);
    expect(c.type).toBe("p2pkh");
    expect(c.claim?.claimId).toBe("33221100ffeeddccbbaa99887766554433221100");
  });

  it("parses the support-with-value and update variants", () => {
    const name = new TextEncoder().encode("n");
    const withValue = new Uint8Array([
      0xb6,
      1,
      ...name,
      20,
      ...claimId,
      2,
      0xde,
      0xad,
      0x6d,
      0x6d,
      ...p2pkhScript(owner),
    ]);
    expect(parseClaimPrefix(withValue)?.kind).toBe("support");
    expect(parseClaimPrefix(withValue)?.value).toBeDefined();
    const update = new Uint8Array([0xb7, 1, ...name, 20, ...claimId, 1, 0x00, 0x6d, 0x6d, ...p2pkhScript(owner)]);
    expect(parseClaimPrefix(update)?.kind).toBe("update");
    expect(toHex(stripClaimPrefix(update))).toBe(toHex(p2pkhScript(owner)));
  });

  it("rejects malformed claim scripts", () => {
    expect(parseClaimPrefix(new Uint8Array([0xb6, 1, 0x41]))).toBeNull();
    // claim id must be 20 bytes
    expect(parseClaimPrefix(new Uint8Array([0xb6, 1, 0x41, 2, 1, 2, 0x6d, 0x75]))).toBeNull();
    expect(decompile(new Uint8Array([0x05, 1, 2]))).toBeNull();
  });
});

describe("signing", () => {
  it("reproduces the lbry-sdk TestTransactionSigning signature byte-for-byte", () => {
    const account = deriveAccountKey(LBRY_SEED, "lbry", MAINNET);
    const deriver = new AddressDeriver(publicOnly(account, MAINNET), MAINNET);
    const hash1 = decodeAddress(deriver.derive(0, 0).address, MAINNET).hash;
    const hash2 = decodeAddress(deriver.derive(0, 1).address, MAINNET).hash;

    // get_output(2*COIN, pubkey_hash1): a version-1 tx with no inputs and one output.
    const funding = new Transaction();
    funding.outputs.push({ value: 200000000n, script: p2pkhScript(hash1) });

    const tx = new Transaction();
    tx.inputs.push({ txid: funding.txid, vout: 0, scriptSig: new Uint8Array(0), sequence: 0xffffffff, witness: [] });
    tx.outputs.push({ value: 190000000n, script: p2pkhScript(hash2) });
    const key = derivePrivateKey(account, 0, 0);
    signP2pkhInput(tx, 0, p2pkhScript(hash1), key);
    const sig = decompile(tx.inputs[0]!.scriptSig)![0]!.data!;
    expect(toHex(sig)).toBe(
      "304402200dafa26ad7cf38c5a971c8a25ce7d85a076235f146126762296b1223c42ae21e022020ef9eeb8398327891008c5c0be4357683f12cb22346691ff23914f457bf679601"
    );
    expect(verifyP2pkhInput(tx, 0, p2pkhScript(hash1))).toBe(true);
    // Tampering invalidates the signature
    tx.outputs[0]!.value -= 1n;
    expect(verifyP2pkhInput(tx, 0, p2pkhScript(hash1))).toBe(false);
  });

  it("signs support outputs using the full claim script as scriptCode", () => {
    const account = deriveAccountKey(LBRY_SEED, "lbry", MAINNET);
    const deriver = new AddressDeriver(publicOnly(account, MAINNET), MAINNET);
    const hash = decodeAddress(deriver.derive(0, 0).address, MAINNET).hash;
    const prev = supportScript("cats", new Uint8Array(20).fill(3), p2pkhScript(hash));
    const tx = new Transaction();
    tx.inputs.push({ txid: "ab".repeat(32), vout: 1, scriptSig: new Uint8Array(0), sequence: 0xffffffff, witness: [] });
    tx.outputs.push({ value: 1000n, script: p2pkhScript(hash) });
    signP2pkhInput(tx, 0, prev, derivePrivateKey(account, 0, 0));
    expect(verifyP2pkhInput(tx, 0, prev)).toBe(true);
    // Signature commits to the claim prefix: verifying against the bare P2PKH script fails.
    expect(verifyP2pkhInput(tx, 0, p2pkhScript(hash))).toBe(false);
    expect(toHex(legacySighash(tx, 0, prev))).not.toBe(toHex(legacySighash(tx, 0, p2pkhScript(hash))));
  });

  it("refuses to sign with a key that does not own the output", () => {
    const account = deriveAccountKey(LBRY_SEED, "lbry", MAINNET);
    const tx = new Transaction();
    tx.inputs.push({ txid: "ab".repeat(32), vout: 0, scriptSig: new Uint8Array(0), sequence: 0xffffffff, witness: [] });
    tx.outputs.push({ value: 1000n, script: p2pkhScript(new Uint8Array(20)) });
    expect(() =>
      signP2pkhInput(tx, 0, p2pkhScript(new Uint8Array(20).fill(9)), derivePrivateKey(account, 0, 0))
    ).toThrow(/does not match/);
  });
});

describe("coin selection and fees", () => {
  const script = p2pkhScript(new Uint8Array(20).fill(1));
  const change = p2pkhScript(new Uint8Array(20).fill(2));
  const coin = (value: bigint, height = 100, n = 0): Utxo => ({
    txid: n.toString(16).padStart(64, "0"),
    vout: 0,
    value,
    script,
    address: "x",
    height,
  });

  it("estimates sizes like lbry-sdk (148-byte inputs, 34-byte P2PKH outputs, 10 bytes overhead)", () => {
    expect(estimateSize(1, [script])).toBe(10 + 148 + 34);
    expect(estimateSize(2, [script, change])).toBe(10 + 2 * 148 + 2 * 34);
  });

  it("picks the smallest single coin that covers the payment", () => {
    const coins = [coin(5_00000000n, 100, 1), coin(1_00000000n, 100, 2), coin(2_00000000n, 100, 3)];
    const s = selectCoins(coins, [{ script, value: 1_50000000n }], change, 50);
    expect(s.inputs).toHaveLength(1);
    expect(s.inputs[0]!.value).toBe(2_00000000n);
    expect(s.fee).toBe(BigInt((10 + 148 + 68) * 50));
    expect(s.change).toBe(2_00000000n - 1_50000000n - s.fee);
  });

  it("accumulates coins when no single coin suffices and absorbs dust change", () => {
    const coins = [coin(60000n, 100, 1), coin(50000n, 100, 2), coin(40000n, 100, 3)];
    const s = selectCoins(coins, [{ script, value: 90000n }], change, 1);
    expect(s.inputs.map((u) => u.value)).toEqual([60000n, 50000n]);
    const total = 110000n;
    expect(s.change === 0n ? total - 90000n : s.fee).toBe(s.fee);
  });

  it("prefers confirmed coins", () => {
    const coins = [coin(3_00000000n, 0, 1), coin(3_00000000n, 50, 2)];
    const s = selectCoins(coins, [{ script, value: 1_00000000n }], change, 50);
    expect(s.inputs[0]!.height).toBe(50);
  });

  it("throws InsufficientFundsError with the shortfall", () => {
    expect(() => selectCoins([coin(1000n)], [{ script, value: 5000n }], change, 50)).toThrow(InsufficientFundsError);
  });

  it("sends max by spending everything minus fee", () => {
    const coins = [coin(1_00000000n, 100, 1), coin(2_00000000n, 100, 2)];
    const r = selectAll(coins, script, 50);
    expect(r.inputs).toHaveLength(2);
    expect(r.fee).toBe(BigInt((10 + 2 * 148 + 34) * 50));
    expect(r.value).toBe(3_00000000n - r.fee);
  });

  it("keeps one transaction within what the network accepts", () => {
    // A mining wallet with many small payouts: send max spends the largest MAX_INPUTS coins,
    // a fixed amount that would need more than that is refused with a clear error.
    const many = Array.from({ length: MAX_INPUTS + 100 }, (_, i) => coin(BigInt(10000 + i), 100, i + 1));
    const r = selectAll(many, script, 1);
    expect(r.inputs).toHaveLength(MAX_INPUTS);
    expect(r.inputs.every((u) => u.value >= BigInt(10000 + 100))).toBe(true);
    expect(() => selectCoins(many, [{ script, value: BigInt(10000 * (MAX_INPUTS + 50)) }], change, 1)).toThrow(
      TooManyInputsError
    );
  });

  it("assembles and signs a payment end-to-end with self-verification", () => {
    const account = deriveAccountKey(LBRY_SEED, "lbry", MAINNET);
    const deriver = new AddressDeriver(publicOnly(account, MAINNET), MAINNET);
    const addr = deriver.derive(0, 3).address;
    const own = p2pkhScript(decodeAddress(addr, MAINNET).hash);
    const utxos: Utxo[] = [
      { txid: "cd".repeat(32), vout: 2, value: 5_00000000n, script: own, address: addr, height: 10 },
    ];
    const sel = selectCoins(utxos, [{ script, value: 1_00000000n }], change, 50);
    const payment = assembleTransaction(sel.inputs, [{ script, value: 1_00000000n }], {
      script: change,
      value: sel.change,
    });
    const signed = signTransaction(payment, () => derivePrivateKey(account, 0, 3));
    expect(signed.inputs[0]!.scriptSig.length).toBeGreaterThan(100);
    expect(signed.size).toBeLessThanOrEqual(sel.size);
    expect(payment.fee).toBe(sel.fee);
    expect(signed.outputs[1]!.value).toBe(sel.change);
  });
});
