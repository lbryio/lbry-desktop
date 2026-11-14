// Vendored from bitcoinbrisbane/lBC-wallet-with-mining-ability (MIT), packages/core/src/script/script.ts @ 93e19c1.
// Keep verbatim so it can be refreshed from upstream; bridge-specific code lives outside lib/lbc.

import { ByteWriter, concatBytes, equalBytes, toHex, reverseBytes, utf8Decode } from '../encoding/bytes.js';

/** Opcodes used by the wallet (Bitcoin numbering; LBRY reuses NOP6-8 for claims). */
export const OP = {
  OP_0: 0x00,
  OP_PUSHDATA1: 0x4c,
  OP_PUSHDATA2: 0x4d,
  OP_PUSHDATA4: 0x4e,
  OP_1NEGATE: 0x4f,
  OP_1: 0x51,
  OP_16: 0x60,
  OP_RETURN: 0x6a,
  OP_2DROP: 0x6d,
  OP_DROP: 0x75,
  OP_DUP: 0x76,
  OP_EQUAL: 0x87,
  OP_EQUALVERIFY: 0x88,
  OP_HASH160: 0xa9,
  OP_CHECKSIG: 0xac,
  OP_CHECKMULTISIG: 0xae,
  /** OP_NOP6 — LBRY claim a name. */
  OP_CLAIM_NAME: 0xb5,
  /** OP_NOP7 — LBRY support a claim (also used for tips). */
  OP_SUPPORT_CLAIM: 0xb6,
  /** OP_NOP8 — LBRY update a claim. */
  OP_UPDATE_CLAIM: 0xb7,
} as const;

export interface ScriptChunk {
  opcode: number;
  /** Present for push operations. */
  data?: Uint8Array;
  /** Byte offset just past this chunk. */
  end: number;
}

/** Tokenises a script. Returns null if a push runs past the end (malformed script). */
export function decompile(script: Uint8Array): ScriptChunk[] | null {
  const chunks: ScriptChunk[] = [];
  let i = 0;
  while (i < script.length) {
    const opcode = script[i++]!;
    let len = -1;
    if (opcode > OP.OP_0 && opcode < OP.OP_PUSHDATA1) {
      len = opcode;
    } else if (opcode === OP.OP_PUSHDATA1) {
      if (i + 1 > script.length) return null;
      len = script[i]!;
      i += 1;
    } else if (opcode === OP.OP_PUSHDATA2) {
      if (i + 2 > script.length) return null;
      len = script[i]! | (script[i + 1]! << 8);
      i += 2;
    } else if (opcode === OP.OP_PUSHDATA4) {
      if (i + 4 > script.length) return null;
      len = (script[i]! | (script[i + 1]! << 8) | (script[i + 2]! << 16) | (script[i + 3]! << 24)) >>> 0;
      i += 4;
    }
    if (len >= 0) {
      if (i + len > script.length) return null;
      chunks.push({ opcode, data: script.slice(i, i + len), end: i + len });
      i += len;
    } else if (opcode === OP.OP_0) {
      chunks.push({ opcode, data: new Uint8Array(0), end: i });
    } else {
      chunks.push({ opcode, end: i });
    }
  }
  return chunks;
}

/** Minimal push of arbitrary data. */
export function pushData(data: Uint8Array): Uint8Array {
  const w = new ByteWriter(data.length + 5);
  if (data.length < OP.OP_PUSHDATA1) w.u8(data.length);
  else if (data.length <= 0xff) w.u8(OP.OP_PUSHDATA1).u8(data.length);
  else if (data.length <= 0xffff) w.u8(OP.OP_PUSHDATA2).u16LE(data.length);
  else w.u8(OP.OP_PUSHDATA4).u32LE(data.length);
  return w.bytes(data).toBytes();
}

/** Script-number push as produced by `ScriptBuilder.AddInt64` (used for BIP34 coinbase heights). */
export function pushNumber(value: number): Uint8Array {
  if (value === 0) return new Uint8Array([OP.OP_0]);
  if (value === -1) return new Uint8Array([OP.OP_1NEGATE]);
  if (value >= 1 && value <= 16) return new Uint8Array([OP.OP_1 + value - 1]);
  return pushData(scriptNum(value));
}

/** Minimal CScriptNum little-endian encoding with sign bit. */
export function scriptNum(value: number): Uint8Array {
  if (value === 0) return new Uint8Array(0);
  const negative = value < 0;
  let abs = Math.abs(value);
  const bytes: number[] = [];
  while (abs > 0) {
    bytes.push(abs & 0xff);
    abs = Math.floor(abs / 256);
  }
  if (bytes[bytes.length - 1]! & 0x80) bytes.push(negative ? 0x80 : 0x00);
  else if (negative) bytes[bytes.length - 1]! |= 0x80;
  return new Uint8Array(bytes);
}

