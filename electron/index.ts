//@ts-nocheck
/* eslint no-console:0 */
/* eslint space-before-function-paren:0 */
// Module imports
import "@babel/polyfill";
import SemVer from "semver";
import https from "https";
import { app, dialog, ipcMain, Menu, session, shell, BrowserWindow } from "electron";
import { autoUpdater } from "electron-updater";
import Lbry from "lbry";
import LbryFirstInstance from "./LbryFirstInstance";
import Daemon from "./Daemon";
import isDev from "electron-is-dev";
import createTray from "./createTray";
import createWindow from "./createWindow";
import showWindow from "./showWindow";
import pjson from "../package.json";
import startSandbox from "./startSandbox";
import installDevtools from "./installDevtools";
import fs from "fs";
import path from "path";
import { diskSpaceLinux, diskSpaceWindows, diskSpaceMac } from "../ui/util/diskspace";
import ignoreBrokenPipe from "./ignoreBrokenPipe";

// Before anything logs: a closed stdout/stderr must not crash the app (#601).
ignoreBrokenPipe(process.stdout, process.stderr);

const { download } = require("electron-dl");
const mime = require("mime");
const os = require("os");
const sudo = require("sudo-prompt");
const probe = require("ffmpeg-probe");
const MAX_IPC_SEND_BUFFER_SIZE = 500000000; // large files crash when serialized for ipc message

const filePath = path.join(process.resourcesPath, "static", "upgradeDisabled");
let upgradeDisabled;
try {
  fs.accessSync(filePath, fs.constants.R_OK);
  upgradeDisabled = true;
} catch (err: any) {
  upgradeDisabled = false;
}
autoUpdater.autoDownload = !upgradeDisabled;
autoUpdater.allowPrerelease = false;
autoUpdater.logger = require("electron-log");

const UPDATE_STATE_INIT = 0;
const UPDATE_STATE_CHECKING = 1;
const UPDATE_STATE_UPDATES_FOUND = 2;
const UPDATE_STATE_NO_UPDATES_FOUND = 3;
const UPDATE_STATE_DOWNLOADING = 4;
const UPDATE_STATE_DOWNLOADED = 5;
let updateState = UPDATE_STATE_INIT;
let updateDownloadItem;

const isAutoUpdateSupported = ["win32", "darwin"].includes(process.platform) || !!process.env.APPIMAGE;

// This is used to keep track of whether we are showing the special dialog
// that we show on Windows after you decline an upgrade and close the app later.
let showingAutoUpdateCloseAlert = false;

// Keep a global reference, if you don't, they will be closed automatically when the JavaScript
// object is garbage collected.
let rendererWindow;

const sendToRenderer = (channel, ...args) => {
  if (rendererWindow && !rendererWindow.isDestroyed()) {
    rendererWindow.webContents.send(channel, ...args);
  }
};

let tray;
let daemon;
let lbryFirst;

const appState: Record<string, any> = {};
const PROTOCOL = "lbry";

if (isDev && process.platform === "win32") {
  // Setting this is required to get this working in dev mode.
  app.setAsDefaultProtocolClient(PROTOCOL, process.execPath, [path.resolve(process.argv[1])]);
} else if (process.platform !== "linux") {
  app.setAsDefaultProtocolClient(PROTOCOL);
}

app.name = "LBRY";
app.setAppUserModelId("io.lbry.LBRY");
app.commandLine.appendSwitch("force-color-profile", "srgb");
app.commandLine.appendSwitch("disable-features", "OutOfBlinkCors");

if (isDev) {
  // Disable security warnings in dev mode:
  // https://github.com/electron/electron/blob/master/docs/tutorial/security.md#electron-security-warnings
  process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true;
}

