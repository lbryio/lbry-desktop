import React from "react";
import ReactDOM from "react-dom";
import App from "component/app/index.js";
import SnackBar from "component/snackBar";
import { Provider } from "react-redux";
import store from "store.js";
import SplashScreen from "component/splash";
import { doDaemonReady } from "redux/actions/app";
import { doNavigate } from "redux/actions/navigation";
import { doDownloadLanguages } from "redux/actions/settings";
import * as types from "constants/action_types";
import amplitude from "amplitude-js";

const env = ENV;
const { remote, ipcRenderer, shell } = require("electron");
const contextMenu = remote.require("./menu/context-menu");
const app = require("./app");

window.addEventListener("contextmenu", event => {
  contextMenu.showContextMenu(
    remote.getCurrentWindow(),
    event.x,
    event.y,
    env === "development"
  );
  event.preventDefault();
});

ipcRenderer.on("open-uri-requested", (event, uri) => {
  if (uri && uri.startsWith("lbry://")) {
    app.store.dispatch(doNavigate("/show", { uri }));
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

document.addEventListener("click", event => {
  var target = event.target;
  while (target && target !== document) {
    if (target.matches("a") || target.matches("button")) {
      // TODO: Log event
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
    window.sessionStorage.setItem("loaded", "y"); //once we've made it here once per session, we don't need to show splash again
    app.store.dispatch(doDaemonReady());

    ReactDOM.render(
      <Provider store={store}>
        <div>
          <App />
          <SnackBar />
        </div>
      </Provider>,
      canvas
    );
  }

  if (window.sessionStorage.getItem("loaded") == "y") {
    onDaemonReady();
  } else {
    ReactDOM.render(
      <Provider store={store}>
        <SplashScreen onReadyToLaunch={onDaemonReady} />
      </Provider>,
      canvas
    );
  }
};

amplitude
  .getInstance()
  .init("0b130efdcbdbf86ec2f7f9eff354033e", null, null, function() {
    init();
  });
