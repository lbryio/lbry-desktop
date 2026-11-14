// Works out what a wallet holds from the transactions of its addresses: its unspent outputs, and how much of
// that is tied up in claims, supports and tips (lbry-sdk's wallet_balance).
import { Transaction } from "../../extras/lbc/tx/transaction";
import { classifyOutput, claimIdToHex } from "../../extras/lbc/script/script";
import { scriptToAddress } from "../../extras/lbc/address";
import { hash160 } from "../../extras/lbc/crypto/hash";
import { concatBytes, hashFromHex, u32BE } from "../../extras/lbc/encoding/bytes";
import type { NetworkParams } from "../../extras/lbc/networks";

export interface OwnedOutput {
  txid: string;
  vout: number;
  /** Dewies (1 LBC = 100,000,000). */
  value: bigint;
  address: string;
  kind: "plain" | "claim" | "update" | "support";
  /** For claims, updates and supports: the claim this output is, or supports. */
  claimId?: string;
  height: number;
}

/** lbry-sdk's claim id for a new claim: hash160 of the txid (internal order) and the output index. */
export function newClaimId(txid: string, vout: number): string {
  return claimIdToHex(hash160(concatBytes(hashFromHex(txid), u32BE(vout))));
}

/** Every unspent output that pays one of `addresses`, given the transactions that touch them. */
export function unspentOutputs(
  transactions: { hex: string; height: number }[],
  addresses: Set<string>,
  network: Pick<NetworkParams, "pubKeyHashPrefix" | "scriptHashPrefix" | "bech32Hrp">
): OwnedOutput[] {
  const spent = new Set<string>();
  const owned: OwnedOutput[] = [];
  for (const { hex, height } of transactions) {
    const tx = Transaction.fromHex(hex);
    const txid = tx.txid;
    if (!tx.isCoinbase()) tx.inputs.forEach((input) => spent.add(`${input.txid}:${input.vout}`));
    tx.outputs.forEach((output, vout) => {
      const address = scriptToAddress(output.script, network);
      if (!address || !addresses.has(address)) return;
      const classified = classifyOutput(output.script);
      const claim = classified.claim;
      owned.push({
        txid,
        vout,
        value: output.value,
        address,
        kind: !claim ? "plain" : claim.kind,
        claimId: !claim ? undefined : claim.kind === "claim" ? newClaimId(txid, vout) : claim.claimId,
        height,
      });
    });
  }
  return owned.filter((o) => !spent.has(`${o.txid}:${o.vout}`));
}

export interface Balance {
  available: string;
  reserved: string;
  reserved_subtotals: { claims: string; supports: string; tips: string };
  total: string;
}

/** Dewies as lbry-sdk writes them: "1.5", "0.0", "12.00000001". */
export function dewiesToString(value: bigint): string {
  const whole = value / 100_000_000n;
  const fraction = (value % 100_000_000n).toString().padStart(8, "0").replace(/0+$/, "");
  return `${whole}.${fraction || "0"}`;
}

/**
 * Total is everything unspent. Claims and updates are reserved, and so are supports: the ones on your own claims
 * count as supports, the ones on anyone else's as tips.
 */
export function balanceOf(outputs: OwnedOutput[]): Balance {
  const ownClaims = new Set(outputs.filter((o) => o.kind === "claim" || o.kind === "update").map((o) => o.claimId));
  let total = 0n;
  let claims = 0n;
  let supports = 0n;
  let tips = 0n;
  for (const o of outputs) {
    total += o.value;
    if (o.kind === "claim" || o.kind === "update") claims += o.value;
    else if (o.kind === "support") (ownClaims.has(o.claimId) ? (supports += o.value) : (tips += o.value));
  }
  const reserved = claims + supports + tips;
  return {
    available: dewiesToString(total - reserved),
    reserved: dewiesToString(reserved),
    reserved_subtotals: {
      claims: dewiesToString(claims),
      supports: dewiesToString(supports),
      tips: dewiesToString(tips),
    },
    total: dewiesToString(total),
  };
}
