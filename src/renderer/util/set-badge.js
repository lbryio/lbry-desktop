import { remote } from 'electron';

const application = remote.app;
const { dock } = application;
const browserWindow = remote.getCurrentWindow();
const setBadge = text => {
  if (!dock) return;
  if (browserWindow.isFocused()) return;

  dock.setBadge(text);
};

export default setBadge;