// ---------------------------------------------------------------------------
// Standard output scripts
// ---------------------------------------------------------------------------

export function p2pkhScript(hash160: Uint8Array): Uint8Array {
  if (hash160.length !== 20) throw new Error('P2PKH requires a 20-byte hash');
  return concatBytes(new Uint8Array([OP.OP_DUP, OP.OP_HASH160, 20]), hash160, new Uint8Array([OP.OP_EQUALVERIFY, OP.OP_CHECKSIG]));
}

export function p2shScript(hash160: Uint8Array): Uint8Array {
  if (hash160.length !== 20) throw new Error('P2SH requires a 20-byte hash');
  return concatBytes(new Uint8Array([OP.OP_HASH160, 20]), hash160, new Uint8Array([OP.OP_EQUAL]));
}

export function witnessScript(version: number, program: Uint8Array): Uint8Array {
  if (version < 0 || version > 16) throw new Error('invalid witness version');
  const opVersion = version === 0 ? OP.OP_0 : OP.OP_1 + version - 1;
  return concatBytes(new Uint8Array([opVersion, program.length]), program);
}

export function nullDataScript(data: Uint8Array): Uint8Array {
  return concatBytes(new Uint8Array([OP.OP_RETURN]), pushData(data));
}

// ---------------------------------------------------------------------------
// LBRY claim scripts (mirrors lbcd txscript/claimscript.go ExtractClaimScript)
// ---------------------------------------------------------------------------

export type ClaimKind = 'claim' | 'support' | 'update';

export interface ClaimPrefix {
  kind: ClaimKind;
  name: Uint8Array;
  /** 20-byte claim id in script (internal) order; absent for new claims. */
  claimId?: Uint8Array;
  value?: Uint8Array;
  /** Number of bytes of the claim prefix; the remainder is the payee script. */
  size: number;
}

const MAX_CLAIM_NAME_SIZE = 255;
const MAX_CLAIM_SCRIPT_SIZE = 8192;

/** Parses a claim/support/update prefix. Returns null when the script is not a valid claim script. */
export function parseClaimPrefix(script: Uint8Array): ClaimPrefix | null {
  if (script.length === 0) return null;
  const op = script[0]!;
  if (op !== OP.OP_CLAIM_NAME && op !== OP.OP_SUPPORT_CLAIM && op !== OP.OP_UPDATE_CLAIM) return null;
  const chunks = decompile(script);
  if (!chunks || chunks.length < 4) return null;
  const name = chunks[1]?.data;
  if (!name || name.length > MAX_CLAIM_NAME_SIZE) return null;

  let result: ClaimPrefix | null = null;
  if (op === OP.OP_CLAIM_NAME) {
    // OP_CLAIM_NAME <name> <value> OP_2DROP OP_DROP <payee>
    const value = chunks[2]?.data;
    if (!value || chunks[3]?.opcode !== OP.OP_2DROP || chunks[4]?.opcode !== OP.OP_DROP) return null;
    result = { kind: 'claim', name, value, size: chunks[4].end };
  } else if (op === OP.OP_SUPPORT_CLAIM) {
    // OP_SUPPORT_CLAIM <name> <claimId> OP_2DROP OP_DROP <payee>
    // OP_SUPPORT_CLAIM <name> <claimId> <value> OP_2DROP OP_2DROP <payee>
    const claimId = chunks[2]?.data;
    if (!claimId || claimId.length !== 20) return null;
    const third = chunks[3];
    if (!third) return null;
    if (third.opcode === OP.OP_2DROP) {
      if (chunks[4]?.opcode !== OP.OP_DROP) return null;
      result = { kind: 'support', name, claimId, size: chunks[4].end };
    } else if (third.data && third.data.length > 0) {
      if (chunks[4]?.opcode !== OP.OP_2DROP || chunks[5]?.opcode !== OP.OP_2DROP) return null;
      result = { kind: 'support', name, claimId, value: third.data, size: chunks[5].end };
    } else {
      return null;
    }
  } else {
    // OP_UPDATE_CLAIM <name> <claimId> <value> OP_2DROP OP_2DROP <payee>
    const claimId = chunks[2]?.data;
    const value = chunks[3]?.data;
    if (!claimId || claimId.length !== 20 || !value) return null;
    if (chunks[4]?.opcode !== OP.OP_2DROP || chunks[5]?.opcode !== OP.OP_2DROP) return null;
    result = { kind: 'update', name, claimId, value, size: chunks[5].end };
  }
  if (result.size > MAX_CLAIM_SCRIPT_SIZE) return null;
  return result;
}

