// @if TARGET='app'
import { ipcRenderer } from 'electron';
// @endif

const Native = {};

// @if TARGET='app'
Native.getAppVersionInfo = () =>
  new Promise(resolve => {
    // @if TARGET='app'
    ipcRenderer.once('version-info-received', (event, versionInfo) => {
      resolve(versionInfo);
    });
    ipcRenderer.send('version-info-requested');
    // @endif
  });
// @endif

export default Native;