const startDaemon = async () => {
  let isDaemonRunning = false;

  await Lbry.status()
    .then(() => {
      isDaemonRunning = true;
      console.log("SDK already running");
    })
    .catch(() => {
      console.log("Starting SDK");
    });

  if (!isDaemonRunning) {
    daemon = new Daemon();
    daemon.on("exit", () => {
      // Always clear the handle: will-quit waits while `daemon` is set, so leaving it
      // set (as dev used to) makes every later quit wait forever (#692).
      daemon = null;
      if (!isDev) {
        if (!appState.isQuitting) {
          dialog.showErrorBox(
            "Daemon has Exited",
            "The daemon may have encountered an unexpected error, or another daemon instance is already running. \n\n" +
              "For more information please visit: \n" +
              "https://lbry.com/faq/startup-troubleshooting"
          );
        }
      }
      // In dev an unexpected daemon exit shouldn't close the app (you may be restarting the
      // daemon by hand), but a quit that was waiting on it must be allowed to finish.
      if (!isDev || appState.isQuitting) {
        app.quit();
      }
    });
    await daemon.launch();
  }
};

let isLbryFirstRunning = false;
const startLbryFirst = async () => {
  if (isLbryFirstRunning) {
    console.log("LbryFirst already running");
    handleLbryFirstLaunched();
    return;
  }

  console.log("LbryFirst: Starting...");

  try {
    lbryFirst = new LbryFirstInstance();
    lbryFirst.on("exit", (e) => {
      lbryFirst = null;
      isLbryFirstRunning = false;
      if (!isDev) {
        if (!appState.isQuitting) {
          dialog.showErrorBox(
            "LbryFirst has Exited",
            "The lbryFirst may have encountered an unexpected error, or another lbryFirst instance is already running. \n\n",
            e
          );
        }
      }
      if (!isDev || appState.isQuitting) {
        app.quit();
      }
    });
  } catch (e: any) {
    console.log("LbryFirst: Failed to create new instance\n\n", e);
  }

  console.log("LbryFirst: Running...");

  try {
    await lbryFirst.launch();
    handleLbryFirstLaunched();
  } catch (e: any) {
    isLbryFirstRunning = false;
    console.log("LbryFirst: Failed to start\n", e);
  }
};

const handleLbryFirstLaunched = () => {
  isLbryFirstRunning = true;
  rendererWindow.webContents.send("lbry-first-launched");
};

// When we are starting the app, ensure there are no other apps already running
const gotSingleInstanceLock = app.requestSingleInstanceLock();

if (!gotSingleInstanceLock) {
  // Another instance already has a lock, abort
  app.quit();
} else {
  app.on("second-instance", (event, argv) => {
    // Send the url to the app to navigate first, then focus
    if (rendererWindow) {
      // External uri (last item on argv):
      const EXTERNAL_URI = argv.length ? argv[argv.length - 1] : "";
      // Handle protocol requests for windows and linux
      const platforms = process.platform === "win32" || process.platform === "linux";
      // Is LBRY protocol
      const isProtocolURI = String(EXTERNAL_URI).startsWith(PROTOCOL + "://");
      // External protocol requested:
      if (platforms && isProtocolURI) {
        let URI = EXTERNAL_URI;
        // Keep only command line / deep linked arguments
        // Windows normalizes URIs when they're passed in from other apps. On Windows, this tries to
        // restore the original URI that was typed.
        //   - If the URI has no path, Windows adds a trailing slash. LBRY URIs can't have a slash with no
        //     path, so we just strip it off.
        //   - In a URI with a claim ID, like lbry://channel#claimid, Windows interprets the hash mark as
        //     an anchor and converts it to lbry://channel/#claimid. We remove the slash here as well.
        //   - ? also interpreted as an anchor, remove slash also.
        if (process.platform === "win32") {
          URI = URI.replace(/\/$/, "").replace("/#", "#").replace("/?", "?");
        }

        rendererWindow.webContents.send("open-uri-requested", URI);
      }

      showWindow(rendererWindow);
    }
  });

  app.on("ready", async () => {
    await startDaemon();
    startSandbox();

    if (isDev) {
      await installDevtools();
    }
    rendererWindow = createWindow(appState);
    tray = createTray(rendererWindow);

    if (!isDev) {
      rendererWindow.webContents.on("devtools-opened", () => {
        // Send a message to the renderer process so we can log a security warning
        rendererWindow.webContents.send("devtools-is-opened");
      });
    }

    // If an "Origin" header is passed, the SDK will check that it is set to allow that origin in the daemon_settings.yml
    // By default, electron sends http://localhost:{port} as the origin for POST requests
    // https://github.com/electron/electron/issues/7931#issuecomment-361759277
    session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
      if (details.method === "POST" && details.requestHeaders["Content-Type"] === "application/json-rpc") {
        delete details.requestHeaders["Origin"];
      }
      callback({ cancel: false, requestHeaders: details.requestHeaders });
    });
  });
}

