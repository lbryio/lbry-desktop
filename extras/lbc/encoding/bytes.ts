// Vendored from bitcoinbrisbane/lBC-wallet-with-mining-ability (MIT), packages/core/src/encoding/bytes.ts @ 93e19c1.
// Keep verbatim so it can be refreshed from upstream; bridge-specific code lives outside lib/lbc.

/**
 * Byte-level helpers shared by every module: hex conversion, concatenation,
 * little-endian integer codecs and a Bitcoin-style CompactSize (varint) reader
 * and writer. Everything works on plain `Uint8Array` so the core runs in Node,
 * Electron renderers, browsers and React Native alike.
 */

import { base64 } from '@scure/base';

const HEX_CHARS = '0123456789abcdef';
const HEX_LOOKUP: Record<string, number> = {};
for (let i = 0; i < 16; i++) {
  HEX_LOOKUP[HEX_CHARS[i]!] = i;
  HEX_LOOKUP[HEX_CHARS[i]!.toUpperCase()] = i;
}

export function toHex(bytes: Uint8Array): string {
  let out = '';
  for (let i = 0; i < bytes.length; i++) {
    const b = bytes[i]!;
    out += HEX_CHARS[b >> 4]! + HEX_CHARS[b & 15]!;
  }
  return out;
}

export function fromHex(hex: string): Uint8Array {
  if (hex.length % 2 !== 0) throw new Error('hex string has odd length');
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) {
    const hi = HEX_LOOKUP[hex[i * 2]!];
    const lo = HEX_LOOKUP[hex[i * 2 + 1]!];
    if (hi === undefined || lo === undefined) throw new Error('invalid hex character');
    out[i] = (hi << 4) | lo;
  }
  return out;
}

export function isHex(value: string, byteLength?: number): boolean {
  if (!/^[0-9a-fA-F]*$/.test(value) || value.length % 2 !== 0) return false;
  return byteLength === undefined || value.length === byteLength * 2;
}

export function concatBytes(...parts: Uint8Array[]): Uint8Array {
  let total = 0;
  for (const p of parts) total += p.length;
  const out = new Uint8Array(total);
  let offset = 0;
  for (const p of parts) {
    out.set(p, offset);
    offset += p.length;
  }
  return out;
}

export function equalBytes(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i]! ^ b[i]!;
  return diff === 0;
}

/** Returns a reversed copy (used to convert between internal and display hash order). */
export function reverseBytes(bytes: Uint8Array): Uint8Array {
  const out = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) out[i] = bytes[bytes.length - 1 - i]!;
  return out;
}

/** Display-order hex (as shown by explorers and RPCs) → internal byte order. */
export function hashFromHex(displayHex: string): Uint8Array {
  if (!isHex(displayHex, 32)) throw new Error('expected a 32-byte hash in hex');
  return reverseBytes(fromHex(displayHex));
}

/** Internal byte order → display-order hex. */
export function hashToHex(internal: Uint8Array): string {
  return toHex(reverseBytes(internal));
}

export function utf8Encode(text: string): Uint8Array {
  return new TextEncoder().encode(text);
}

export function utf8Decode(bytes: Uint8Array): string {
  return new TextDecoder('utf-8', { fatal: false }).decode(bytes);
}

/** Standard base64 (with padding), e.g. for bytes crossing the Android bridge. */
export function toBase64(bytes: Uint8Array): string {
  return base64.encode(bytes);
}

export function fromBase64(text: string): Uint8Array {
  return base64.decode(text);
}

/** Best-effort zeroing of sensitive buffers. */
export function wipe(...buffers: (Uint8Array | undefined | null)[]): void {
  for (const b of buffers) if (b) b.fill(0);
}

export function writeU32LE(target: Uint8Array, value: number, offset: number): void {
  target[offset] = value & 0xff;
  target[offset + 1] = (value >>> 8) & 0xff;
  target[offset + 2] = (value >>> 16) & 0xff;
  target[offset + 3] = (value >>> 24) & 0xff;
}

export function readU32LE(source: Uint8Array, offset: number): number {
  return (
    (source[offset]! | (source[offset + 1]! << 8) | (source[offset + 2]! << 16) | (source[offset + 3]! << 24)) >>> 0
  );
}

