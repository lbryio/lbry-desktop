/* eslint-disable no-redeclare */
// @if TARGET='app'
import { remote } from 'electron';

const application = remote.app;
const { dock } = application;
const browserWindow = remote.getCurrentWindow();
const setBadge = text => {
  if (!dock) return;
  if (browserWindow.isFocused()) return;

  dock.setBadge(text);
};
// @endif

// @if TARGET='web'
const setBadge = () => {};
// @endif
/* eslint-enable no-redeclare */

export default setBadge;