app.on("activate", () => {
  if (rendererWindow) {
    showWindow(rendererWindow);
  }
});

app.on("will-quit", (event) => {
  if (
    process.platform === "win32" &&
    updateState === UPDATE_STATE_DOWNLOADED &&
    isAutoUpdateSupported &&
    !appState.autoUpdateAccepted &&
    !showingAutoUpdateCloseAlert
  ) {
    // We're on Win and have an update downloaded, but the user declined it (or closed
    // the app without accepting it). Now the user is closing the app, so the new update
    // will install. On Mac this is silent, but on Windows they get a confusing permission
    // escalation dialog, so we show Windows users a warning dialog first.

    showingAutoUpdateCloseAlert = true;
    dialog.showMessageBox(
      {
        type: "info",
        title: "LBRY Will Upgrade",
        message: 'LBRY has a pending upgrade. Please select "Yes" to install it on the prompt shown after this one.',
      },
      () => {
        app.quit();
      }
    );

    event.preventDefault();
    return;
  }

  appState.isQuitting = true;

  if (daemon) {
    daemon.quit();
    event.preventDefault();
  }
  if (lbryFirst) {
    lbryFirst.quit();
    event.preventDefault();
  }

  if (rendererWindow) {
    tray.destroy();
    rendererWindow = null;
  }
});

app.on("will-finish-launching", () => {
  // Protocol handler for macOS
  app.on("open-url", (event, URL) => {
    event.preventDefault();

    if (rendererWindow) {
      rendererWindow.webContents.send("open-uri-requested", URL);
      showWindow(rendererWindow);
    } else {
      appState.macDeepLinkingURI = URL;
    }
  });
});

app.on("before-quit", () => {
  appState.isQuitting = true;
});

// Renderer -> main process bridge (replaces @electron/remote).
ipcMain.handle("dialog:showOpenDialog", (event, options) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  return win ? dialog.showOpenDialog(win, options) : dialog.showOpenDialog(options);
});

ipcMain.on("window:maximize", (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) win.maximize();
});

ipcMain.on("window:setFullScreen", (event, isFullScreen) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) win.setFullScreen(Boolean(isFullScreen));
});

ipcMain.on("app:quit", () => {
  app.quit();
});

ipcMain.on("app:setBadge", (event, text) => {
  if (app.dock) app.dock.setBadge(text || "");
});

ipcMain.on("app:getPath", (event, name) => {
  try {
    event.returnValue = app.getPath(name);
  } catch (e) {
    event.returnValue = null;
  }
});

ipcMain.on("app:getAppPath", (event) => {
  event.returnValue = app.getAppPath();
});

ipcMain.on("app:getLocale", (event) => {
  event.returnValue = app.getLocale();
});

ipcMain.on("set-allow-prerelease", (event, enabled) => {
  autoUpdater.allowPrerelease = Boolean(enabled);
});

ipcMain.on("inspect-element", (event, x, y) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) win.webContents.inspectElement(x, y);
});