export function u32LE(value: number): Uint8Array {
  const out = new Uint8Array(4);
  writeU32LE(out, value, 0);
  return out;
}

export function u32BE(value: number): Uint8Array {
  return new Uint8Array([(value >>> 24) & 0xff, (value >>> 16) & 0xff, (value >>> 8) & 0xff, value & 0xff]);
}

/** Incrementally builds a byte array. */
export class ByteWriter {
  private buf: Uint8Array;
  private len = 0;

  constructor(initialCapacity = 256) {
    this.buf = new Uint8Array(initialCapacity);
  }

  private ensure(extra: number): void {
    if (this.len + extra <= this.buf.length) return;
    let cap = this.buf.length * 2;
    while (cap < this.len + extra) cap *= 2;
    const next = new Uint8Array(cap);
    next.set(this.buf.subarray(0, this.len));
    this.buf = next;
  }

  bytes(data: Uint8Array): this {
    this.ensure(data.length);
    this.buf.set(data, this.len);
    this.len += data.length;
    return this;
  }

  u8(value: number): this {
    this.ensure(1);
    this.buf[this.len++] = value & 0xff;
    return this;
  }

  u16LE(value: number): this {
    this.ensure(2);
    this.buf[this.len++] = value & 0xff;
    this.buf[this.len++] = (value >>> 8) & 0xff;
    return this;
  }

  u32LE(value: number): this {
    this.ensure(4);
    writeU32LE(this.buf, value >>> 0, this.len);
    this.len += 4;
    return this;
  }

  i32LE(value: number): this {
    return this.u32LE(value >>> 0);
  }

  u64LE(value: bigint): this {
    if (value < 0n || value > 0xffffffffffffffffn) throw new RangeError('u64 out of range');
    this.ensure(8);
    let v = value;
    for (let i = 0; i < 8; i++) {
      this.buf[this.len++] = Number(v & 0xffn);
      v >>= 8n;
    }
    return this;
  }

  varint(value: number | bigint): this {
    const v = BigInt(value);
    if (v < 0n) throw new RangeError('varint must be non-negative');
    if (v < 0xfdn) return this.u8(Number(v));
    if (v <= 0xffffn) return this.u8(0xfd).u16LE(Number(v));
    if (v <= 0xffffffffn) return this.u8(0xfe).u32LE(Number(v));
    return this.u8(0xff).u64LE(v);
  }

  varBytes(data: Uint8Array): this {
    return this.varint(data.length).bytes(data);
  }

  get length(): number {
    return this.len;
  }

  toBytes(): Uint8Array {
    return this.buf.slice(0, this.len);
  }
}

/** Sequentially reads values from a byte array; throws on overrun. */
export class ByteReader {
  offset = 0;

  constructor(private readonly data: Uint8Array) {}

  get remaining(): number {
    return this.data.length - this.offset;
  }

  private need(n: number): void {
    if (this.offset + n > this.data.length) throw new Error('unexpected end of data');
  }

  bytes(n: number): Uint8Array {
    this.need(n);
    const out = this.data.slice(this.offset, this.offset + n);
    this.offset += n;
    return out;
  }

  peek(): number {
    this.need(1);
    return this.data[this.offset]!;
  }

  u8(): number {
    this.need(1);
    return this.data[this.offset++]!;
  }

  u16LE(): number {
    this.need(2);
    const v = this.data[this.offset]! | (this.data[this.offset + 1]! << 8);
    this.offset += 2;
    return v;
  }

  u32LE(): number {
    this.need(4);
    const v = readU32LE(this.data, this.offset);
    this.offset += 4;
    return v;
  }

  i32LE(): number {
    return this.u32LE() | 0;
  }

  u64LE(): bigint {
    this.need(8);
    let v = 0n;
    for (let i = 7; i >= 0; i--) v = (v << 8n) | BigInt(this.data[this.offset + i]!);
    this.offset += 8;
    return v;
  }

  varint(): number {
    const first = this.u8();
    if (first < 0xfd) return first;
    if (first === 0xfd) return this.u16LE();
    if (first === 0xfe) return this.u32LE();
    const big = this.u64LE();
    if (big > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error('varint too large');
    return Number(big);
  }

  varBytes(): Uint8Array {
    return this.bytes(this.varint());
  }
}