/** Removes a claim prefix if present (lbcd StripClaimScriptPrefix). */
export function stripClaimPrefix(script: Uint8Array): Uint8Array {
  const prefix = parseClaimPrefix(script);
  return prefix ? script.slice(prefix.size) : script;
}

/** Builds a support (or tip) output script paying to `payeeScript`. */
export function supportScript(name: string | Uint8Array, claimIdInternal: Uint8Array, payeeScript: Uint8Array): Uint8Array {
  const nameBytes = typeof name === 'string' ? new TextEncoder().encode(name) : name;
  if (claimIdInternal.length !== 20) throw new Error('claim id must be 20 bytes');
  return concatBytes(
    new Uint8Array([OP.OP_SUPPORT_CLAIM]),
    pushData(nameBytes),
    pushData(claimIdInternal),
    new Uint8Array([OP.OP_2DROP, OP.OP_DROP]),
    payeeScript,
  );
}

/** Claim ids are displayed as the reversed hex of the 20 bytes stored in scripts. */
export function claimIdToHex(claimIdInternal: Uint8Array): string {
  return toHex(reverseBytes(claimIdInternal));
}

// ---------------------------------------------------------------------------
// Classification
// ---------------------------------------------------------------------------

export type OutputType = 'p2pkh' | 'p2sh' | 'p2pk' | 'p2wpkh' | 'p2wsh' | 'p2tr' | 'nulldata' | 'nonstandard';

export interface ClassifiedOutput {
  type: OutputType;
  /** 20-byte hash for p2pkh/p2sh/p2wpkh, 32-byte program for p2wsh/p2tr, pubkey for p2pk. */
  hash?: Uint8Array;
  claim?: {
    kind: ClaimKind;
    name: string;
    nameBytes: Uint8Array;
    claimId?: string;
    hasValue: boolean;
  };
}

function isP2pkh(s: Uint8Array): boolean {
  return s.length === 25 && s[0] === OP.OP_DUP && s[1] === OP.OP_HASH160 && s[2] === 20 && s[23] === OP.OP_EQUALVERIFY && s[24] === OP.OP_CHECKSIG;
}

function isP2sh(s: Uint8Array): boolean {
  return s.length === 23 && s[0] === OP.OP_HASH160 && s[1] === 20 && s[22] === OP.OP_EQUAL;
}

/** Classifies an output script, first stripping (and describing) any LBRY claim prefix. */
export function classifyOutput(script: Uint8Array): ClassifiedOutput {
  const prefix = parseClaimPrefix(script);
  const base = prefix ? script.subarray(prefix.size) : script;
  const out: ClassifiedOutput = { type: 'nonstandard' };
  if (prefix) {
    out.claim = {
      kind: prefix.kind,
      name: utf8Decode(prefix.name),
      nameBytes: prefix.name,
      claimId: prefix.claimId ? claimIdToHex(prefix.claimId) : undefined,
      hasValue: !!prefix.value,
    };
  }
  if (isP2pkh(base)) {
    out.type = 'p2pkh';
    out.hash = base.slice(3, 23);
  } else if (isP2sh(base)) {
    out.type = 'p2sh';
    out.hash = base.slice(2, 22);
  } else if (base.length === 22 && base[0] === OP.OP_0 && base[1] === 20) {
    out.type = 'p2wpkh';
    out.hash = base.slice(2);
  } else if (base.length === 34 && base[0] === OP.OP_0 && base[1] === 32) {
    out.type = 'p2wsh';
    out.hash = base.slice(2);
  } else if (base.length === 34 && base[0] === OP.OP_1 && base[1] === 32) {
    out.type = 'p2tr';
    out.hash = base.slice(2);
  } else if ((base.length === 35 && base[0] === 33) || (base.length === 67 && base[0] === 65)) {
    if (base[base.length - 1] === OP.OP_CHECKSIG) {
      out.type = 'p2pk';
      out.hash = base.slice(1, base.length - 1);
    }
  } else if (base.length > 0 && base[0] === OP.OP_RETURN) {
    out.type = 'nulldata';
  }
  return out;
}

export function isPayToPubKeyHash(script: Uint8Array, hash160: Uint8Array): boolean {
  return isP2pkh(script) && equalBytes(script.subarray(3, 23), hash160);
}