ipcMain.on("show-context-menu", (event, template = [], coords = {}) => {
  const win = BrowserWindow.fromWebContents(event.sender);

  const items = template.map((item) => {
    if (!item.id) return item;
    return Object.assign({}, item, {
      click: () => event.sender.send("context-menu-clicked", item.id),
    });
  });

  Menu.buildFromTemplate(items).popup({
    window: win,
    x: coords.x,
    y: coords.y,
  });
});

// Get the content of a file as a raw buffer of bytes.
// Useful to convert a file path to a File instance.
// Example:
// NOTE: if path points to a folder, an empty
// file will be given.
ipcMain.handle("get-file-from-path", (event, path, readContents = true) => {
  return new Promise<any>((resolve, reject) => {
    fs.stat(path, (error, stats) => {
      if (error) {
        reject(error);
        return;
      }
      // Separate folders considering "\" and "/"
      // as separators (cross platform)
      const folders = path.split(/[\\/]/);
      const name = folders[folders.length - 1];
      if (stats.isDirectory()) {
        resolve({
          name,
          mime: undefined,
          path,
          buffer: new ArrayBuffer(0),
        });
        return;
      }
      if (!readContents) {
        resolve({
          name,
          mime: mime.getType(name) || undefined,
          path,
          buffer: new ArrayBuffer(0),
        });
        return;
      }
      // Encoding null ensures data results in a Buffer.
      fs.readFile(path, { encoding: null }, (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        resolve({
          name,
          mime: mime.getType(name) || undefined,
          path,
          buffer: data,
        });
      });
    });
  });
});

// For Settings > Appearance > Full screen.
ipcMain.handle("get-full-screen", (event) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  return Boolean(window && window.isFullScreen());
});

ipcMain.on("set-full-screen", (event, fullScreen) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  if (window) {
    window.setFullScreen(Boolean(fullScreen));
  }
});

ipcMain.handle("get-file-details-from-path", async (event, path) => {
  const isFfMp4 = (ffprobeResults: unknown) => {
    return (
      ffprobeResults &&
      ffprobeResults.format &&
      ffprobeResults.format.format_name &&
      ffprobeResults.format.format_name.includes("mp4")
    );
  };
  const folders = path.split(/[\\/]/);
  const name = folders[folders.length - 1];
  let duration = 0,
    size = 0,
    mimeType;
  try {
    await fs.promises.stat(path);
    let ffprobeResults;
    try {
      ffprobeResults = await probe(path);
      duration = ffprobeResults.format.duration;
      size = ffprobeResults.format.size;
    } catch (e: any) {}
    let fileReadResult;
    if (size < MAX_IPC_SEND_BUFFER_SIZE) {
      try {
        fileReadResult = await fs.promises.readFile(path);
      } catch (e: any) {}
    }
    // TODO: use mmmagic to inspect file and get mime type
    mimeType = isFfMp4(ffprobeResults) ? "video/mp4" : mime.getType(name);
    const fileData = {
      name,
      mime: mimeType || undefined,
      path,
      duration: duration,
      size,
      buffer: fileReadResult,
    } as const;
    return fileData;
  } catch (e: any) {
    // no stat
    return { error: "no file" };
  }
});

ipcMain.on("get-disk-space", async (event) => {
  try {
    const { data_dir } = await Lbry.settings_get();
    let diskSpace;
    switch (os.platform()) {
      case "linux":
        diskSpace = await diskSpaceLinux(data_dir);
        break;
      case "darwin":
        diskSpace = await diskSpaceMac(data_dir);
        break;
      case "win32":
        diskSpace = await diskSpaceWindows(data_dir);
        break;
      default:
        throw new Error("unknown platform");
    }
    rendererWindow.webContents.send("send-disk-space", { diskSpace });
  } catch (e: any) {
    rendererWindow.webContents.send("send-disk-space", { error: e.message || e });
    console.log("Failed to get disk space", e);
  }
});

