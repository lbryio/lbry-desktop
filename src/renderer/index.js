import React from "react";
import ReactDOM from "react-dom";
import App from "component/app/index.js";
import SnackBar from "component/snackBar";
import { Provider } from "react-redux";
import store from "store.js";
import SplashScreen from "component/splash";
import {
  doDaemonReady,
  doShowSnackBar,
  doConditionalAuthNavigate,
} from "redux/actions/app";
import { doNavigate } from "redux/actions/navigation";
import { doUserEmailVerify } from "redux/actions/user";
import { doDownloadLanguages } from "redux/actions/settings";
import * as types from "constants/action_types";
import amplitude from "amplitude-js";
import lbry from "lbry";
import "scss/all.scss";

const env = process.env.NODE_ENV || "production";
const { remote, ipcRenderer, shell } = require("electron");
const contextMenu = remote.require("./main.js").contextMenu;
const app = require("./app");

// Workaround for https://github.com/electron-userland/electron-webpack/issues/52
if (process.env.NODE_ENV !== "development") {
  window.staticResourcesPath = require("path")
    .join(remote.app.getAppPath(), "../static")
    .replace(/\\/g, "\\\\");
} else {
  window.staticResourcesPath = "";
}

window.addEventListener("contextmenu", event => {
  contextMenu.showContextMenu(
    remote.getCurrentWindow(),
    event.x,
    event.y,
    env === "development"
  );
  event.preventDefault();
});

ipcRenderer.on("open-uri-requested", (event, uri, newSession) => {
  if (uri && uri.startsWith("lbry://")) {
    if (uri.startsWith("lbry://?verify=")) {
      let verification = {};
      try {
        verification = JSON.parse(atob(uri.substring(15)));
      } catch (error) {}
      if (verification.token && verification.recaptcha) {
        app.store.dispatch(doConditionalAuthNavigate(newSession));
        app.store.dispatch(
          doUserEmailVerify(verification.token, verification.recaptcha)
        );
      } else {
        app.store.dispatch(
          doShowSnackBar({ message: "Invalid Verification URI" })
        );
      }
    } else {
      app.store.dispatch(doNavigate("/show", { uri }));
    }
  }
});

ipcRenderer.on("open-menu", (event, uri) => {
  if (uri && uri.startsWith("/help")) {
    app.store.dispatch(doNavigate("/help"));
  }
});

const dock = remote.app.dock;

ipcRenderer.on("window-is-focused", (event, data) => {
  if (!dock) return;
  app.store.dispatch({ type: types.WINDOW_FOCUSED });
  dock.setBadge("");
});

(function(history) {
  var replaceState = history.replaceState;
  history.replaceState = function(_, __, path) {
    amplitude
      .getInstance()
      .logEvent("NAVIGATION", { destination: path ? path.slice(1) : path });
    return replaceState.apply(history, arguments);
  };
})(window.history);

document.addEventListener("click", event => {
  var target = event.target;
  while (target && target !== document) {
    if (target.matches("a") || target.matches("button")) {
      // TODO: Look into using accessiblity labels (this would also make the app more accessible)
      let hrefParts = window.location.href.split("#");
      let element =
        target.title || (target.textContent && target.textContent.trim());
      if (element) {
        amplitude.getInstance().logEvent("CLICK", {
          target: element,
          location:
            hrefParts.length > 1 ? hrefParts[hrefParts.length - 1] : "/",
        });
      } else {
        amplitude.getInstance().logEvent("UNMARKED_CLICK", {
          location:
            hrefParts.length > 1 ? hrefParts[hrefParts.length - 1] : "/",
          source: target.outerHTML,
        });
      }
    }
    if (
      target.matches('a[href^="http"]') ||
      target.matches('a[href^="mailto"]')
    ) {
      event.preventDefault();
      shell.openExternal(target.href);
      return;
    }
    target = target.parentNode;
  }
});

const initialState = app.store.getState();

var init = function() {
  app.store.dispatch(doDownloadLanguages());

  function onDaemonReady() {
    lbry.status().then(info => {
      amplitude.getInstance().init(
        // Amplitude API Key
        "0b130efdcbdbf86ec2f7f9eff354033e",
        info.lbry_id,
        null,
        function() {
          window.sessionStorage.setItem("loaded", "y"); //once we've made it here once per session, we don't need to show splash again
          app.store.dispatch(doDaemonReady());

          ReactDOM.render(
            <Provider store={store}>
              <div>
                <App />
                <SnackBar />
              </div>
            </Provider>,
            document.getElementById("app")
          );
        }
      );
    });
  }

  if (window.sessionStorage.getItem("loaded") == "y") {
    onDaemonReady();
  } else {
    ReactDOM.render(
      <Provider store={store}>
        <SplashScreen onReadyToLaunch={onDaemonReady} />
      </Provider>,
      document.getElementById("app")
    );
  }
};

init();
