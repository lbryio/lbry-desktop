// Ported from lBC-wallet-with-mining-ability packages/core/test/hub.test.ts @ 93e19c1 (vitest -> Jest).
import { HubBackend } from "../../../extras/lbc/net/hub.js";
import type { LineTransport, SocketEndpoint } from "../../../extras/lbc/net/transport.js";
import { MAINNET, REGTEST, type NetworkParams } from "../../../extras/lbc/networks.js";
import { ByteWriter, toHex } from "../../../extras/lbc/encoding/bytes.js";
import { checkProofOfWork } from "../../../extras/lbc/crypto/pow.js";

/** Mainnet's hub rules (stale-tip detection) with regtest's cheap proof of work. */
const FAST_MAINNET: NetworkParams = { ...MAINNET, powLimitBits: REGTEST.powLimitBits, powLimit: REGTEST.powLimit };

const mined = new Map<number, string>();

/** A 112-byte LBRY header with the given time and valid (regtest-cheap) proof of work: the hub client checks it. */
function header(time: number): string {
  let hex = mined.get(time);
  if (hex) return hex;
  for (let nonce = 0; ; nonce++) {
    const h = new ByteWriter(112)
      .i32LE(1)
      .bytes(new Uint8Array(96))
      .u32LE(time)
      .u32LE(REGTEST.powLimitBits)
      .u32LE(nonce)
      .toBytes();
    if (checkProofOfWork(h, REGTEST.powLimit)) {
      hex = toHex(h);
      break;
    }
  }
  mined.set(time, hex);
  return hex;
}

interface FakeHub {
  height: number;
  /** Block time of the hub's tip, seconds. */
  time: number;
  down?: boolean;
  connections: number;
  /** Sends a new-block notification on the open connection. */
  announce?: (height: number, time: number) => void;
}

function fakeHubs(hubs: Record<string, FakeHub>): (ep: SocketEndpoint) => LineTransport {
  return (ep) => {
    const hub = hubs[ep.host]!;
    let onLine: (line: string) => void = () => {};
    let onClose: () => void = () => {};
    let open = false;
    return {
      connect: async () => {
        if (hub.down) throw new Error("connection refused");
        hub.connections++;
        open = true;
        hub.announce = (height, time) => {
          if (open)
            onLine(
              JSON.stringify({
                jsonrpc: "2.0",
                method: "blockchain.headers.subscribe",
                params: [{ height, hex: header(time) }],
              })
            );
        };
      },
      send: (line) => {
        const { id, method } = JSON.parse(line) as { id: number; method: string };
        const result =
          method === "server.version"
            ? ["fake 0.107.0", "0.107.0"]
            : method === "blockchain.headers.subscribe"
              ? { height: hub.height, hex: header(hub.time) }
              : null;
        queueMicrotask(() => open && onLine(JSON.stringify({ jsonrpc: "2.0", id, result })));
      },
      close: () => {
        if (!open) return;
        open = false;
        onClose();
      },
      onLine: (h) => (onLine = h),
      onClose: (h) => (onClose = h),
    };
  };
}

const now = () => Math.floor(Date.now() / 1000);

function backend(hubs: Record<string, FakeHub>, network: NetworkParams = FAST_MAINNET) {
  return new HubBackend({
    servers: Object.keys(hubs).map((host) => ({ host, port: 50001 })),
    transportFactory: fakeHubs(hubs),
    network,
    clientName: "test",
  });
}

const backends: HubBackend[] = [];
afterEach(async () => {
  jest.useRealTimers();
  for (const b of backends.splice(0)) await b.stop();
});

describe("hub selection", () => {
  it("skips a stuck hub whose newest block is hours old", async () => {
    const hubs = {
      stuck: { height: 2_198_349, time: now() - 3 * 3600, connections: 0 },
      good: { height: 2_198_368, time: now() - 120, connections: 0 },
    };
    const b = backend(hubs);
    backends.push(b);
    await b.start();
    expect(b.getStatus().server).toBe("good:50001");
    expect((await b.getTip()).height).toBe(2_198_368);
    expect(hubs.stuck.connections).toBe(1);
  });

  it("uses the most advanced hub when every hub looks stale (slow chain or wrong clock)", async () => {
    const hubs = {
      a: { height: 100, time: now() - 5 * 3600, connections: 0 },
      b: { height: 105, time: now() - 4 * 3600, connections: 0 },
      c: { height: 0, time: 0, down: true, connections: 0 },
    };
    const b = backend(hubs);
    backends.push(b);
    await b.start();
    expect(b.getStatus().server).toBe("b:50001");
  });

  it("does not judge test networks by block age", async () => {
    const hubs = {
      old: { height: 105, time: now() - 30 * 24 * 3600, connections: 0 },
      other: { height: 106, time: now(), connections: 0 },
    };
    const b = backend(hubs, REGTEST);
    backends.push(b);
    await b.start();
    expect(b.getStatus().server).toBe("old:50001");
  });

  it("moves to another hub when the current one stops announcing blocks", async () => {
    jest.useFakeTimers({ doNotFake: ["nextTick", "queueMicrotask", "setImmediate", "clearImmediate"] });
    const hubs: Record<"first" | "second", FakeHub> = {
      first: { height: 500, time: now() - 60, connections: 0 },
      second: { height: 520, time: now() - 60, connections: 0 },
    };
    const b = backend(hubs);
    backends.push(b);
    const start = b.start();
    await jest.advanceTimersByTimeAsync(10);
    await start;
    expect(b.getStatus().server).toBe("first:50001");

    // A block within the hour keeps the connection.
    await jest.advanceTimersByTimeAsync(50 * 60_000);
    hubs.first.announce!(501, now());
    await jest.advanceTimersByTimeAsync(50 * 60_000);
    expect(b.getStatus().server).toBe("first:50001");

    // Then silence: after an hour without a block the backend switches.
    hubs.second.time = now() - 60;
    await jest.advanceTimersByTimeAsync(15 * 60_000);
    expect(b.getStatus().server).toBe("second:50001");
    expect((await b.getTip()).height).toBe(520);
  });
});