ipcMain.on("version-info-requested", () => {
  function formatRc(ver: unknown) {
    // Adds dash if needed to make RC suffix SemVer friendly
    return ver.replace(/([^-])rc/, "$1-rc");
  }

  const localVersion = pjson.version;
  let result = "";
  const onSuccess = (res: unknown) => {
    res.on("data", (data) => {
      result += data;
    });

    res.on("end", () => {
      let json;
      try {
        json = JSON.parse(result);
      } catch (e: any) {
        return;
      }
      const tagName = json.tag_name;
      if (tagName) {
        const [, remoteVersion] = tagName.match(/^v([\d.]+(?:-?rc\d+)?)$/);
        if (!remoteVersion) {
          if (rendererWindow) {
            rendererWindow.webContents.send("version-info-received", localVersion);
          }
        } else {
          const upgradeAvailable = SemVer.gt(formatRc(remoteVersion), formatRc(localVersion));
          if (rendererWindow) {
            rendererWindow.webContents.send("version-info-received", {
              remoteVersion,
              localVersion,
              upgradeAvailable,
            });
          }
        }
      } else if (rendererWindow) {
        rendererWindow.webContents.send("version-info-received", { localVersion });
      }
    });
  };

  const requestLatestRelease = (alreadyRedirected = false) => {
    const req = https.get(
      {
        hostname: "api.github.com",
        path: "/repos/bitcoinbrisbane/lbry-desktop/releases/latest",
        headers: { "user-agent": `LBRY/${localVersion}` },
      },
      (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          requestLatestRelease(res.headers.location, true);
        } else {
          onSuccess(res);
        }
      }
    );

    if (alreadyRedirected) return;
    req.on("error", (err) => {
      console.log("Failed to get current version from GitHub. Error:", err);
      if (rendererWindow) {
        rendererWindow.webContents.send("version-info-received", null);
      }
    });
  };

  if (upgradeDisabled && rendererWindow) {
    rendererWindow.webContents.send("version-info-received", { localVersion });
    return;
  }

  requestLatestRelease();
});

ipcMain.on("launch-lbry-first", async () => {
  try {
    await startLbryFirst();
  } catch (e: any) {
    console.log("Failed to start LbryFirst");
    console.log(e);
  }
});

process.on("uncaughtException", (error) => {
  console.log(error);
  dialog.showErrorBox("Error Encountered", `Caught error: ${error}`);
  appState.isQuitting = true;
  if (daemon) daemon.quit();
  app.exit(1);
});

// Auto updater
autoUpdater.on("checking-for-update", () => {
  sendToRenderer("auto-update-checking");
});

autoUpdater.on("download-progress", () => {
  updateState = UPDATE_STATE_DOWNLOADING;
  sendToRenderer("auto-update-download-progress");
});

autoUpdater.on("update-downloaded", () => {
  updateState = UPDATE_STATE_DOWNLOADED;
  sendToRenderer("auto-update-downloaded");

  // If this download was trigger by
  // autoUpdateAccepted it means, the user
  // wants to install the new update but
  // needed to downloaded the files first.
  if (appState.autoUpdateAccepted) {
    autoUpdater.quitAndInstall();
  }
});

autoUpdater.on("update-available", (info) => {
  sendToRenderer("auto-update-available", info);

  if (updateState === UPDATE_STATE_DOWNLOADING) {
    return;
  }
  updateState = UPDATE_STATE_UPDATES_FOUND;
});

autoUpdater.on("update-not-available", () => {
  updateState = UPDATE_STATE_NO_UPDATES_FOUND;
  sendToRenderer("auto-update-not-available");
});

autoUpdater.on("error", (error) => {
  sendToRenderer("auto-update-error", error && error.message);

  if (updateState === UPDATE_STATE_DOWNLOADING) {
    updateState = UPDATE_STATE_UPDATES_FOUND;
    return;
  }
  updateState = UPDATE_STATE_INIT;
});

