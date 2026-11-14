#!/usr/bin/env node
// Launch the app and fail if the renderer doesn't come up cleanly (#668).
//
//   node scripts/smoke-test.js <path-to-electron-or-app-binary> [-- <extra app args>]
//
// Passes if `#app` gets children within the timeout and no uncaught exception is thrown in the page.
// It does not need the daemon or the network: #665 crashed before React mounted. Errors that only mean
// "can't reach the daemon" are ignored (see IGNORED).
//
// How it works: start the app with --remote-debugging-port and a throwaway --user-data-dir (so it never
// collides with a real install's single-instance lock), attach over the Chrome DevTools Protocol, then
// reload the page. The window has already started loading by the time we can attach, so the reload is
// what lets us see exceptions thrown at module load.
//
// Needs Node 22+ (global WebSocket and fetch). On Linux CI run it under xvfb-run.
// Output: smoke-artifacts/ (errors.json always; screenshot.png on failure). Override with SMOKE_ARTIFACTS.

const { spawn } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const MOUNT_TIMEOUT_MS = Number(process.env.SMOKE_MOUNT_TIMEOUT_MS || 30000);
const TARGET_TIMEOUT_MS = Number(process.env.SMOKE_TARGET_TIMEOUT_MS || 90000);
const PORT = Number(process.env.SMOKE_PORT || 9223);
const ARTIFACTS = path.resolve(process.env.SMOKE_ARTIFACTS || "smoke-artifacts");

// Expected without a daemon or network. Matched against the exception text.
const IGNORED = [/Failed to fetch/i, /NetworkError/i, /ERR_CONNECTION/i, /ECONNREFUSED/i, /Load failed/i];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function parseArgs(argv) {
  const dash = argv.indexOf("--");
  const own = dash === -1 ? argv : argv.slice(0, dash);
  const appArgs = dash === -1 ? [] : argv.slice(dash + 1);
  if (!own[0]) {
    console.error("usage: node scripts/smoke-test.js <electron-or-app-binary> [-- app args]");
    process.exit(2);
  }
  return { exe: own[0], appArgs };
}

async function waitForTarget(deadline) {
  while (Date.now() < deadline) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      const page = list.find((t) => t.type === "page" && /^(file|http):/.test(t.url));
      if (page) return page;
    } catch (e) {
      // port not open yet
    }
    await sleep(500);
  }
  return null;
}

class Cdp {
  constructor(url) {
    this.ws = new WebSocket(url);
    this.id = 0;
    this.pending = new Map();
    this.handlers = [];
    this.opened = new Promise((res, rej) => {
      this.ws.addEventListener("open", res);
      this.ws.addEventListener("error", () => rej(new Error("could not open the DevTools socket")));
    });
    this.ws.addEventListener("message", (m) => {
      const msg = JSON.parse(m.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { res, rej } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        msg.error ? rej(new Error(msg.error.message)) : res(msg.result);
      } else if (msg.method) {
        this.handlers.forEach((h) => h(msg));
      }
    });
  }
  send(method, params = {}) {
    const id = ++this.id;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((res, rej) => this.pending.set(id, { res, rej }));
  }
  on(handler) {
    this.handlers.push(handler);
  }
  close() {
    try {
      this.ws.close();
    } catch (e) {
      // already closed
    }
  }
}

function describeException(details) {
  const ex = details.exception;
  return (ex && (ex.description || ex.value)) || details.text || "unknown exception";
}

// Never hang CI: stop after this long no matter what.
const WATCHDOG_MS = TARGET_TIMEOUT_MS + MOUNT_TIMEOUT_MS + 60000;

