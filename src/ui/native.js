const Native = {};

// @if TARGET='app'
import { ipcRenderer } from 'electron';

Native.getAppVersionInfo = () =>
  new Promise(resolve => {
    ipcRenderer.once('version-info-received', (event, versionInfo) => {
      resolve(versionInfo);
    });
    ipcRenderer.send('version-info-requested');
  });

// @endif

// @if TARGET='web'
Native.getAppVersionInfo = () => console.error("Don't do this");
// @endif

export default Native;
