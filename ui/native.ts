//@ts-nocheck
// @if TARGET='app'
import {ipcRenderer} from 'electron';
// @endif

const Native: Record<string, any> = {};

// @if TARGET='app'
Native.getAppVersionInfo = () =>
  new Promise(resolve: unknown => {
    // @if TARGET='app'
    ipcRenderer.once('version-info-received', (event, versionInfo) => {
      resolve(versionInfo);
    });
    ipcRenderer.send('version-info-requested');
    // @endif
  });
// @endif

export default Native;