async function main() {
  const { exe, appArgs } = parseArgs(process.argv.slice(2));
  fs.mkdirSync(ARTIFACTS, { recursive: true });
  const userData = fs.mkdtempSync(path.join(os.tmpdir(), "lbry-smoke-"));

  const exceptions = [];
  const consoleErrors = [];
  let failure = null;
  let cdp = null;

  const child = spawn(
    exe,
    [...appArgs, `--remote-debugging-port=${PORT}`, `--user-data-dir=${userData}`],
    // Production behaviour: electron-is-dev must not take us down the dev (localhost:9091) path.
    { env: { ...process.env, ELECTRON_IS_DEV: "0" }, stdio: ["ignore", "pipe", "pipe"], detached: false }
  );
  const watchdog = setTimeout(() => {
    console.error(`SMOKE TEST FAILED: watchdog after ${WATCHDOG_MS / 1000}s`);
    child.kill("SIGKILL");
    process.exit(1);
  }, WATCHDOG_MS);
  watchdog.unref();
  let childExit = null;
  child.on("exit", (code, signal) => (childExit = { code, signal }));
  const log = [];
  for (const stream of [child.stdout, child.stderr]) stream.on("data", (d) => log.push(String(d)));

  try {
    const target = await waitForTarget(Date.now() + TARGET_TIMEOUT_MS);
    if (!target) {
      failure = childExit
        ? `the app exited before a window opened (code ${childExit.code}, signal ${childExit.signal})`
        : `no window opened within ${TARGET_TIMEOUT_MS / 1000}s`;
      return finish(failure);
    }

    cdp = new Cdp(target.webSocketDebuggerUrl);
    await cdp.opened;
    cdp.on((msg) => {
      if (msg.method === "Runtime.exceptionThrown") exceptions.push(describeException(msg.params.exceptionDetails));
      if (msg.method === "Runtime.consoleAPICalled" && msg.params.type === "error") {
        consoleErrors.push(msg.params.args.map((a) => a.value || a.description || "").join(" "));
      }
    });
    await cdp.send("Runtime.enable");
    await cdp.send("Page.enable");
    // Reload so exceptions thrown while the bundle loads are observed.
    await cdp.send("Page.reload", { ignoreCache: true });

    const deadline = Date.now() + MOUNT_TIMEOUT_MS;
    let mounted = false;
    while (Date.now() < deadline) {
      await sleep(500);
      if (childExit) break;
      try {
        const r = await cdp.send("Runtime.evaluate", {
          expression: "(document.querySelector('#app') || {children: []}).children.length",
          returnByValue: true,
        });
        if (r.result.value > 0) {
          mounted = true;
          break;
        }
      } catch (e) {
        // the page is mid-reload; try again
      }
    }

    // Give late errors a moment (effects, first render), then judge.
    if (mounted) await sleep(2000);

    const real = exceptions.filter((e) => !IGNORED.some((re) => re.test(e)));
    if (childExit) failure = `the app exited (code ${childExit.code}, signal ${childExit.signal})`;
    else if (!mounted) failure = `#app had no children after ${MOUNT_TIMEOUT_MS / 1000}s`;
    else if (real.length) failure = `${real.length} uncaught exception(s) in the renderer`;

    if (failure && cdp) {
      try {
        // A hidden or crashed window can leave this call pending forever, so bound it.
        const shot = await Promise.race([
          cdp.send("Page.captureScreenshot", { format: "png" }),
          sleep(10000).then(() => {
            throw new Error("screenshot timed out");
          }),
        ]);
        fs.writeFileSync(path.join(ARTIFACTS, "screenshot.png"), Buffer.from(shot.data, "base64"));
      } catch (e) {
        // the page may be gone
      }
    }
    return finish(failure);
  } catch (e) {
    return finish(`smoke test error: ${e.message}`);
  }

  function finish(reason) {
    fs.writeFileSync(
      path.join(ARTIFACTS, "errors.json"),
      JSON.stringify({ failure: reason, exceptions, consoleErrors, appOutput: log.join("").slice(-20000) }, null, 2)
    );
    if (cdp) cdp.close();
    child.kill("SIGKILL");
    fs.rmSync(userData, { recursive: true, force: true });
    if (reason) {
      console.error(`SMOKE TEST FAILED: ${reason}`);
      exceptions.slice(0, 10).forEach((e) => console.error(`  exception: ${e.split("\n")[0]}`));
      console.error(`details: ${path.join(ARTIFACTS, "errors.json")}`);
      process.exit(1);
    }
    console.log(`smoke test passed (${exceptions.length} ignored exception(s), ${consoleErrors.length} console error(s))`);
    process.exit(0);
  }
}

main();
