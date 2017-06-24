const { remote } = require("electron");
const application = remote.app;
const dock = application.dock;
const win = remote.BrowserWindow.getFocusedWindow();
const setBadge = text => {
  if (!dock) return;
  if (win.isFocused()) return;

  dock.setBadge(text);
};

export default setBadge;