// Manual (.deb) update
ipcMain.on("cancel-download-upgrade", () => {
  if (updateDownloadItem) {
    // Cancel the download and execute the onCancel
    // callback set in the options.
    updateDownloadItem.cancel();
  }
});

ipcMain.on("download-upgrade", (event, params) => {
  if (updateState !== UPDATE_STATE_UPDATES_FOUND) {
    return;
  }
  if (isAutoUpdateSupported) {
    updateState = UPDATE_STATE_DOWNLOADING;
    autoUpdater.downloadUpdate();
    return;
  }

  const { url, options } = params;
  const dir = fs.mkdtempSync(app.getPath("temp") + path.sep);

  updateState = UPDATE_STATE_DOWNLOADING;

  // Grab the download item's handler to allow
  // cancelling the operation if required.
  options.onStarted = function (downloadItem: unknown) {
    updateDownloadItem = downloadItem;
  };
  options.onCancel = function () {
    updateState = UPDATE_STATE_UPDATES_FOUND;
    updateDownloadItem = undefined;
  };
  options.onProgress = function (p: unknown) {
    rendererWindow.webContents.send("download-progress-update", p);
  };
  options.onCompleted = function (c: unknown) {
    updateState = UPDATE_STATE_DOWNLOADED;
    updateDownloadItem = undefined;
    rendererWindow.webContents.send("download-update-complete", c);
  };
  options.directory = dir;
  const win = BrowserWindow.getFocusedWindow();
  download(win, url, options).catch((e) => {
    updateState = UPDATE_STATE_UPDATES_FOUND;
    console.log("e", e);
  });
});

// Update behavior
ipcMain.on("autoUpdateAccepted", () => {
  appState.autoUpdateAccepted = true;

  // quitAndInstall can only be called if the
  // update has been downloaded. Since the user
  // can disable auto updates, we have to make
  // sure it has been downloaded first.
  if (updateState === UPDATE_STATE_DOWNLOADED) {
    autoUpdater.quitAndInstall();
    return;
  }

  if (updateState !== UPDATE_STATE_UPDATES_FOUND) {
    return;
  }

  // If the update hasn't been downloaded,
  // start downloading it. After it's done, the
  // event 'update-downloaded' will be triggered,
  // where we will be able to resume the
  // update installation.
  updateState = UPDATE_STATE_DOWNLOADING;
  autoUpdater.downloadUpdate();
});

ipcMain.on("check-for-updates", (event, autoDownload) => {
  if (![UPDATE_STATE_INIT, UPDATE_STATE_NO_UPDATES_FOUND].includes(updateState)) {
    return;
  }

  updateState = UPDATE_STATE_CHECKING;

  // If autoDownload is true, checkForUpdates will begin the
  // download automatically.
  if (autoDownload) {
    updateState = UPDATE_STATE_DOWNLOADING;
  }

  autoUpdater.autoDownload = autoDownload;
  autoUpdater.checkForUpdates();
});

ipcMain.on("upgrade", (event, installerPath) => {
  // what to do if no shutdown in a long time?
  console.log("Update downloaded to", installerPath);
  console.log("The app will close and you will be prompted to install the latest version of LBRY.");
  console.log("After the install is complete, please reopen the app.");

  // Prevent .deb package from opening with archive manager (Ubuntu >= 20)
  if (process.platform === "linux" && !process.env.APPIMAGE) {
    sudo.exec(`dpkg -i ${installerPath}`, { name: app.name }, (err, stdout, stderr) => {
      if (err || stderr) {
        rendererWindow.webContents.send("upgrade-installing-error");
        return;
      }

      // Re-launch the application when the installation finishes.
      app.relaunch();
      app.quit();
    });

    return;
  }

  app.on("quit", () => {
    console.log("Launching upgrade installer at", installerPath);
    // This gets triggered called after *all* other quit-related events, so
    // we'll only get here if we're fully prepared and quitting for real.
    shell.openPath(installerPath);
  });
  app.quit();
});
